const https = require('https');
const fs = require('fs');
const fsextra = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

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
    const file = filesToDownload[i];
    await downloadFile(file, folder+"/"+i+".zip");
  }
};

const extractFiles = (sourcePath, destinationPath) => {
  return new Promise((resolve, reject) => {
    const extractCommand = `unzip -q -n ${sourcePath} -d ${destinationPath}`;
    exec(extractCommand, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error extracting file: ${err}`);
        reject(err);
      } else {
        console.log(`Files extracted successfully: ${destinationPath}`);
        resolve();
      }
    });
  });
};

function getDirectory(data, root) {
  let directory
  if (data.indexOf("##") === -1) {
    const regex = /\[(.*?)\]\((.*?)\)/;

    directory = data.split("*")
      .filter(item => item.includes('.md'))
      .map(str => [
        str.match(regex)[1], 
        root + str.match(regex)[2], 
        str.match(regex)[2]
      ])
  }else{
    const lines = data.split('\n');
    const result = [];
    let currentCategory = '';
    
    lines.forEach((line, i) => {
      if (line.startsWith('*')) {
        const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          const title = match[1];
          const link = match[2];
          const baseLinkP = root + link.split("/")[0];

          const baseLink = root + link;
          const targetLink = i + "_" + link.split("/")[0];
          const file = i + "_" + link;
          result.push({ title, link, file, baseLink, targetLink, baseLinkP, category: currentCategory });
        }
      } else if (line.startsWith('## ')) {
        currentCategory = line.replace('## ', '');
      } else if (line.trim() !== '') {
        result.push({ title: line.trim(), link: undefined, category: currentCategory });
      }
    });
    directory = result;
  }
  return directory
}

async function generateDocs(destinationFolder, flag, directory) {
  if (flag) {
    for (let i = 0; i < directory.length; i++) {
      if (!directory[i].category) {
        await fsextra.copy(directory[i].baseLinkP, destinationFolder+`/${i}_${directory[i].targetLink}`);
      }else{
        const link = directory[i].baseLink.split("/").pop();
        const nowLink = `${i}${directory[i].file.split("/")[1]}`;
        await new Promise((resolve, reject) => {
          fs.readFileSync(directory[i].baseLink, 'utf-8').replace(link, nowLink)
        }).then(() => {
          fsextra.copy(directory[i].baseLink, destinationFolder+`/${directory[i].category}/${nowLink}`);
        })
        // 检查是否有图片
        try {
          const stats = fs.statSync(directory[i].baseLinkP+"/img");
          if (stats.isDirectory()) {
            await fsextra.copy(directory[i].baseLinkP+"/img", destinationFolder+`/${directory[i].category}/img`);
          }
        } catch (error) {}
        
      }
    }
  }else{
    for (let i = 0; i < directory.length; i++) {
      await fsextra.copy(directory[i][1], destinationFolder+`/${i}_${directory[i][2]}`);
    }
  }
}

const extractFilesAndCopyFolder = async(destinationPath, filesNames, filesToDownload, catalogueNames) => {
  for (let i = 0; i < filesToDownload.length; i++) {
    const sourcePath = destinationPath+"/"+i+".zip"
    try {
        // Extract files from sourcePath to destinationPath
        await extractFiles(sourcePath, destinationPath);
        // 将 folderToCopy 从 destinationPath 复制到另一个文件夹
        // TODO ====> 查看SUMMARY
        const root = destinationPath + "/" + filesNames[i] + "-main/";
        const SUMMARY = root + "SUMMARY.md";
        let flag = true;  //  true: 有title, false: 无title
        const directory = await new Promise((resolve, reject) => {
          fs.readFile(SUMMARY, 'utf8', (err, data) => {
            if (err) reject(err)
            flag = data.indexOf("##") === -1 ? false : true;
            const directory = getDirectory(data, root)
            resolve(directory)
          });
        })
        .then(res => {return res})
        .catch(err => console.log(err))

        // 创建文档
        // const sourceFolder = path.join(destinationPath, filesNames[i]+"-main");
        const destinationFolder = `./docs/${catalogueNames[i]}`;
        console.log(directory);
        generateDocs(destinationFolder, flag, directory);
        return
        console.log('Files extracted and folder copied successfully');
        } catch (err) {
        console.error(err);
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

const generateSidebar = () => {
    return new Promise((resolve, reject) => {
      const generateCommand = 'node generate.js';
      exec(generateCommand, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error running generate command: ${err}`);
          reject(err);
        } else {
          console.log('generate successfully');
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
    const file = e.repoUrl;
    const url = file.split("/").reverse();
    return `https://codeload.github.com/${url[1]}/${url[0]}/zip/refs/heads/main`
  })

  const filesNames = tutorials.map(e => {
    const file = e.repoUrl;
    const url = file.split("/").reverse();
    return url[0]
  })

  const catalogueNames = tutorials.map(e => {
    return e.catalogueName
  })

  await fsextra.remove("./docs");     //  预先删除

  // mkdir
  const folder = "./tmpl";
  // createFolder(folder);

  // Download all files
  // await downloadAllFiles(folder, filesToDownload);

  // Extract downloaded files
  // copy to the docs
  await extractFilesAndCopyFolder(folder, filesNames, filesToDownload, catalogueNames);

  return

  // Delete destinationPath
  await fsextra.remove(folder)

  await generateSidebar();
  // Build project
  await buildProject();

};

main();