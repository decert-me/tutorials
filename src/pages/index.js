import React from 'react';
import "./index.scss"
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { progressList } from "../request/public";
import { Button, Divider, Drawer } from "antd";
import { useRequest, useUpdateEffect } from "ahooks";
import CustomCategory from "../components/CustomCategory";
import axios from 'axios';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

function totalTime(time) {
  const s = time / 1000;    //  秒
  const m = Math.floor(s / 60);    //  分
  const hours = Math.floor(m / 60);
  const mins = m % 60;

  return hours > 0 ? `${hours} h ${mins} m` : `${mins} m`
}

function Difficulty({tutorial, label}) {
    let color = "";

    switch (tutorial.difficulty) {
        case 0:
            color = "#FFB21E";
            break;
        case 1:
            color = "#5887E1";
            break;
        case 2:
        default:
            color = "#EB1C1C";
            break;
    }
    
    return (
        <>
        <div className="point" style={{backgroundColor: color}}></div>{label}
        </>
    )
}

function GetTags({ tutorial, t }) {
    const arr = [];
    tutorial?.category &&
    tutorial.category.forEach(ele => {
        arr.push(ele)
    })
    tutorial?.theme &&
    tutorial.theme.forEach(ele => {
        arr.push(ele)
    })
    return (
        arr.map((item,index) => 
            <li className="tag" key={index}>{t(`tutorial.${item}`)}</li>
        )
    )
}

function SelectItems({selectItems: items, removeItem, removeAllItems, sidebarIsOpen, changeSidebar, t}) {
    const result = [];
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        element.forEach(item => {
            result.push({
                ...item, 
                index: i
            })
        })
    }
    return (
        (result.length !== 0 || !sidebarIsOpen) &&
        <div className="selectItems">
            {
                !sidebarIsOpen &&
                <div className="icon" onClick={() => changeSidebar()}>
                    <img src={require("@site/static/img/icon-filter.png").default} alt="" />
                </div>
            }
            {
                result.map((item) => 
                    <div 
                        className="selectItem" 
                        key={item.key}
                        onClick={() => removeItem(item.key, item.index)}
                    >
                        {t(`tutorial.${item.label}`)} <img src={require("@site/static/img/icon-close.png").default} alt="" />
                    </div>
                )
            }
            {
                result.length !== 0 &&
                    <div className="selectItem" onClick={() => removeAllItems()}>
                        {t("tutorial.clear")}
                    </div>
            }
        </div>
    )
}

