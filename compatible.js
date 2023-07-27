const util = require('util');
const fs = require('fs');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

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
    },
    {
        path: "./docs/sui-move-intro-course-zh/advanced-topics/BCS_encoding/lessons/BCS_编码.md",
        oldValue: "../example_projects/",
        newValue: "https://github.com/RandyPen/sui-move-intro-course-zh/tree/main/advanced-topics/BCS_encoding/example_projects"
    },
    {
        path: "./docs/ethereum-development-with-go-book/README.md",
        oldValue: "../zh/client",
        newValue: "./client/README.md"
    },
    {
        path: "./docs/ethereum-development-with-go-book/README.md",
        oldValue: "((https://invite.slack.golangbridge.org/))",
        newValue: "(https://invite.slack.golangbridge.org/)"
    },
    {
        path: "./docs/ethereum-development-with-go-book/README.md",
        oldValue: "((https://gophers.slack.com/messages/C9HP1S9V2/))",
        newValue: "(https://gophers.slack.com/messages/C9HP1S9V2/)"
    },
    {
        path: "./docs/ethereum-development-with-go-book/event-read/README.md",
        oldValue: "((../smart-contract-compile))",
        newValue: "(../smart-contract-compile/README.md)"
    },
    {
        path: "./docs/ethereum-development-with-go-book/event-read/README.md",
        oldValue: "((../event-subscribe))",
        newValue: "(../event-subscribe/README.md)"
    },
    {
        path: "./docs/ethereum-development-with-go-book/smart-contract-load/README.md",
        oldValue: "<ContractName>",
        newValue: "<ContractName/>"
    }

]

const empty = [
    {
        path: "./docs/sui-move-intro-course-zh/advanced-topics/upgrade_packages/readme.md",
        oldValue: "",
        newValue: "# 合约升级"
    },
]

async function modifyFile(arr) {
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


modifyFile(common);