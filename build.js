const https = require('https');
const fs = require('fs');
const fsextra = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const JSZip = require('jszip');

const common = {
  gitbook: "/",
  mdBook: "/",
  docusaurus: "/docs"
}

const downloadFile = (url, destinationPath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const stream = fs.createWriteStream(destinationPath);
      res.pipe(stream);
      stream.on('finish', () => {
        console.log(`File downloaded successfully: ${destinationPath}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error downloading file: ${err.message}`);
      reject(err);
    });
  });
};

const downloadAllFiles = async (folder, filesToDownload) => {
  for (let i = 0; i < filesToDownload.length; i++) {
    if (filesToDownload[i]) {
      const file = filesToDownload[i];
      await downloadFile(file, folder+"/"+i+".zip");
    }
  }
};

const extractFiles = async(sourcePath, destinationPath) => {

  await new Promise((resolve, reject) => {
    fs.readFile(sourcePath, function(err, data) {
      if (err) throw err;
      const zip = new JSZip();
      // 使用JSZip加载压缩文件数据
      zip.loadAsync(data)
        .then(function(zip) {
          // 遍历压缩文件中的所有文件
          zip.forEach(function(relativePath, zipEntry) {
            const path = destinationPath + "/" + zipEntry.name;
            // 如果是文件夹，则创建相应的文件夹
            if (zipEntry.dir) {
              fs.mkdirSync(path);
            } else {
              // 提取文件内容
              zipEntry.async('nodebuffer').then(function(content) {
                // 将文件内容写入磁盘
                fs.writeFileSync(path, content);
              });
            }
          });
          resolve()
          console.log(`Files extracted successfully: ${destinationPath}`);
        })
        .catch(function(err) {
          console.error(`Error extracting file: ${err}`);
        });
    })
  })
};

const extractFilesAndCopyFolder = async(destinationPath, filesNames, filesToDownload, tutorial) => {
    const { catalogueNames, branch, docTypes, docPath } = tutorial;
    for (let i = 0; i < filesToDownload.length; i++) {
        if (filesToDownload[i]) {
          const sourcePath = destinationPath+"/"+i+".zip"
          const filePath = common[docTypes[i]];
          const newPath = docPath[i] || "";
          try {
            // Extract files from sourcePath to destinationPath
            await extractFiles(sourcePath, destinationPath);
            // 将 folderToCopy 从 destinationPath 复制到另一个文件夹
            const sourceFolder = path.join(destinationPath, filesNames[i]+`-${branch[i] || "main"}`+ filePath + newPath);
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
    return `https://codeload.github.com/${url[1]}/${url[0]}/zip/refs/heads/${e.branch || "main"}`
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
    acc.branch.push(e.branch);
    acc.docTypes.push(e.docType);
    acc.docPath.push(e.docPath);
    
    return acc;
  }, { catalogueNames: [], branch: [], docTypes: [], docPath: [] });


  //  全量更新时预先删除
  !index && await fsextra.remove("./docs");     

  // mkdir
  const folder = "./tmpl";
  const generate = require('./generate');
  createFolder(folder);
  createFolder("./docs")
  // Download all files
  await downloadAllFiles(folder, filesToDownload);

  // Extract downloaded files
  // copy to the docs
  await extractFilesAndCopyFolder(folder, filesNames, filesToDownload, tutorial);

  // Delete destinationPath
  await fsextra.remove(folder)

  await generate.main();

  await compatible();
  // Build project
  await buildProject();

  // 将JSON放到build中
  await fsextra.copy("./tutorials.json", "./build/tutorials.json")
  .then(res => {
    console.log('copy tutorials.json successfully');
  })

};

main();