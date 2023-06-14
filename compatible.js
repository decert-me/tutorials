const fs = require('fs');

const common = [
    {
        path: "./docs/MasteringChainAnalytics/08_nft_analysis/readme.md",
        oldValue: "<br>",
        newValue: "<br/>"
    },
    {
        path: "./docs/MasteringChainAnalytics/03_build_first_dashboard/readme.md",
        oldValue: "(02_get_started/readme.md)",
        newValue: "(../02_get_started/readme.md)"
    },
]

function modifyFile(arr) {
    arr.map(e => {
        // 读取文件
        fs.readFile(e.path, 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            return;
            }
        
            // 修改文件内容
            const modifiedData = data.replace(e.oldValue, e.newValue);
        
            // 写入文件
            fs.writeFile(e.path, modifiedData, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    })
}


modifyFile(common);