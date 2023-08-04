import React, { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';
import { useLocation } from '@docusaurus/router';
import { getTutorialStatus } from '../../../../utils/tutorialsCache';
import { GlobalContext } from '../../../../provider';
import CustomSidebar from '../../../../components/CustomSidebar';
export default function DocPageLayoutMain({hiddenSidebarContainer, children}) {

  const sidebar = useDocsSidebar();
  const location = useLocation();
  const boxRef = useRef(null);
  const { updateStatus } = useContext(GlobalContext);
  const json = require("@site/tutorials.json");
  let [isBottomVisible, setIsBottomVisible] = useState(false);
  let [selectItem, setSelectItem] = useState();
  let [isFinish, setIsFinish] = useState();

  function init(params) {
    const path = location.pathname.split("/tutorial/")[1];
    const catalogueName = path.split("/")[0];
    const selectJson = json.filter(e => e.catalogueName === catalogueName)[0];
    selectItem = {
      catalogueName: catalogueName,
      docId: path,
      docType: selectJson.docType
    }
    setSelectItem({...selectItem});
    if (catalogueName === "category") {
      return
    }
    isFinish = getTutorialStatus(selectItem);
    setIsFinish(isFinish)
  }

  // 阅读完当前页
  function update(params) {
    if (selectItem.docType === "video") {
      return
    }
    updateStatus(selectItem.docId)
    setIsFinish(true);
  }

  const handleScroll = () => {
    if (boxRef.current) {
      const elementRect = boxRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      isBottomVisible = elementRect.bottom * 0.8 <= viewportHeight;
      setIsBottomVisible(isBottomVisible);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    isBottomVisible && isFinish === false && update()
  },[isBottomVisible])

  useEffect(() => {
    if (location.pathname.indexOf("/tutorial/category") !== -1) {
      return
    }
    init()
  },[location])

  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced,
        styles.margin_top_83
      )}>
      <div
        ref={boxRef}
        className={clsx(
          'container padding-top--md padding-bottom--lg',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced,
        )}>
        {children}
        
      </div>

      {
        typeof window !== 'undefined' && window.screen.width < 996 &&
        <CustomSidebar />
      }

    </main>
  );
}
