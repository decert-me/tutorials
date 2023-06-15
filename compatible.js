const fs = require('fs');

const common = [
    {
        path: "./docs/MasteringChainAnalytics/08_nft_analysis/readme.md",
        oldValue: "<br>",
        newValue: "<br/>"
    },
    {
        path: "./docs/MasteringChainAnalytics/README.md",
        oldValue: "# Mastering Chain Analytics",
        newValue: "# 简介"
    },
    {
        path: "./docs/MasteringChainAnalytics/00_introductions/readme.md",
        oldValue: "# 成为链上数据分析师#0",
        newValue: "# 成为链上数据分析师"
    },
    {
        path: "./docs/MasteringChainAnalytics/01_platform/dune.md",
        oldValue: "## Dune平台介绍",
        newValue: `# Dune平台简介\n## Dune平台介绍`
    },
    {
        path: "./docs/MasteringChainAnalytics/21_how_to_design_a_dashboard/readme.md",
        oldValue: "# 如何设计一个Dshboard-以BTC指标CDD(Coin Day Destroyed)为例",
        newValue: "# 如何设计Dashboard - 以BTC指标CDD为例"
    }
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