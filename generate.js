const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, 'docs');

function pathReplace(path) {
  return path.replace(".md", '').replace(/\d+_/, "").replace(/%20/g, " ")
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

function getMdBook(data, catalogueName) {
  const lines = data.split('\n');
  const summary = [];
  let currentChapter = null;
  let currentSection = null;
  let currentSubSection = null; // 新增一个变量来跟踪小节中的小节

  lines.forEach((line) => {
    const matchChapter = line.match(/^- \[([^[\]]+)\]\(([^()]+)\)$/);
    const matchSection = line.match(/^    - \[([^[\]]+)\]\(([^()]+)\)$/);
    const matchSection2 = line.match(/^      - \[([^[\]]+)\]\(([^()]+)\)$/);

    if (matchChapter) {
      const chapterTitle = matchChapter[1];
      const chapterLink = matchChapter[2];
      currentChapter = {
        type: 'category',
        label: chapterTitle.replace("./", catalogueName + "/").replace(".md", '').replace(/\d+_/, "").replace(/%20/g, " "),
        items: []
      };
      summary.push(currentChapter);
      currentSection = null;
      currentSubSection = null; // 重置小节中的小节
    } else if (matchSection) {
      const sectionTitle = matchSection[1];
      const sectionLink = matchSection[2];
      const { link } = getCategory({ catalogueName, title: sectionLink, label: sectionTitle });
      currentSection = link;
      currentChapter.items.push(currentSection);
      currentSubSection = null; // 重置小节中的小节
    } else if (matchSection2 && currentSection) {
      const subSectionTitle = matchSection2[1];
      const subSectionLink = matchSection2[2];
      const { link } = getCategory({ catalogueName, title: subSectionLink, label: subSectionTitle });
      currentSubSection = link;
      // 注意这里，我们将小节中的小节添加到当前小节的`items`数组中
      if (currentSection?.id) {
        currentSection.link = {type: 'doc', id: currentSection.id}
        delete currentSection.id
      }
      currentSection.items = currentSection.items || [];
      currentSection.items.push(currentSubSection);
      currentSection.type = 'category';
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
    fs.readFile(root+"/"+filename, 'utf8', (err, data) => {
      if (err) reject(err)
      const arr = getMdBook(data, tutorial.catalogueName)
      resolve(arr)
    });
  }).then(res => {
    return res
  })
}

const getSidebars = async(dir, sidebars = {}) => {
    const files = fs.readdirSync(dir);
    const tutorials = await readJsonFile("tutorials.json");
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const root = dir+"/"+file;
    const tutorial = tutorials.filter(e => e.catalogueName === file)[0];
    // 读取当前文件目录
    const filename = "SUMMARY.md"
    switch (tutorial.docType) {
      case "gitbook":
        sidebars[file] = await tutorialGitbook(filename, root, tutorial)
        break;
      case "docusaurus":
        sidebars[file] = await tutorialDocusaurus(file)
        break;
        case "mdBook":
        sidebars[file] = await tutorialMdBook(filename, root, tutorial)
        break;
      default:
        break;
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
    // TODO: 如果category.json比当前的startpage还要小，则遍历当前category.json的目录
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

const getNavbarItems = async(dir, navbarItems = []) => {
    const files = fs.readdirSync(dir);
    const tutorials = await readJsonFile("tutorials.json");
    await new Promise((resolve, reject) => {
      tutorials.map(async(e, i) => {
        const file = files.filter(item => item === e.catalogueName)[0];
        const startPage = await getStartPage(file, e);
        navbarItems.push({
          type: 'doc',
          docId: file+"/"+startPage,
          position: 'left',
          label: e.label,
        })
        if (i + 1 === tutorials.length) {
          resolve()
        }
      })
    })
    return navbarItems.reverse();
};


async function generateSidebars(params) {
  const sidebar = await getSidebars(DOCS_DIR);

// 侧边栏
fs.writeFileSync(
  path.join(__dirname, 'sidebars.js'),
  `module.exports = ${JSON.stringify(sidebar, null, 2)};`
);
}

async function generateNavbarItemsFile() {
    const navbarItems = await getNavbarItems(DOCS_DIR);
    fs.writeFileSync(
      path.join(__dirname, 'navbarItems.js'),
      `module.exports = ${JSON.stringify(navbarItems, null, 2)};`
    );
}


const main = async () => {
  
  generateSidebars();
  generateNavbarItemsFile(); // 执行函数
}

main();