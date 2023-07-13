import React, { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';
import { useLocation } from '@docusaurus/router';
import { getTutorialStatus } from '../../../../utils/tutorialsCache';
import { GlobalContext } from '../../../../provider';
import { useAccount } from 'wagmi';
export default function DocPageLayoutMain({hiddenSidebarContainer, children}) {

  const sidebar = useDocsSidebar();
  const location = useLocation();
  const boxRef = useRef(null);
  const { address } = useAccount();
  const { updateStatus } = useContext(GlobalContext);
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  let [selectItem, setSelectItem] = useState();
  let [isFinish, setIsFinish] = useState();

  function init(params) {
    const path = location.pathname.split("/tutorial/")[1];
    selectItem = {
      catalogueName: path.split("/")[0],
      docId: path
    }
    setSelectItem({...selectItem});
    isFinish = getTutorialStatus(selectItem);
    setIsFinish(isFinish)
  }

  // 阅读完当前页
  function update(params) {
    updateStatus(selectItem.docId)
    setIsFinish(true);
  }

  const handleScroll = () => {
    if (boxRef.current) {
      const elementRect = boxRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = elementRect.bottom <= viewportHeight;
      setIsBottomVisible(isVisible);
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
    init()
  },[location])

  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced,
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
    </main>
  );
}
