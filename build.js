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

const extractFilesAndCopyFolder = async(destinationPath, filesNames, filesToDownload, catalogueNames) => {
    for (let i = 0; i < filesToDownload.length; i++) {
        const sourcePath = destinationPath+"/"+i+".zip"
        try {
            // Extract files from sourcePath to destinationPath
            await extractFiles(sourcePath, destinationPath);
            // 将 folderToCopy 从 destinationPath 复制到另一个文件夹
            // TODO ===> "unzip"+i to ==> xx-main
            const sourceFolder = path.join(destinationPath, filesNames[i]+"-main/docs");
            const destinationFolder = `./docs/${catalogueNames[i]}`;
            await fsextra.copy(sourceFolder, destinationFolder);
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
  const tutorials = await readJsonFile("tutorials.json");
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

  // mkdir
  const folder = "./tmpl";
  createFolder(folder);

  // Download all files
  await downloadAllFiles(folder, filesToDownload);

  // Extract downloaded files
  // copy to the docs
  await extractFilesAndCopyFolder(folder, filesNames, filesToDownload, catalogueNames);

  // Delete destinationPath
  await fsextra.remove(folder)

  await generateSidebar();
  // Build project
  await buildProject();




};

main();