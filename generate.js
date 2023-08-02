const fs = require('fs');
const path = require('path');
require('dotenv').config();
const fsextra = require('fs-extra');
const axios = require('axios');
const util = require('util');
const markdownIt = require('markdown-it');
const readFileAsync = util.promisify(fs.readFile);
const bilibili = require('./utils/video/bilibili');
const parse = require('./utils/docs/summary');
const DOCS_DIR = path.join(__dirname, 'docs');
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const weights = require('./weights');
const md = markdownIt();


function pathReplace(path) {
  return path.replace(".md", '').replace(/\d+_/, "").replace(/%20/g, " ")
}

async function fillterCategoryDoc(summary) {
  // 读内容==> 空: generated-index : 有: doc
  async function traverseItems(items) {
    for (const item of items) {
      if (item.type === 'category' && item?.link) {
        const data = await readFileAsync("./docs/"+item.link.id+".md", 'utf8');
        if (data === "") {
          item.link = { type: 'generated-index' }
        }
      }
      if (item.items && item.items.length > 0) {
        await traverseItems(item.items);
      }
    }
  }
  await traverseItems(summary)
  return summary
}

async function getPlaylistVideos(apiKey, playlistId) {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';
  const params = {
    part: 'snippet',
    playlistId: playlistId,
    key: apiKey,
    maxResults: 50 // 可以自定义每次请求返回的最大结果数量
  };

  let videoItems = [];

  try {
    while (true) {
      const response = await axios.get(baseUrl, { params });
      const data = response.data;
      for (const item of data.items) {
        const snippet = item.snippet;
        const videoId = snippet.resourceId.videoId;
        videoItems.push({
            label: snippet.title,
            id: videoId
        });
      }

      if (data.nextPageToken) {
        params.pageToken = data.nextPageToken;
      } else {
        break;
      }
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }

  return videoItems;
}

function getCategory({catalogueName,title,label}) {
  const newTitle = title.replace(".md",'').replace(/\d+_/, "").replace(/%20/g, " ");
  const url = catalogueName + "/" + newTitle;
  const obj = {
    type: "category",
    label: title,
    link: url,
    items: [],
    collapsed: true
  }
  const link = {
    type: "doc",
    id: url.replace("./", "").replace(".md",'').replace(/\d+_/, "").replace(/%20/g, " "),
    label: label,
  }
  return {
    link,
    obj
  }
}

function getDirectory(data, catalogueName) {
  const lines = data.split('\n');
  // 解析每一行的配置信息
  const summary = [];
  let currentLabel = null;
  let currentChapter = null;
  let currentSection = null;

  lines.forEach((line, i) => {
    const matchTitle = line.match(/^##\s+(.+)$/)
    const matchChapter = line.match(/^\* \[([^[\]]+)\]\(([^()]+)\)$/);
    const matchSection = line.match(/^  \* \[([^[\]]+)\]\(([^()]+)\)$/);

    // 匹配`##`标题
    if (matchTitle) {
      const chapterTitle = matchTitle[1];
      currentLabel = {
        type: "category",
        label: chapterTitle,
        collapsible: false,
        collapsed: true,
        items: []
      }
      summary.push(currentLabel);
    } else if (matchChapter && currentLabel) {
        // 匹配`*`且传给父的items
          const isCategory = lines.length > i+1 && lines[i+1].match(/^  \* \[([^[\]]+)\]\(([^()]+)\)$/);
          if (isCategory) {
            // 有子
            let { obj } = getCategory({catalogueName, title: matchChapter[2]})
            currentChapter = {...obj, link: {type: 'doc', id: obj.link}, label: matchChapter[1]}
            currentLabel.items.push(currentChapter);
          } else {
            // 无子
            const { link } = getCategory({catalogueName, title: matchChapter[2], label: matchChapter[1]})
            currentLabel.items.push(link);
          }
    } else if (matchChapter) {
          // 匹配`*`且传给summary
          const isCategory = lines.length > i+1 && lines[i+1].match(/^  \* \[([^[\]]+)\]\(([^()]+)\)$/);
          if (isCategory) {
            // 有子
            const { obj } = getCategory({catalogueName, title: matchChapter[2]})
            currentChapter = {...obj, link: {type: 'doc', id: obj.link}, label: matchChapter[1]}
            summary.push(currentChapter);
          } else {
            // 无子
            const { link } = getCategory({catalogueName, title: matchChapter[2], label: matchChapter[1]})
            summary.push(link);
          }
    } else if (matchSection && currentChapter) {
      const sectionTitle = matchSection[1];
      const sectionLink = matchSection[2];
      // currentSection = { title: sectionTitle, link: sectionLink };
      const { link } = getCategory({catalogueName, title: sectionLink, label: sectionTitle})
      currentSection = link;
      currentChapter.items.push(currentSection);
    }
  });
  const isStringFound = summary.some(item => item?.id?.includes(catalogueName + "/README"));
  if (!isStringFound) {
    summary.unshift({
        type: 'doc',
        id: `${catalogueName}/README`,
        label: '简介',
    })
  }
  return summary;
}

async function getMdBook(data, catalogueName) {
  const tokens = md.parse(data, {});
  const summary = parse.parseSummary(tokens, catalogueName);
  const isStringFound = summary.some(item => item?.id?.includes(catalogueName + "/README"));
  if (!isStringFound && catalogueName !== "ingopedia") {
    summary.unshift({
        type: 'doc',
        id: `${catalogueName}/README`,
        label: '简介',
    })
  }
  // 查找type为category且本身有内容的文档
  await fillterCategoryDoc(summary)
  
  return summary;
}

const tutorialGitbook = async(filename, root, tutorial) => {
  return await new Promise((resolve, reject) => {
    fs.readFile(root+"/"+filename, 'utf8', (err, data) => {
      if (err) reject(err)
      const arr = getDirectory(data, tutorial.catalogueName);
      resolve(arr)
    });
  }).then(res => {
    return res
  })
}

const tutorialDocusaurus = async(file) => {
  return [
    {
        type: "autogenerated",
        dirName: file
    }
  ]
}

const tutorialMdBook = async(filename, root, tutorial) => {
  return await new Promise((resolve, reject) => {
    fs.readFile(root+"/"+filename, 'utf8', async(err, data) => {
      if (err) reject(err)
      const arr = await getMdBook(data, tutorial.catalogueName)
      resolve(arr)
    });
  }).then(res => {
    return res
  })
}

const getSidebars = async(files, tutorials, sidebars = {}) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const root = DOCS_DIR+"/"+file;
    const tutorial = tutorials.filter(e => e.catalogueName === file)[0];
    // 读取当前文件目录
    const filename = "SUMMARY.md"
    if (tutorial) {      
      switch (tutorial.docType) {
        case "gitbook":
          sidebars[file] = await tutorialGitbook(filename, root, tutorial)
          break;
        case "docusaurus":
        case "video":
          sidebars[file] = await tutorialDocusaurus(file)
          break;
        case "mdBook":
          sidebars[file] = await tutorialMdBook(filename, root, tutorial)
          break;
        default:
          break;
      }
    }
  }
  return sidebars;
};

function readJsonFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  function getCategoryJsonFiles(filepath) {
    const files = fs.readdirSync(filepath);
    return files.filter((file) => fs.statSync(`${filepath}/${file}`).isDirectory());
  }

  function findMDFiles(files) {
    let startPage = "";
    for (let i = 0; i < files.length; i++) {
      const regex = new RegExp(`^${i}_`);
      const matchingFiles = files.filter((file) => {
        return regex.test(file) && file.endsWith('.md');
      });
      if (matchingFiles.length > 0) {
        startPage = matchingFiles[0]
        return startPage
      }
    }
  }

  function filterMDFiles(path) {
    return fs.readdirSync(path, (err, files) => {
      if (err) {
        console.error('读取目录失败:', err);
        return;
      }
      return files
    });
  }
  
  async function categoryContrast(path, filepath) {
    let startPage = {
      value: pathReplace(path),
      index: Number(path.split("_")[0])
    };
    const categoryJsonFiles = getCategoryJsonFiles(filepath);
    let maxPosition = {
      position: 999,
      jsonFile: ""
    };
    categoryJsonFiles.forEach((jsonFile) => {
      const jsonData = JSON.parse(fs.readFileSync(`${filepath}/${jsonFile}/_category_.json`, 'utf8'));
      if (jsonData.position < maxPosition.position) {
        maxPosition = {
          position: jsonData.position,
          jsonFile: jsonFile
        }
      }
    });
    // 如果category.json比当前的startpage还要小，则遍历当前category.json的目录
    if (maxPosition.position < startPage.index) {
      const files = filterMDFiles(`${filepath}/${maxPosition.jsonFile}`);
      const path = findMDFiles(files)
      startPage.value = maxPosition.jsonFile + "/" + pathReplace(path);
    }
    return startPage.value
  }

  async function getStartPage(file, item) {
    let page;
    if (item.docType === "gitbook" || item.docType === "mdBook") {
      page = "README"
    }else {
      // docusaurus
      const filepath = `./docs/${item.catalogueName}`;
      const files = filterMDFiles(filepath);
        const path = findMDFiles(files)
        const res = await categoryContrast(path, filepath)
        page = res;
    }
    return page
  }

