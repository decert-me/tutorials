const fs = require('fs');
const fsAsync = require('fs').promises;
const path = require('path');
require('dotenv').config();
const fsextra = require('fs-extra');
const axios = require('axios');
const util = require('util');
const writeFileAsync = util.promisify(fs.writeFile);
const markdownIt = require('markdown-it');
const readFileAsync = util.promisify(fs.readFile);
const parse = require('./utils/docs/summary');
const DOCS_DIR = path.join(__dirname, 'docs');
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
            id: videoId,
            img: snippet.thumbnails.maxres.url,
            url: `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`
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

async function getParseSummary(data, catalogueName, root) {
  const tokens = md.parse(data, {});
  const summary = parse.parseSummary(tokens, catalogueName);
  const isStringFound = summary.some(item => item?.id?.includes(catalogueName + "/README"));
  // 检测是否存在README.md
  const filePath = `${root}/README.md`;
  if (!isStringFound && fs.existsSync(filePath)) {
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

const tutorialDocusaurus = async(file) => {
  return [
    {
        type: "autogenerated",
        dirName: file
    }
  ]
}

const getSummary = async(filename, root, tutorial) => {
  return await new Promise((resolve, reject) => {
    fs.readFile(root+"/"+filename, 'utf8', async(err, data) => {
      if (err) reject(err)
      const arr = await getParseSummary(data, tutorial.catalogueName, root)
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
          sidebars[file] = await getSummary(filename, root, tutorial)
          break;
        case "docusaurus":
        case "video":
          sidebars[file] = await tutorialDocusaurus(file)
          break;
        case "mdBook":
          sidebars[file] = await getSummary(filename, root, tutorial)
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
      const text = require("./sidebars.js")
      page = text[item.catalogueName][0].id;
    }else {
      // docusaurus
      const filepath = `./docs/${item.catalogueName}`;
      const files = filterMDFiles(filepath);
        const path = findMDFiles(files)
        const res = await categoryContrast(path, filepath)
        page = file+"/"+res;
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
          obj.docId = startPage;
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


async function generateSidebars(files, tutorials, isNull) {
  if (isNull) {
    fs.writeFileSync(
      path.join(__dirname, 'sidebars.js'),
      `module.exports = {};`
    );
    return
  }
  const sidebar = await getSidebars(files, tutorials);
  // 侧边栏
  fs.writeFileSync(
    path.join(__dirname, 'sidebars.js'),
    `module.exports = ${JSON.stringify(sidebar, null, 2)};`
  );
}

async function generateNavbarItemsFile(files, tutorials, isNull) {
  if (isNull) {
    fs.writeFileSync(
      path.join(__dirname, 'navbarItems.js'),
      `module.exports = [];`
    );
    return
  }
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
  videoItems = ele.video;
  
  for (let i = 0; i < videoItems.length; i++) {
    // 判断适配类型: bilibili、Youtebe
    let fileName = ""
    let fileContent = ""
    if (ele.videoCategory === "youtube") {
      const videoItem = videoItems[i];
      fileName = `./docs/${ele.catalogueName}/${i}_video${i}.md`;
      fileContent = `# ${videoItem.label}\n\n<CustomVideo videoId="${videoItem.id}" videoCategory="${ele.videoCategory}" ${videoItem.time_length ? "time_length=\"" + videoItem.time_length + "\"" : ""} youtubeInfo={${ele.videoCategory === "youtube" ? JSON.stringify(videoItem) : null}} />`;
    }else{
      const {label, code} = videoItems[i];
      const regex = /aid=([^&]+)&bvid=([^&]+)&cid=([^&]+)/;
      const match = code.match(regex);
      fileName = `./docs/${ele.catalogueName}/${i}_video${i}.md`;
      fileContent = `# ${label}\n\n<CustomVideo videoId="${match[0]}" videoCategory="bilibili" />`;
    }


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

async function startGeneratePage(ele) {
  const res = await axios.get(ele.repoUrl);
  const folderPath = `./src/pages/${ele.catalogueName}`;
  fs.mkdir(folderPath, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  let mdContent = res.data;
  // 处理图片
  const regex = /!\[.*?\]\((.*?)\)/g;
  const matchedUrls = mdContent.match(regex);
  const imageUrls = matchedUrls && matchedUrls.map(url => url.replace(/!\[.*?\]\((.*?)\)/, '$1'));
  imageUrls.forEach(e => {
    if (!/^(http|https):\/\//.test(e)) {
      let url = ele.repoUrl.split(/(master|main)\//)[0];
      const branch = ele.repoUrl.includes("master") ? "master" : "main";
      mdContent = mdContent.replace(e, url + branch + "/" + e);
    }
  })

  // 处理公式
  mdContent = mdContent.replace(/eqnarray\*/g, "matrix");
  mdContent = mdContent.replace(/eqnarray/g, "matrix");
  mdContent = mdContent.replace(/align\*/g, "matrix");
  mdContent = mdContent.replace(/align/g, "matrix");

  fs.writeFileSync(
    path.join(folderPath, "index.md")
  , mdContent)
}

async function generateVideo(tutorials) {
  for (let i = 0; i < tutorials.length; i++) {
    const ele = tutorials[i];
    if (ele.docType === "video") {
      await startGenerate(ele)
    }
  }
}

async function generatePage(tutorials) {
  for (let i = 0; i < tutorials.length; i++) {
    const ele = tutorials[i];
    if (ele.docType === "page") {
      await startGeneratePage(ele)
    }
  }
}

async function replaceStr(selectArr, path) {
  // 读一次
  const regex = /^\W+ /;
  const data = await readFileAsync(path, 'utf8');
  let modifiedData = data.split("\n");
  let reduceLine = 0;      // 记录减少的行号
  for (let i = 0; i < selectArr.length; i++) {
    const item = selectArr[i]
    try {
      item.msgid.split("\n").forEach((e, index) => {
        // 修改文件内容
        const match = modifiedData[item.line + index].match(regex);
        if (match && index === 0) {
          modifiedData[item.line + index] = match[0];
        }else{
          modifiedData[item.line + index] = "";
        }
      })

      if (item.msgstr === `""`) {
        modifiedData[item.line] = (modifiedData[item.line] + item.msgid.replace(/"/g, "").replace(/^\n+/, "").replace(/\\/g, "").replace(/\(([^)]+)\)/g, function(match) {
    return match.replace(/[\n\s]/g, '');
})).trim() || "";
      }else{
        modifiedData[item.line] = (modifiedData[item.line] + item.msgstr.replace(/"/g, "").replace(/^\n+/, "").replace(/\\/g, "").replace(/\(([^)]+)\)/g, function(match) {
    return match.replace(/[\n\s]/g, '');
})).trim() || "";
      }
    } catch (err) {
      console.error(`Error modifying file: ${err}`);
    }
  }
  // selectArr.forEach(item => {
  //   for (let i = 0; i < ((item.msgstr.split("\n").length - 2)); i++) {
  //     modifiedData.splice(item.line + 1, 1)
  //   }
  // })
  modifiedData = modifiedData.join('\n');
  // 写入文件
  await writeFileAsync(path, modifiedData, 'utf8');
}

async function processLineByLine(input) {
  const regex1 = /#: (.*?)\nmsgid/s;
  const regex2 = /msgid "(.*?)"(?=\nmsgstr)/s;
  const path = [];
  const msgid = [];
  const msgstr = [];
  const line = [];

  input.forEach(ele => {
    // console.log(regex1.exec(ele)[1]);
    const str = ele.match(regex1)[1].replace("\n#:","").split("\n")[0];
    const paths = str.split(" ");
    if (paths.length !== 1) {
      for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        path.push(p.split(":")[0].replace("src/",""));
        line.push(p.split(":")[1]);
        msgid.push(regex2.exec(ele)[1]);
        msgstr.push(ele.split("msgstr ")[1]);
      }
    }else{
      path.push(paths[0].split(":")[0].replace("src/",""));
      line.push(paths[0].split(":")[1]);
      msgid.push(regex2.exec(ele)[1]);
      msgstr.push(ele.split("msgstr ")[1]);
    }
  })

  const result = path.map((value, index) => {
    return {
      path: value,
      msgid: msgid[index],
      msgstr: msgstr[index],
      line: line[index] - 1,
    }
  })
  return result
}

async function translatorMdBook(items) {
  await items.forEach(async(item) => {
    const path = `./tmpl/${item.catalogueName}/${item.repoUrl.split("/").pop()}${item.mdbookTranslator}`;
    const data = await fsAsync.readFile(path, 'utf8');
    const block = data.split("\n\n");
    block.splice(0,1);
    const res = await processLineByLine(block);
    let groupedByPath = res.reduce((result, currentItem) => {
      (result[currentItem['path']] = result[currentItem['path']] || []).push(currentItem);
      return result;
    }, {});
    for (const key in groupedByPath) {
      const element = groupedByPath[key];
      await replaceStr(element, `./docs/${item.catalogueName}/${key}`)
    }
  })
}

const main = async () => {
  const index = process.argv.slice(2)[0];
  const arr = await readJsonFile("tutorials.json");
  let tutorials = arr.filter(e => e.docType !== "page");
  let mdbook = tutorials.filter(e => e?.mdbookTranslator);
  if (index) {
    arr.map((e, i) => {
      if (e.catalogueName === index) {
        tutorials = [arr[i]]
      }
    })
  }

  // video生成.md文件
  await generateVideo(tutorials);
  
  // page生成.md文件
  await generatePage(arr);

  // mdBook语种切换
  if (mdbook.length !== 0) {
    await translatorMdBook(mdbook)
  }
  if (tutorials.length === 0) {
    const filePath = path.join("./docs", "index.md");
    fs.writeFileSync(filePath, '', function(err) {
      if(err) {
          return console.log(err);
      }
    }); 
  }
  const files = fs.readdirSync(DOCS_DIR);
  await generateSidebars(files, tutorials, tutorials.length === 0);
  await generateNavbarItemsFile(files, tutorials, tutorials.length === 0); // 执行函数
}

module.exports = {
  main
};