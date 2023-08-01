const replace = [
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
    },
    {
        path: "./navbarItems.js",
        oldValue: "ingopedia/README",
        newValue: "ingopedia/communityguide"
    }
]

const empty = [
    {
        path: "./docs/sui-move-intro-course-zh/advanced-topics/upgrade_packages/readme.md",
        oldValue: "",
        newValue: "# 合约升级"
    },
    {
        path: "./docs/ingopedia/protocolsFoldingSchemes.md",
        oldValue: "",
        newValue: `# Folding Scheme Protocols 

|Protocols|Paper|Implementation |Resources |Universal|Transparent|
|:---:|---|:---:|:---:|:---:|:---:|
Nova - 2021|[→📝](https://eprint.iacr.org/2021/370.pdf)|[microsoft](https://github.commicrosoft/Nova)|<ul><li>Srinath Setty - Talk[[1]](https://drive.google.com/file/d1aLQeB_ca9k7NrWRHY00QauZIe7hmt6_u/view?pli=1)</li><li>Srinath Setty - Video[[2]](https:/www.youtube.com/watch?v=mY-LWXKsBLc)</li><li>IACR talk slides[[3]](https://iacr.org/submitfiles/slides/2022/crypto/crypto2022/334/slides.pdf)</li><li>IVC:Nova lambdaclass[[4](https://www.notamonadtutorial.com/incrementally-verifiable-computation-nova/)</li><li>Nova- zkstudy club talk[[5]](https://drive.google.com/file/d/1pIPoRUcMvhsoSWLami5T1KHc5oqkUAZHview)</li><li>zkstudy club video[[6]](https://www.youtube.com/watch?v=ilrvqajkrYY)</li></ul>
Supernova - 2022|[→📝](https://eprint.iacr.org/2022/1758)|[jules](https://github.com/julessupernova)|[Champagne supernova: lambdaclass](https://www.notamonadtutorial.comperiodic-constraints-and-recursion-in-zk-starks/)
Hypernova - 2023|[→📝](https://eprint.iacr.org/2023/573)| |[CCS: Customizable constraintsystems for succinct arguments](https://eprint.iacr.org/2023/552)
Sangria - 2023|[→📝](https://github.com/geometryresearch/technical_notes/blob/mainsangria_folding_plonk.pdf)| |[Blog](https://geometryresearch.xyz/notebooksangria-a-folding-scheme-for-plonk)
Protostar - 2023|[→📝](https://eprint.iacr.org/2023/620)|`
    },
    {
        path: "./docs/ingopedia/protocolsLookup.md",
        oldValue: "",
        newValue: `# Lookup Protocols

|Protocols|Paper|Implementation |Resources |Universal|Transparent|
|:---:|---|:---:|:---:|:---:|:---:|
|Plookup -2020|[→📝](https://eprint.iacr.org/2020/315.pdf)|[Jellyfish](https://github.com/EspressoSystems/jellyfish)|<ul><li>Plookup in action -Talk[[1]](https://github.com/arielgabizon/Lectures/blob/master/plookupinactionDystopia2020.pdf)</li><li>Plonk and Plookup - Metastate[[2]](https://research.metastate.dev/on-plonk-and-plookup/)</li><li>Plonk and Plookup - Khovratovich[[3]](https://hackmd.io/@7dpNYqjKQGeYC7wMlPxHtQ/BJpNmNW0L)</li><li>Mina Protocol[[4]](https://o1-labs.github.io/proof-systems/introduction.html)</li><li>AES with lookup : Daira Hopwood[[5]](https://hackmd.io/m0fnJ_lPTPahWAhfaiQA7Q#With-smaller-38-sized-tables)</li><li>Lookup tables - Ariel Gabizon[[6]](https://www.youtube.com/watch?v=rOZTQ-18YJY)</li></ul>
|Caulk - 2022|[ →📝 ](https://eprint.iacr.org/2022/621.pdf)|<ul><li>caulk-crypto[[1]](https://github.com/caulk-crypto/caulk)</li><li>Caulk+[[2]](https://eprint.iacr.org/2022/957)</li></ul>| |
|Flookup - 2022|[ →📝 ](https://eprint.iacr.org/2022/1447)|
|Baloo - 2022|[ →📝 ](https://eprint.iacr.org/2022/1565)|
|CQ - 2022|[ →📝 ](https://eprint.iacr.org/2022/1763)|[Geometry](https://github.com/geometryresearch/cq)
|CqLin - 2023|[ →📝 ](https://eprint.iacr.org/2023/393)|`
    },
    {
        path: "./docs/ingopedia/protocolsOther.md",
        oldValue: "",
        newValue: `# Other Protocols 

|Protocols|Paper|Implementation |Resources |Universal|Transparent|
|:---:|---|:---:|:---:|:---:|:---:|
|vRAM - 2018|[→📝](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8418645)| | |✅|❌|
|Bulletproof - 2018|[→📝](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8418611)|<ul><li>Dalek[[1]](https://github.com/dalek-cryptography/bulletproofs)</li><li>Lovesh[[2]](https://github.com/lovesh/bulletproofs-r1cs-gadgets)</li></ul>|<ul><li>ZKP using Bullet proofs - Lovesh Harchandani[[1]](https://medium.com/coinmonks/zero-knowledge-proofs-using-bulletproofs-4a8e2579fc82)</li><li>Notes[[2]](https://github.com/AdamISZ/from0k2bp/blob/master/from0k2bp.pdf)</li></ul>|✅|✅|
|Virgo - 2020|[→📝](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=9152704)|[sunblaze-ucb](https://github.com/sunblaze-ucb/Virgo)| | ✅|✅|`
    },
    {
        path: "./docs/ingopedia/protocolsSNARK.md",
        oldValue: "",
        newValue: `# SNARK Protocols 

|Protocols|Paper|Implementation |Resources |Universal|Transparent|
|:---:|---|:---:|:---:|:---:|:---:|
|Pinocchio - 2013|[ →📝 ](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=6547113)| | |❌|❌|
|TinyRAM - 2013|[ →📝](https://eprint.iacr.org/2013/507.pdf)| | |❌|❌|
|vnTinyRAM - 2014|[ →📝](https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-ben-sasson.pdf)|[Mike Hearn](https://blog.plan99.net/vntinyram-7b9d5b299097)| |✅|❌|
|Geppetto - 2015|[ →📝](https://ieeexplore.ieee.org/document/7163030?denied=)| | |❌|❌|
|Buffet - 2015|[ →📝](https://www.ndss-symposium.org/ndss2015/ndss-2015-programme/efficient-ram-and-control-flow-verifiable-outsourced-computation/)| | |❌|❌|
|Groth -2016|[ →📝](https://eprint.iacr.org/2016/260.pdf)|<ul><li>ConsenSys-gnark[[1]](https://github.com/ConsenSys/gnark)</li><li>arkworks-rs[[2]](https://github.com/arkworks-rs/groth16)</li></ul>|<ul><li>Groth16 Malleability - Geometry[[1]](https://geometry.xyz/notebook/groth16-malleability)</li><li>Proof of forgery[[2]](https://medium.com/ppio/how-to-generate-a-groth16-proof-for-forgery-9f857b0dcafd)</li><li>Groth16 aggregation proposal[[3]](https://docs.zkproof.org/pages/standards/accepted-workshop4/proposal-aggregation.pdf)</li><li>Groth - Talk[[4]](https://www.youtube.com/watch?v=OseAdq0CoOY)</li><li>Deep into bellman library - Star Li[[5]](https://trapdoortech.medium.com/zkp-deep-into-bellman-library-9b1bf52cb1a6)</li><li>Lookups for groth16?[[6.1]](https://hackmd.io/@Merlin404/SJmtF_k-2)</li><li>ultragroth[[6.2]](https://hackmd.io/@Merlin404/Hy_O2Gi-h?utm_source=substack&utm_medium=email)</li></ul> |❌|❌|
|Ligero - 2017|[ →📝](https://dl.acm.org/doi/pdf/10.1145/3133956.3134104)| | |✅|✅|
|ZoKrates - 2018|[ →📝](https://api-depositonce.tu-berlin.de/server/api/core/bitstreams/2b81beb7-5b0f-4048-a56f-104317a82675/content)|[ZoKrates](https://zokrates.github.io/)|<ul><li>Proving hash preimage with Zokrates - Decentriq[[1]](https://blog.decentriq.com/proving-hash-pre-image-zksnarks-zokrates/) </li><li>Efficient ECC in Zokrates- Decentriq[[2]](https://blog.decentriq.com/efficient-ecc-in-zksnarks-using-zokrates/)</li></ul>| | |❌|❌|
|xjSNARK - 2018|[ →📝](https://akosba.github.io/papers/xjsnark.pdf)|  | |❌|❌|
|Hyrax - 2018|[ →📝](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8418646)| | | | | | 
|Sonic - 2019|[ →📝](https://eprint.iacr.org/2019/099.pdf)| |[Benthams Gaze](https://www.benthamsgaze.org/2019/02/07/introducing-sonic-a-practical-zk-snark-with-a-nearly-trustless-setup/)|✅|❌|
|Plonk - 2019|[ →📝](https://eprint.iacr.org/2019/953.pdf)|<ul><li>heliaxdev[[1]](https://github.com/heliaxdev/plonk)</li><li>kobigurk[[2]](https://github.com/kobigurk/plonk/tree/kobigurk/port_to_zexe)</li><li>ZK-Garage[[3]](https://github.com/ZK-Garage/plonk)</li><li>dusk-network[[4]](https://github.com/dusk-network/plonk)</li><li>Jellyfish (Includes Plookup)[[5]](https://github.com/EspressoSystems/jellyfish)</li></ul>|<ul><li>Plonk high level summary[[1]](https://www.smartcontractresearch.org/t/research-summary-plonk-permutations-over-lagrange-bases-for-oecumenical-noninteractive-arguments-of-knowledge/382)</li><li>Talk: Ariel Gabizon[[2]](https://www.youtube.com/watch?v=dHo56MhQlHk)</li><li>Talk: Zac Williamson[[3]](https://www.youtube.com/watch?v=ty-LZf0YCK0) </li><li>Understanding Plonk - Vitalik[[4]](https://vitalik.ca/general/2019/09/22/plonk.html)</li><li>From AIRs to RAPs - how PLONK-style arithmetization works[[5]](https://hackmd.io/@aztec-network/plonk-arithmetiization-air#How-does-all-this-relate-to-R1CS)</li><li>Custom gates on plonk -Do whatever[[7]](https://kobi.one/2021/05/20/plonk-custom-gates.html)</li><li>Plonk Cafe[[8]](https://www.plonk.cafe/top)</li><li>Plonk: Anatomy of a proof generation: Scroll[[9]](https://scroll.io/blog/proofGeneration#heading-22)</li><li>Resource: Plonk by hand -1 Metastate[[10.1]](https://research.metastate.dev/plonk-by-hand-part-1/)</li><li>Resource: Plonk by hand -2 Metastate[[10.2]](https://research.metastate.dev/plonk-by-hand-part-2-the-proof/)</li><li>Resource: Plonk by hand -3 Metastate[[10.3]](https://research.metastate.dev/plonk-by-hand-part-3-verification/) </li><li>Resource: Plonk and Plookup Metastate[[10.4]](https://research.metastate.dev/on-plonk-and-plookup/)</li><li>Turboplonk[[11]](https://docs.zkproof.org/pages/standards/accepted-workshop3/proposal-turbo_plonk.pdf)</li><li>Custom gates in plonk[[12]](https://www.plonk.cafe/t/details-of-custom-gate/122)</li><li>Plonk: Thomas Piellard[[13]](https://hackmd.io/@gnark/plonk)</li><li>ZKP intro to Plonk - Star Li[[14]](https://trapdoortech.medium.com/zkp-plonk-algorithm-introduction-834556a32a)</li><li>Multi set checks in Plonk and Plookup: Gabizon[[15]](https://hackmd.io/@arielg/ByFgSDA7D)</li><li>Plonk - Kimchi: Mina Protocol[[16.1]](https://eng-blog.o1labs.org/posts/plonk/)</li><li>Kimchi[[16.2]](https://minaprotocol.com/blog/kimchi-the-latest-update-to-minas-proof-system)</li><li>Plonk not a monad tutorial[[17]](https://blog.lambdaclass.com/all-you-wanted-to-know-about-plonk/?utm_source=substack&utm_medium=email)</li></ul>|✅|❌|
|Redshift - 2019|[ →📝](https://eprint.iacr.org/2019/1400)|[Redhsift Summary](https://www.smartcontractresearch.org/t/research-summary-redshift-transparent-snarks-from-list-polynominal-commitment-iops/344)| | | | | |
|Spartan - 2019|[ →📝](https://eprint.iacr.org/2019/550.pdf)|[Microsoft](https://github.com/microsoft/Spartan) | | | | |
|Halo - 2019|[ →📝](https://eprint.iacr.org/2019/1021.pdf)| |  |✅|✅|
|MIRAGE - 2020|[ →📝](https://eprint.iacr.org/2020/278.pdf)| |  |✅|❌|
|Marlin - 2020|[ →📝](https://eprint.iacr.org/2019/1047.pdf)|[arkworks-rs](https://github.com/arkworks-rs/marlin)|<ul><li>Doc: Pre lunar and not updated to Aleo/testnet3[[1]](https://github.com/arkworks-rs/marlin/blob/master/diagram/diagram.pdf)</li><li>Thesis[[2]](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2021/EECS-2021-99.pdf)</li><li>Eurocrypt 2020: Talk video [[3]](https://www.youtube.com/watch?v=3mZWa6tJaMI)</li><li>ZK summit - Talk: Pratyush[[4]](https://www.youtube.com/watch?v=bJDLf8KLdL0)</li><li>Sin7y tech review: blog[[5]](https://hackmd.io/@sin7y/BJV47Q_nq)</li><li>Marlin and Me[[6]](https://github.com/ingonyama-zk/papers/blob/main/Marlin_and_me.pdf)</li></ul> | | | |
|Fractal -2020|[ →📝](https://eprint.iacr.org/2019/1076)|[scipr-lab/libiop](https://github.com/scipr-lab/libiop)|<ul><li>Fractal - talk[[1]](https://www.youtube.com/watch?v=TcRhC5U353I)</li><li> Demystifying Fractal 1 -Metastate[[2.1]](https://research.metastate.dev/demystifying-fractal-part-1/)</li><li>Demystifying Fractal 2 - Metastate[[2.2]](https://research.metastate.dev/demystifying-fractal-part-ii/)</li></ul>
|Lunar - 2020|[ →📝](https://eprint.iacr.org/2020/1069)| |[ZK study club video](https://www.youtube.com/watch?v=_7EBb-k2W6A&list=PLj80z0cJm8QHm_9BdZ1BqcGbgE-BEn-3Y&index=4)|
|SuperSonic - 2020|[ →📝](https://eprint.iacr.org/2019/1229.pdf)| |<ul><li>Demystifying supersonic 1 -Metastate[[1.1]](https://research.metastate.dev/demystifying-supersonic-part-1/)</li><li>Demystifying supersonic 2- Metastate[[1.2]](https://research.metastate.dev/demystifying-supersonic-part-ii/)</li></ul>|✅|✅|
|Darlin - 2021 |[ →📝](https://arxiv.org/pdf/2107.04315.pdf)|
|Plonkup -2021|[ →📝](https://eprint.iacr.org/2022/086.pdf)|[HorizenOfficial/ginger-lib](https://github.com/HorizenOfficial/ginger-lib)
|SnarkPack -2021|[ →📝](https://research.protocol.ai/publications/snarkpack-practical-snark-aggregation/gailly2021.pdf)|[Efficient Aggregation](https://research.protocol.ai/blog/2021/snarkpack-how-to-aggregate-snarks-efficiently/#groth16-aggregated-verification)
|FFlonk -2021|[ →📝](https://eprint.iacr.org/2021/1167.pdf)|
|Brakedown - 2021|[ →📝](https://eprint.iacr.org/2021/1043.pdf)|
|Gemini - 2022|[ →📝](https://eprint.iacr.org/2022/420)|[Elastic SNARKs for diverse environments](https://www.youtube.com/watch?v=Suv7MN131f8)
|Hyperplonk - 2022|[ →📝](https://eprint.iacr.org/2022/1355)|[EspressoSystems](https://github.com/EspressoSystems/hyperplonk)|<ul><li>Hyperplonk - benedikt Bunz[[1]](https://www.youtube.com/watch?v=mZEXgoQL6xk)</li><li>Delendum[[2]](https://medium.com/@espressosys/hyperplonk-a-zk-proof-system-for-zkevms-d6359cc0cdb6)</li><li>Hardware friendliness of MLE-Sumcheck[[3]](https://hackmd.io/@omershlo/rJhgKJPtj)</li><li>Hardware-optimizations for SumCheck-Binyi Chen[[4]](https://hackmd.io/PBauexuMQse__I_F27J_kA?view=)</li></ul>
|Testudo: Groth+Spartan - 2023|[ →📝](https://cryptonet.org/blog/testudo-efficient-snarks-with-smaller-setups)|[cryptonetlab](https://github.com/cryptonetlab/Testudo)`
    },
    {
        path: "./docs/ingopedia/protocolsSTARK.md",
        oldValue: "",
        newValue: `# STARK Protocols 

|Protocols|Paper|Implementation |Resources |Universal|Transparent|
|:---:|---|:---:|:---:|:---:|:---:|
|zkSTARK -2018|[ →📝 ](https://eprint.iacr.org/2018/046.pdf)|<ul><li>Winterfell[[1]](https://docs.rs/winterfell/latest/winterfell/)</li><li>Ministark[[2]](https://github.com/andrewmilson/ministark)</li><li>Cairo[[3]](https://github.com/starkware-libs/cairo)</li></ul>||✅|✅|
|Aurora - 2019|[ →📝 ](https://eprint.iacr.org/2018/828.pdf)|[Thesis Spooner](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2020/EECS-2020-182.pdf)||✅|✅|
|Zilch - 2021|[ →📝 ](https://eprint.iacr.org/2020/1155.pdf)|[TrustworthyComputing](https://github.com/TrustworthyComputing/Zilch)||✅|✅|
|Plonky - 2021|[ →📝 ](https://github.com/mir-protocol/plonky)|[mir-protocol](https://github.com/mir-protocol/plonky)|<ul><li>Plonky: Fast recursive arguments based on Plonk and Halo[[1]](https://mirprotocol.org/blog/Fast-recursive-arguments-based-on-Plonk-and-Halo)</li><li>Plonky: Adding zero Knowledge to Plonk and Halo[[2]](https://mirprotocol.org/blog/Adding-zero-knowledge-to-Plonk-Halo)</li></ul>
|Plonky2 - 2021|[ →📝 ](https://github.com/mir-protocol/plonky2/blob/main/plonky2/plonky2.pdf)|[mir-protocol](https://github.com/mir-protocol/plonky2)
|Orion -2022|[ →📝 ](https://eprint.iacr.org/2022/1010)|[sunblaze-ucb](https://github.com/sunblaze-ucb/Orion)|[IACR -talk](https://www.youtube.com/watch?v=LZb_wqCzwr8)`
    }
]

module.exports = {
    replace,
    empty
};