const getNavbarItems = async(files, tutorials, navbarItems = []) => {
  await new Promise(async(resolve, reject) => {
      for (let i = 0; i < tutorials.length; i++) {
        const e = tutorials[i];
        const file = files.filter(item => item === e.catalogueName)[0];
        const obj = {
          type: 'doc',
          position: 'left',
          label: e.label,
          docId: "",
          category: e.category
        }
        if (e.docType !== "video") {
          const startPage = await getStartPage(file, e);
          obj.docId = file+"/"+startPage;
        }else{
          obj.docId = file+"/video0";
        }
        navbarItems.push(obj)
        if (i + 1 === tutorials.length) {
          resolve()
        }
      }
      
  })
  return navbarItems;
};


async function generateSidebars(files, tutorials) {
  const sidebar = await getSidebars(files, tutorials);
  // 侧边栏
  fs.writeFileSync(
    path.join(__dirname, 'sidebars.js'),
    `module.exports = ${JSON.stringify(sidebar, null, 2)};`
  );
}

async function generateNavbarItemsFile(files, tutorials) {
  const navbarItems = await getNavbarItems(files, tutorials);
  fs.writeFileSync(
    path.join(__dirname, 'navbarItems.js'),
    `module.exports = ${JSON.stringify(navbarItems, null, 2)};`
  );
}

async function startGenerate(ele) {
  let videoItems = []
  // 移除之前生成的文档 => 生成新文档
  const folderPath = `./docs/${ele.catalogueName}`;
  await new Promise(async(resolve, reject) => {        
    await fsextra.remove(folderPath);
    fs.mkdir(folderPath, (err) => {
      if (err) {
        // 如果出现错误，例如文件夹已存在或权限问题，会在这里处理
        console.error('无法创建文件夹:', err);
        reject();
      } else {
        console.log('文件夹已成功创建。');
        resolve();
      }
    });
  })
  // TODO: 判断适配类型: bilibili、Youtebe
  if (ele.videoCategory === "youtube") {
    // 发起请求 ==> 获取播放列表内容
    const playlistId = ele.url.split("=").pop();
    await getPlaylistVideos(youtubeApiKey, playlistId)
    .then(result => {
      if (result.length > 0) {
        videoItems = result;
      } else {
        console.log('Failed to fetch video links.');
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
  }else{
    // bilibili
    const arr = ele.videoItems;
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      element.time_length = await bilibili.getBilibiliTimeLength(element.id);
    }
    videoItems = arr;
  }
  // 根据有序配置添加权重
  if (ele?.sort) {
    videoItems.sort();
    videoItems.forEach(obj => {
      obj.weights = 200;
    })
    videoItems = weights.toSort(ele.catalogueName, videoItems);
  }
  for (let i = 0; i < videoItems.length; i++) {
    const videoItem = videoItems[i];
    const fileName = `./docs/${ele.catalogueName}/${i}_video${i}.md`;
    const fileContent = `# ${videoItem.label}\n\n<CustomVideo videoId="${videoItem.id}" videoCategory="${ele.videoCategory}" ${videoItem.time_length ? "time_length=\"" + videoItem.time_length + "\"" : ""} />`;

    // 使用 fs.writeFile() 创建并写入文件
    await new Promise((resolve, reject) => {
      fs.writeFile(fileName, fileContent, (err) => {
        if (err) {
          console.error(`无法写入文件 ${fileName}:`, err);
          reject()
        } else {
          console.log(`文件 ${fileName} 已成功创建。`);
          resolve()
        }
      });
    })
  }
}

async function generateVideo(tutorials) {
  for (let i = 0; i < tutorials.length; i++) {
    const ele = tutorials[i];
    if (ele.docType === "video") {
      await startGenerate(ele)
    }
  }
}


const main = async () => {
  const tutorials = await readJsonFile("tutorials.json");
  // video生成.md文件
  await generateVideo(tutorials);

  const files = fs.readdirSync(DOCS_DIR);
  await generateSidebars(files, tutorials);
  await generateNavbarItemsFile(files, tutorials); // 执行函数
}

module.exports = {
  main
};