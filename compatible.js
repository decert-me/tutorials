const util = require('util');
const fs = require('fs');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function modifyFile() {
    const compatibility_table = require('./compatibility_table');
    const tutorials_table = require('./tutorials.json');
    const { replace: arr, empty, normal } = compatibility_table;

    for (const key in arr) {
      if (Object.hasOwnProperty.call(arr, key)) {
        if (tutorials_table.filter(ele => ele.repoUrl === key).length === 0) {
          continue;
        }
        const selectArr = arr[key];
        const selectTutorial = tutorials_table.filter(ele => ele.repoUrl)[0];
        const path = `./docs/${selectTutorial.catalogueName}`

        for (let i = 0; i < selectArr.length; i++) {
          const item = selectArr[i]
          try {
            // 读取文件
            const data = await readFileAsync(path + item.path, 'utf8');
            
            // 修改文件内容
            const modifiedData = data.replace(item.oldValue, item.newValue);
            
            // 写入文件
            await writeFileAsync(path + item.path, modifiedData, 'utf8');
            console.log(`File ${path + item.path} modified successfully.`);
          } catch (err) {
            console.error(`Error modifying file ${path + item.path}: ${err}`);
          }
        }
      }
    }

    for (const key in normal) {
      if (Object.hasOwnProperty.call(arr, key)) {
        if (tutorials_table.filter(ele => ele.repoUrl === key).length === 0) {
          continue;
        }
        const selectArr = arr[key];
        const selectTutorial = tutorials_table.filter(ele => ele.repoUrl)[0];
        const catalogueName = selectTutorial.catalogueName;
        for (let i = 0; i < selectArr.length; i++) {
          try {
            // 读取文件
            const data = await readFileAsync(selectArr[i].path, 'utf8');
            
            // 修改文件内容
            const modifiedData = data.replace(catalogueName + selectArr[i].oldValue, catalogueName + selectArr[i].newValue);
            
            // 写入文件
            await writeFileAsync(selectArr[i].path, modifiedData, 'utf8');
            // console.log(`File ${normal[i].path} modified successfully.`);
          } catch (err) {
            // console.error(`Error modifying file ${normal[i].path}: ${err}`);
          }
        }
      }
    }
    
    
    // 添加空文档处理
    for (const key in empty) {
      if (Object.hasOwnProperty.call(empty, key)) {
        if (tutorials_table.filter(ele => ele.repoUrl === key).length === 0) {
          continue;
        }
        const selectArr = empty[key];
        const selectTutorial = tutorials_table.filter(ele => ele.repoUrl)[0];
        const path = `./docs/${selectTutorial.catalogueName}`

        for (let i = 0; i < selectArr.length; i++) {
          const element = selectArr[i];
          try {
              const fileData = element.newValue
              await writeFileAsync(path + element.path, fileData, 'utf8');
              // console.log(`File ${element.path} modified successfully.`);
          } catch (error) {
              // console.error(`Error modifying file ${element.path}: ${error}`);
          }
        }
      }
    }
    
  }


modifyFile();