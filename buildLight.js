const { exec } = require('child_process');
const fsextra = require('fs-extra');
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);



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
  console.log("start compatible");
  return new Promise((resolve, reject) => {
    const buildCommand = 'node compatible.js';
    exec(buildCommand, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running compatible command: ${err}`);
        reject(err);
      } else {
        console.log('Compatible completed successfully');
        resolve();
      }
    });
  });
};

const main = async () => {
  const generate = require('./generate');
    // 生成
    await generate.main();
    // 兼容
    await compatible();
    // 打包
    await buildProject();
    // 将JSON放到build中
    const buildPath = "./build/tutorials.json";
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
}
main();