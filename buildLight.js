const { exec } = require('child_process');
const fsextra = require('fs-extra');



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
      const generateCommand = `node generate.js`;
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
    // 生成
    await generateSidebar();
    // 打包
    await buildProject();
    // 将JSON放到build中
    await fsextra.copy("./tutorials.json", "./build/tutorials.json")
    .then(res => {
      console.log('copy tutorials.json successfully');
    })
}
main();