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
    },
    {
        path: "./docs/sui-move-intro-course-zh/advanced-topics/BCS_encoding/lessons/BCS_encoding.md",
        oldValue: "../example_projects/",
        newValue: "https://github.com/RandyPen/sui-move-intro-course-zh/tree/main/advanced-topics/BCS_encoding/example_projects"
    },
    {
        path: "./docs/sui-move-intro-course-zh/unit-four/lessons/4_marketplace_contract.md",
        oldValue: "../../unit-two/lessons/6_capability_design_pattern.md",
        newValue: "../../unit-two/lessons/6_capability_设计模式.md"
    },
    {
        path: "./docs/sui-move-intro-course-zh/unit-two/lessons/1_使用sui_objects.md",
        oldValue: "../../unit-one/lessons/4_定制类型与能力.md#定制类型与能力",
        newValue: "../../unit-one/lessons/4_函数.md"
    },
    {
        path: "./docs/sui-move-intro-course-zh/unit-two/lessons/6_capability_设计模式.md",
        oldValue: "../../unit-one/lessons/6_hello_world.md#viewing-the-object-with-sui-explorer",
        newValue: "../../unit-one/lessons/5_hello_world.md"
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