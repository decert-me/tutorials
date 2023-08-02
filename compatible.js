const util = require('util');
const fs = require('fs');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function modifyFile() {
    const compatibility_table = require('./compatibility_table');
    const { replace: arr, empty } = compatibility_table;

    for (let i = 0; i < arr.length; i++) {
      try {
        // 读取文件
        const data = await readFileAsync(arr[i].path, 'utf8');
        
        // 修改文件内容
        const modifiedData = data.replace(arr[i].oldValue, arr[i].newValue);
        
        // 写入文件
        await writeFileAsync(arr[i].path, modifiedData, 'utf8');
        console.log(`File ${arr[i].path} modified successfully.`);
      } catch (err) {
        console.error(`Error modifying file ${arr[i].path}: ${err}`);
      }
    }
    // 添加空文档处理
    for (let i = 0; i < empty.length; i++) {
        const element = empty[i];
        try {
            const fileData = element.newValue
            await writeFileAsync(element.path, fileData, 'utf8');
            console.log(`File ${element.path} modified successfully.`);
        } catch (error) {
            console.error(`Error modifying file ${element.path}: ${error}`);
        }
    }
  }


modifyFile();