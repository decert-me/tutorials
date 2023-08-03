const util = require('util');
const fs = require('fs');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const fsextra = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const axios = require('axios');
const { execSync } = require('child_process');

const common = {
  gitbook: "/",
  mdBook: "/",
  docusaurus: "/docs"
}

// 辅助函数：从GitHub仓库URL中提取仓库路径（格式为：username/repo）
function getRepoPath(repoUrl) {
  const repoPath = repoUrl.replace('https://github.com/', '');
  return repoPath.endsWith('.git') ? repoPath.slice(0, -4) : repoPath;
}

const downloadFile = async(repoUrl, commitHash) => {
  const targetFolder = `./tmpl/${repoUrl.split("/").reverse()[0]}`; // 替换为你要将代码拉取到的目标文件夹
  await axios.get(`https://api.github.com/repos/${getRepoPath(repoUrl)}`)
  .then(async(response) => {
    const repoInfo = response.data;
    const cloneUrl = repoInfo.clone_url;

    // 使用Git命令将代码克隆到目标文件夹
    try {
      execSync(`git clone ${cloneUrl} ${targetFolder}`);
      console.log('代码克隆成功！');

      if (commitHash) {        
        // 切换到指定的commit
        execSync(`cd ${targetFolder} && git checkout ${commitHash}`);
        console.log(`已切换到commit：${commitHash}`);
      }
    } catch (error) {
      console.error('代码克隆或切换commit失败:', error.message);
    }
  })
  .catch(error => {
    console.error('获取GitHub仓库信息失败:', error.message);
  });
};

const downloadAllFiles = async (filesToDownload) => {
  for (let i = 0; i < filesToDownload.length; i++) {
    if (filesToDownload[i]) {
      const {repoUrl, commitHash, catalogueName} = filesToDownload[i];
      await downloadFile(repoUrl, commitHash, catalogueName);
    }
  }
};


const extractFilesAndCopyFolder = async(destinationPath, filesNames, filesToDownload, tutorial) => {
    const { catalogueNames, docTypes, docPath } = tutorial;
    for (let i = 0; i < filesToDownload.length; i++) {
        if (filesToDownload[i]) {
          const filePath = common[docTypes[i]];
          const newPath = docPath[i] || "";
          try {
            // 将 folderToCopy 从 destinationPath 复制到另一个文件夹
            const sourceFolder = path.join(destinationPath, filesNames[i] + filePath + newPath);
            console.log(sourceFolder, "===>", filesNames[i]);
            const destinationFolder = `./docs/${catalogueNames[i]}`;
            await fsextra.copy(sourceFolder, destinationFolder);
          } catch (err) {
            console.error(err);
          }
        }
    }
}

const createFolder = (folderPath) => {
    fs.mkdir(folderPath, (err) => {
      if (err) {
        console.error(`Error creating folder: ${err}`);
      } else {
        console.log(`Folder created successfully: ${folderPath}`);
      }
    });
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


const buildProject = () => {
  console.log("start build");
  return new Promise((resolve, reject) => {
    const buildCommand = 'npm run docusaurus build';
    exec(buildCommand, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running build command: ${err}`);
        reject(err);
      } else {
        console.log('Build completed successfully');
        resolve();
      }
    });
  });
};

const compatible = () => {
  return new Promise((resolve, reject) => {
    const compatibleCommand = 'node compatible.js';
    exec(compatibleCommand, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running compatible command: ${err}`);
        reject(err);
      } else {
        console.log('compatible successfully');
        resolve();
      }
    });
  });
};

const main = async () => {
  
  // init 
  const index = process.argv.slice(2)[0];
  const arr = await readJsonFile("tutorials.json");
  let tutorials = arr;
  if (index) {
    arr.map((e, i) => {
      if (e.catalogueName === index) {
        tutorials = [arr[i]]
      }
    })
  }

  const filesToDownload = tutorials.map(e => {
    if (e.docType === "video") {
      return
    }
    const file = e.repoUrl;
    const url = file.split("/").reverse();
    return {
      repoUrl: `${url[1]}/${url[0]}`,
      commitHash: e.commitHash,
      catalogueName: e.catalogueName
    }
  })

  const filesNames = tutorials.map(e => {
    if (e.docType === "video") {
      return
    }
    const file = e.repoUrl;
    const url = file.split("/").reverse();
    return url[0]
  })

  const tutorial = tutorials.reduce((acc, e) => {
    acc.catalogueNames.push(e.catalogueName);
    acc.docTypes.push(e.docType);
    acc.docPath.push(e.docPath);

    return acc;
  }, { catalogueNames: [], docTypes: [], docPath: [] });


  //  全量更新时预先删除
  !index && await fsextra.remove("./docs");     

  // mkdir
  const folder = "./tmpl";
  const generate = require('./generate');
  createFolder(folder);
  createFolder("./docs")
  // Download all files
  await downloadAllFiles(filesToDownload);

  // Extract downloaded files
  // copy to the docs
  await extractFilesAndCopyFolder(folder, filesNames, filesToDownload, tutorial);

  // Delete destinationPath
  await fsextra.remove(folder)

  await generate.main();

  await compatible();
  // Build project
  await buildProject();

  const buildPath = "./build/tutorials.json";
  // 将JSON放到build中
  await fsextra.copy("./tutorials.json", "./build/tutorials.json")
  .then(res => {
    console.log('copy tutorials.json successfully');
  })
  const json = await readFileAsync(buildPath, 'utf8');
  const data = eval(json);
  const navbarItems = require("./navbarItems");

  data.forEach((ele, index) => {
    ele.startPage = navbarItems[index].docId;
  })

  await writeFileAsync(buildPath, JSON.stringify(data), 'utf8');
};

main();