export default function Home() {

  const contentRef = useRef(null);
  const sidebarRef = useRef(null);
  const listRef = useRef(null);
  const buttonRef = useRef(null);
  const childRef = useRef(null);
  const boxsRef = useRef(null);
  
  const {siteConfig} = useDocusaurusContext();
  let [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const { address } = useAccount();
  const tutorialsSidebar = [
    {
        label: "type",
        list: [
            { key: 101, label: "dapps" },
            { key: 102, label: "chain-public" },
            { key: 103, label: "programming-lang" },
            { key: 104, label: "layer2" },
            { key: 105, label: "safe" },
            { key: 106, label: "chain-consortium" },
            { key: 107, label: "storage" },
            { key: 108, label: "theory" },
            { key: 109, label: "research" },
            { key: 110, label: "others" },
        ]
    },
    {
        label: "theme",
        list: [
            { key: 201, label: "defi" },
            { key: 202, label: "nft" },
            { key: 203, label: "btc" },
            { key: 204, label: "eth" },
            { key: 205, label: "blockchain" },
            { key: 206, label: "metaverse" },
            { key: 207, label: "web3" },
            { key: 208, label: "contract" },
            { key: 209, label: "zkp" },
            { key: 210, label: "consensus" },
            { key: 211, label: "cryptography" },
            { key: 212, label: "wallet" },
            { key: 213, label: "dao" },
            { key: 215, label: "technical-analysis" },
            { key: 216, label: "solidity" },
            { key: 217, label: "move" },
            { key: 218, label: "sui" },
            { key: 219, label: "go" }
        ]
    },
    {
        label: "media",
        list: [
            {key: 301, label: "article", value: "article"}, 
            {key: 302, label: "video", value: "video"}
        ]
    },
    {
        label: "lang",
        list: [
            {key: 401, label: "zh", value: "zh"}, 
            {key: 402, label: "en", value: "en"}
        ]
    }
];
  const [openM, setOpenM] = useState(false);    //  移动端抽屉
  let [tutorials, setTutorials] = useState([]);   //  教程列表
  let [newTutorials, setNewTutorials] = useState([]);   //  选中的教程列表
  
  let [sidebarIsOpen, setSidebarIsOpen] = useState(true);   //  侧边栏展开
  let [isOk, setIsOk] = useState(false);   //  dom操作是否完成
  let [selectItems, setSelectItems] = useState([[],[],[],[]]);   //  当前选中的类别
  
  const { run } = useRequest(resizeContent, {
      debounceWait: 300,
      manual: true,
  });

  const { run: runAdd } = useRequest(addClassName, {
      throttleWait: 300,
      manual: true,
  });

  const { run: runRemove } = useRequest(removeClassName, {
      debounceWait: 500,
      manual: true,
  });

  // 侧边栏删除类名
  function removeClassName() {
      sidebarRef.current.classList.remove("content-sidebar-scrollbar")
  }

  // 侧边栏添加类名
  function addClassName() {
      sidebarRef.current.classList.add("content-sidebar-scrollbar")
      runRemove()
  }

  // 移除选中的单个 *类别*
  function removeItem(key, index) {
      let singleSelectItems = selectItems[index];
      const i = singleSelectItems.findIndex(e => e.key === key);
      singleSelectItems.splice(i, 1);
      selectItems[index] = singleSelectItems;
      setSelectItems([...selectItems]);
  }

  // 移除所有 *类别*
  function removeAllItems() {
      selectItems=[[],[],[],[]];
      setSelectItems([...selectItems]);
  }

  // 获取当前选中的 *类别* 列表
  function changeSelectItems(items, index) {
      selectItems[index] = items;
      setSelectItems([...selectItems]);
  }

  // 展开 || 关闭侧边栏
  function changeSidebar() {
      sidebarIsOpen = !sidebarIsOpen;
      setSidebarIsOpen(sidebarIsOpen);

      if (sidebarIsOpen) {
          sidebarRef.current.style.left = "0";
          listRef.current.style.width = "calc(100% - 380px - 10px)";
          listRef.current.style.paddingLeft = "30px"
      }else{
          sidebarRef.current.style.left = "-380px";
          listRef.current.style.width = "100%"
          listRef.current.style.paddingLeft = "37px"
      }
      run()
  }

  function filterTutorials(params) {
      const arr = [];
      
      if (selectItems.every(item => item.length === 0)) {
          newTutorials = tutorials;
          setNewTutorials([...newTutorials]);
          return
      }

      tutorials.forEach(tutorial => {
          if (
              (
                  selectItems[0].some(item => tutorial.category.includes(item.label)) || 
                  selectItems[1].some(item => tutorial.theme.includes(item.label)) || 
                  selectItems[3].some(item => tutorial.language.includes(item.value))
              ) &&
              (
                  selectItems[2].length === 0 || 
                  selectItems[2].some(item => tutorial.docType.includes(item.value))
              )
          ) {
              arr.push(tutorial)
          }
      })
      newTutorials = arr;
      setNewTutorials([...newTutorials]);
  }

  // 页面滑动出content区域侧边栏高度改变
  function scrollSidebar() {
      if (listRef.current) {
          const elementRect = contentRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          if (elementRect.bottom <= viewportHeight) {
              sidebarRef.current.style.position = "absolute";
              sidebarRef.current.style.top = "auto";
              sidebarRef.current.style.bottom = 0;
          }else{
              sidebarRef.current.style.position = "fixed";
              sidebarRef.current.style.top = "82px";
          }
      }
  }

  // 动态调整教程宽度
  function resizeContent() {
      if (boxsRef.current) {
          const domArr = document.querySelectorAll(".boxs .box-link");
          const contentWidth = boxsRef.current.getBoundingClientRect().width;
          const num = parseInt(contentWidth / 350);
          let value;
          // 如果够展开
          if ((((num - 1) * 20) + (350 * num)) <= contentWidth ) {
              value = `calc(${(100 / num).toFixed(2)}% - ${parseInt((num - 1) * 20 / num) + 1}px)`
          }else{
              value = `calc(${(100 / (num - 1)).toFixed(2)}% - ${(parseInt(num - 2) * 20 / (num - 1)) + 1}px)`
          }
          domArr.forEach(dom => {
              dom.style.setProperty("flex-basis", value);
          })
          setIsOk(true);
      }
  }

  // 获取学习进度
  async function getProgress(params) {
      const arr = [];
      tutorials.forEach(tutorial => arr.push(tutorial.catalogueName));
      await progressList({catalogueNameList: arr})
      .then(res => {
          if (res.status === 0) {
              const catalogueMap = {};
              res.data.forEach(e => {
                  catalogueMap[e.catalogueName] = {
                      readNum: e.readNum,
                      percent: e.percent
                  };
              });
              tutorials.forEach(tutorial => {
                  const catalogInfo = catalogueMap[tutorial.catalogueName];
                  if (catalogInfo) {
                      tutorial.readNum = catalogInfo.readNum;
                      tutorial.percent = catalogInfo.percent;
                  }
              })
              setTutorials([...tutorials]);
          }
      })
  }

  function resize() {
    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth < 490) {
      const scale = document.documentElement.clientWidth / 390;
      document.documentElement.style.fontSize = 16 * Math.min(scale, 2) + 'px'
    }

    const width = window.screen.width;
    isMobile = width < 490;
    setIsMobile(isMobile);
  }

  function init() {
      const host = window.location.origin;
      axios.get(`${host.indexOf("localhost") === -1 ? host : "https://decert.me"}/tutorial/tutorials.json`)
      .then(res => {
          tutorials = res.data;
          tutorials.forEach(tutorial => {
              tutorial.docType = tutorial.docType === "video" ? "video" : "article";
          })
          setTutorials([...tutorials]);
          console.log(tutorials);
          getProgress();
          filterTutorials();
          run();
      })
      .catch(err => {
          console.log(err);
      })
  }

  useUpdateEffect(() => {
      // 比较筛选 ===> 
      filterTutorials();
  },[selectItems])

  // 初始化
  useEffect(() => {
      init();
      window.addEventListener('scroll', scrollSidebar);
      window.addEventListener('resize', run);
      return () => {
          window.removeEventListener('scroll', scrollSidebar);
          window.removeEventListener('resize', run);
      }
  },[])

  useEffect(() => {
      if (sidebarRef.current) {
          sidebarRef.current.addEventListener('scroll', runAdd);
      }
  },[sidebarRef])

  // 监听地址 ==> 获取学习进度
  useEffect(() => {
      address && getProgress()
  },[address])

  useUpdateEffect(() => {
      if (openM) {
          document.body.style.overflow = "hidden";
      }else{
          document.body.style.overflow = "auto";
      }
  },[openM])

  useUpdateEffect(() => {
      resizeContent();
  },[newTutorials])

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    }
  },[])

  return (
    <Layout
    title={`Hello from ${siteConfig.title}`}
    description="Description will go into a meta tag in <head />">
    <main>
    <div className={`Lesson ${isMobile ? "Lesson-mobile" : ""}`} ref={contentRef}>
      <div className="custom-bg-round" />
      <div className="content">
          {/* 侧边栏 */}
          {
              isMobile ? 
              <Drawer
                  placement="bottom"
                  closable={false}
                  onClose={() => setOpenM(false)}
                  open={openM}
                  mask={false}
                  rootClassName="drawer-sidebar"
                  getContainer={() => document.querySelector(".Lesson .content")}
              >
                  <div className="content-sidebar">
                      <div className="sidebar-list">
                          <div className="sidebar-close tutorial-icon-full icon" onClick={() => setOpenM(false)}>
                              <img src={require("@site/static/img/icon-close.png").default} alt="" />
                          </div>
                          {
                              tutorialsSidebar.map((item, i) => 
                                  <div className="sidebar-item" key={item.label}>
                                      <CustomCategory 
                                          items={item.list} 
                                          label={item.label}
                                          changeSelectItems={(e) => changeSelectItems(e, i)} 
                                          allSelectItems={selectItems}
                                          sidebarIndex={i}
                                          ref={childRef}
                                      />
                                  </div>
                              )
                          }
                      </div>
                  </div>
              </Drawer>
              :
              <div className="content-sidebar" ref={sidebarRef}>
                  <Button 
                      type="default" 
                      className="sidebar-title"
                      onClick={() => changeSidebar()}
                      ref={buttonRef}
                  >
                      <div className="icon">
                          <img src={require("@site/static/img/icon-filter.png").default} alt="" />
                      </div>
                      {t("tutorial.filter")}
                  </Button>
                  <div className="sidebar-list">
                      {
                          tutorialsSidebar.map((item, i) => 
                              <div className="sidebar-item" key={item.label}>
                                  <CustomCategory 
                                      items={item.list} 
                                      label={item.label}
                                      changeSelectItems={(e) => changeSelectItems(e, i)} 
                                      allSelectItems={selectItems}
                                      sidebarIndex={i}
                                      ref={childRef}
                                  />
                              </div>
                          )
                      }
                  </div>
              </div>
          }
          {/* 展示列表 */}
          <div className="content-list" ref={listRef}>
              {/* 导航栏 */}
              <SelectItems selectItems={selectItems} removeItem={removeItem} removeAllItems={removeAllItems} sidebarIsOpen={sidebarIsOpen} changeSidebar={changeSidebar} t={t} />
              <p className="content-title">{t("header.lesson")}</p>
              {
                  isMobile && 
                  <div className="tutorials-operate">
                      <div className="tutorial-icon-full filter-icon icon" onClick={() => setOpenM(true)}>
                          <img src={require("@site/static/img/icon-filter.png").default} alt="" />
                      </div>
                  </div>
              }
              <div className="boxs" ref={boxsRef} style={{opacity: isOk ? 1 : 0}}>
                  {
                      newTutorials.map(e => 
                          <a 
                              href={`/tutorial/${e.catalogueName}${/^README$/i.test(e.startPage.split("/")[1]) ? "/" : "/"+e.startPage.split("/")[1]}`} 
                              rel="noopener noreferrer"
                              key={e.catalogueName}
                              className="box-link"
                          >
                              <div className="box">
                                  <div className="img">
                                      <img src={e.img} alt="" />
                                  </div>
                                  <div className="box-content">
                                      <p className="box-title newline-omitted">
                                          {e.label}
                                      </p>
                                      <p className="box-desc newline-omitted">
                                          {e?.desc}
                                      </p>
                                      <Divider />
                                      <ul className="data-info">
                                          <li className="font-color">
                                              <Difficulty 
                                                  tutorial={e} 
                                                  label={t(`diff-info.${e.difficulty == 0 ? "easy" : e.difficulty == 1 ? "normal" : "diff"}`)} />
                                          </li>
                                          <li className="font-color"><div className="icon"><img src={require("@site/static/img/icon-people.png").default} alt="" /></div>{e?.readNum}</li>
                                          {
                                              e?.time &&
                                              <li className="font-color-span"><div className="icon"><img src={require("@site/static/img/icon-time.png").default} alt="" /></div>{totalTime(e.time)}</li>
                                          }
                                      </ul>
                                      <Divider />
                                      <ul className="tag-list">
                                          <GetTags tutorial={e} t={t} />
                                      </ul>
                                  </div>
                                  {
                                      e?.percent !== 0 &&
                                      <div className="progress">
                                          {e.percent}
                                          {t("progress")} {parseInt(e.percent * 100)}%
                                      </div>
                                  }
                              </div>
                          </a>
                      )
                  }
              </div>
          </div>
      </div>
    </div>
    </main>
  </Layout>


  );
}
