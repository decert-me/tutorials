import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import MDXContent from '@theme/MDXContent';
import TOC from '@theme/TOC';
import styles from './styles.module.css';
import './index.css';
import {
  HomeFilled,
} from '@ant-design/icons';
import { useLocation } from '@docusaurus/router';
import { Button } from 'antd';
import { useAccount } from 'wagmi';
import { getTutorialProgress, updateProgress } from '../../request/public';
import CustomSidebar from '../../components/CustomSidebar';

function RepoUrl(selectRepoUrl, isMobile) {
  
  return (
    <a href={selectRepoUrl} target="_blank" rel="noopener noreferrer">
      <div className="breadcrumbs_repo_url">
        <img src={require(`@site/static/img/repo-link.png`).default} alt="" />
        {
          !isMobile && <p>来源链接</p>
        }
      </div>
    </a>
  )
}

export default function MDXPage(props) {
  const {content: MDXPageContent} = props;
  const {
    metadata: {title, description, frontMatter, source},
  } = MDXPageContent;
  const {wrapperClassName, hide_table_of_contents: hideTableOfContents} =
    frontMatter;
  const json = require("@site/tutorials.json");
  const location = useLocation();
  const boxRef = useRef(null);
  const { isConnected } = useAccount();


  let [tutorial, setTutorial] = useState();
  let [isMobile, setIsMobile] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  let [isBottomVisible, setIsBottomVisible] = useState(false);
  let [selectItem, setSelectItem] = useState();
  let [isFinish, setIsFinish] = useState();

  function changeToc(params) {
    setIsOpen(!isOpen);
  }

  function onScroll(params) {

    if (boxRef.current) {
      const elementRect = boxRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      isBottomVisible = elementRect.bottom * 0.8 <= viewportHeight;
      setIsBottomVisible(isBottomVisible);
    }

    if (isMobile) {
      return
    }

    const element = document.getElementById('custom-toc');
    const button = document.querySelector("#custom-toc .custom-bottom");
    const scrollbar = document.querySelector("#custom-toc .thin-scrollbar");
    const placeholder = document.getElementById('placeholder');
    const foot = document.querySelector(".Footer");
    const { left, width } = placeholder.getBoundingClientRect();
    const { left: myLeft, width: myWidth } = element.getBoundingClientRect();
    const { top } = foot.getBoundingClientRect();
    const hasBtn = tutorial?.challenge && button;

    if (document.documentElement.clientWidth <= 996) {
      return
    }

    if (hasBtn) {
      button.style.width = element.clientWidth + "px";
      button.style.left = (left || myLeft) + 1 + "px";
    }
    if (window.pageYOffset >= 16) {
      const pl = left || myLeft;
      const pw = width || myWidth;
      placeholder.style.display = "block";
      // 将元素设置为 fixed
      element.style.position = 'fixed';
      element.style.top = "92px";
      element.style.left = pl+ "px";
      element.style.width = pw + "px";
      if (hasBtn) {
        button.style.bottom = 0;
      }
      scrollbar.style.height = "calc(100vh - 82px - 82px - 16px)";
      if (window.innerHeight > top - 100) {
        element.style.bottom = (window.innerHeight - top + 100) + "px";
        element.style.top = "auto";
        scrollbar.classList.add("small-height");
        if (hasBtn) {
          button.style.bottom = (window.innerHeight - top + 100) + "px";
        }
      }else{
        scrollbar.classList.remove("small-height");
      }
    } else {
      // 否则，将元素设置回正常位置
      element.style.position = 'static';
      placeholder.style.display = "none";
      scrollbar.style.height = "calc(100vh - 82px - 10px - 82px - 16px)";
      if (hasBtn) {
        button.style.bottom = 0;
      }
    }
  }

  // 阅读完当前页
  function update(params) {
    updateStatus()
    setIsFinish(true);
  }

  // 更新学习进度
  async function updateStatus() {
    // 判断当前是否登陆 => 
    const {catalogueName, docId} = selectItem;
    if (isConnected) {
      await updateProgress({
        catalogueName,
        data: [{ docId, is_finish: true}]
      })
    }else{
      const local = JSON.parse(localStorage.getItem("decert.tutorials"));
      local.forEach(e => {
        if (e.catalogueName === catalogueName) {
          e.list[0].is_finish = true;
        }
      })
      localStorage.setItem("decert.tutorials", JSON.stringify(local));
    }
  }
  
  // 判断当前的教程是否有被初始化
  function hasRecord({catalogueName, docId}) {
    if (isConnected) {
      getTutorialProgress({
        catalogueName: catalogueName,
        data: [{docId}]
      })
      .then(res => {
        if (res.status === 0) {
          setIsFinish(res.data.data[0].is_finish);
        }

      })
      return
    }
    const local = localStorage.getItem("decert.tutorials");
    if (local) {
      const data = JSON.parse(local);
      const has = data.filter(e => e.catalogueName === catalogueName)

      // 如果有 ? 则获取记录 : 则初始化记录
      if (has.length !== 0) {
        const {is_finish} = has[0];
        setIsFinish(is_finish)
      }else{
        data.push({
          catalogueName,
          list: [{
            docId,
            is_finish: false
          }]
        })
        localStorage.setItem("decert.tutorials", JSON.stringify(data));
      }
    }
  }

  function init(params) {
    const path = location.pathname.split("/tutorial/")[1];
    const catalogueName = path.split("/")[0];
    const selectJson = json.filter(e => e.catalogueName === catalogueName)[0];
    setIsBottomVisible(false);
    selectItem = {
      catalogueName: catalogueName,
      docId: path,
      docType: selectJson.docType
    }
    setSelectItem({...selectItem});

    // 获取本地缓存内是否有page的阅读记录，如果没有则创建
    hasRecord({catalogueName, docId: path});

  }

  useEffect(() => {
    const arr = source.split("/");
    const select = arr[arr.length - 2];
    const selectTutorial = json.filter(item => item.catalogueName === select);
    if (selectTutorial.length !== 0) {
      tutorial = selectTutorial[0];
      tutorial.repoUrl = tutorial.repoUrl + `/tree/${tutorial.branch || "main"}${tutorial.docPath || ""}`

      setTutorial({...tutorial});
      isMobile = document.documentElement.clientWidth <= 996 ? true : false;
      setIsMobile(isMobile);
    }
  },[])

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener("resize", onScroll);
    }
  },[])

  useEffect(() => {
    const { hash } = location;
    hash && onScroll();
    init();
  },[location])

  useEffect(() => {
    init()
  },[isConnected])

  useEffect(() => {
    tutorial && onScroll();
  },[tutorial])

  useEffect(() => {
    isBottomVisible && !isFinish && update()
  },[isBottomVisible])

  useEffect(() => {
    console.log(MDXPageContent?.toc);
  },[MDXPageContent])

  return (
    <HtmlClassNameProvider
      className={clsx(
        wrapperClassName ?? ThemeClassNames.wrapper.mdxPages,
        ThemeClassNames.page.mdxPage,
      )}>
      <PageMetadata title={title} description={description} />
      <Layout>
        {
          isMobile && 
          <div className="page-breadcrumbs">
            <ul
              className="breadcrumbs"
              itemScope
              itemType="https://schema.org/BreadcrumbList">
              {tutorial && RepoUrl(tutorial.repoUrl, isMobile)}
              <li className='breadcrumbs__item'>
                <a href="https://decert.me/tutorials">
                  <HomeFilled style={{color: "#000"}} />
                </a>
              </li>
              <li
                className="breadcrumbs__item">
                <span 
                  className="breadcrumbs__link"
                  style={{
                    color: "#986344",
                    fontWeight: 600,
                    fontSize: "12px"
                  }}
                >{tutorial.label}</span>
              </li>
            </ul>
          </div>
        }
        <main ref={boxRef} className="container container--fluid margin-vert--lg page">
          <div className={clsx('row', styles.mdxPageWrapper)}>
            <div className={clsx('col', !hideTableOfContents && 'col--8')}>
              <article style={{ position: "relative" }}>
                {
                  isMobile &&
                  // toc写入
                  <div className="theme-doc-toc-mobile page-toc">
                    <button className={`clean-btn toc-btn ${isOpen ? "transform" : ""}`} onClick={() => changeToc()}>
                      本页总览
                    </button>
                    <div className={`toc-collapsibleContent ${isOpen ? "toc-open" : ""}`}>
                      <ul>
                        {
                          MDXPageContent.toc.map(item => 
                            <li key={item.id}>
                              <a href={`#${item.id}`}>{item.value}</a>
                            </li>  
                          )
                        }
                      </ul>
                    </div>
                  </div>
                }
              {
                tutorial && !isMobile && 
                <div className="page-header">
                  {RepoUrl(tutorial.repoUrl, isMobile)}
                </div>
              }
                <MDXContent>
                  <MDXPageContent />
                </MDXContent>
              </article>
            </div>
            {/* TODO: 样式调整 */}
            {!hideTableOfContents && MDXPageContent.toc.length > 0 && !isMobile && (
              <>
                <div className="col col--2" id="placeholder"></div>

                  <div className="col col--2" id="custom-toc">
                    <TOC
                      toc={MDXPageContent.toc}
                      minHeadingLevel={frontMatter.toc_min_heading_level}
                      maxHeadingLevel={frontMatter.toc_max_heading_level}
                    />
                    {
                      tutorial?.challenge &&
                      <div className="custom-bottom">
                          <Button 
                            type='primary'
                            onClick={() => {
                              window.open(`https://decert.me/quests/${tutorial.challenge}`, '_blank')
                            }}
                          >
                            开始挑战
                          </Button>
                      </div>
                    }
                  </div>
              </>
            )}
          </div>
          {
            typeof window !== 'undefined' && window.screen.width < 996 &&
            <CustomSidebar toc={selectItem?.docType === "page" ? MDXPageContent?.toc : []} />
          }
        </main>
      </Layout>
    </HtmlClassNameProvider>
  );
}
