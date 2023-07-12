import './custom.scss';
import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import DocSidebarItems from '@theme/DocSidebarItems';
import styles from './styles.module.css';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import { Button, Divider } from 'antd';
import { tutorialsDataToCache, tutorialsInit, tutorialsItemsInit } from '../../../../utils/tutorialsCache';
import { getTutorialProgress } from '../../../../request/public';
import { useAccount } from 'wagmi';
import { useLocation } from '@docusaurus/router';


function useShowAnnouncementBar() {
  const {isActive} = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);
  useScrollPosition(
    ({scrollY}) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0);
      }
    },
    [isActive],
  );
  return isActive && showAnnouncementBar;
}
export default function DocSidebarDesktopContent({path, sidebar, className}) {
  const showAnnouncementBar = useShowAnnouncementBar();

  const json = require("../../../../../tutorials.json");
  const { address } = useAccount();
  const location = useLocation();
  let [selectItem, setSelectItem] = useState();
  let [tutorials, setTutorials] = useState();

  function init(params) {
    // 1、所选教程 ==> arr
    const items = tutorialsItemsInit(sidebar);
    // return

    console.log("address ====>", address);
    if (address) {
      // 2、向后端发起请求
      console.log("items ===>", items);
      const data = JSON.parse(JSON.stringify(items));
      data.forEach(e => delete e.is_finish)
      getTutorialProgress({
        catalogueName: selectItem.catalogueName,
        data: data
      })
      .then(res => {
        if (res.status === 0) {
          // TODO: 判断当前local是否存储
          tutorialsDataToCache(res.data);
        }
      })
    }else{
      // 2、local初始化
      tutorials = tutorialsInit(selectItem.catalogueName, items)
      setTutorials([... tutorials]);
    }
  }

  useEffect(() => {
    if (address) {
      json.forEach(e => {
        if (path.indexOf(e.catalogueName) !== -1) {
          selectItem = e;
          setSelectItem({...selectItem});
        }
      })
      init();
    }
  },[address])

  return (
    <nav
      aria-label={translate({
        id: 'theme.docs.sidebar.navAriaLabel',
        message: 'Docs sidebar',
        description: 'The ARIA label for the sidebar navigation',
      })}
      className={clsx(
        'menu thin-scrollbar',
        styles.menu,
        showAnnouncementBar && styles.menuWithAnnouncementBar,
        className,
      )}>
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
        <DocSidebarItems items={sidebar} activePath={path} level={1} />
      </ul>
      <div className="custom-bottom">
        <Divider className='line'/>
        {
          selectItem?.challenge &&
          <Button 
            type='primary'
            onClick={() => {
              console.log({path, sidebar});
              console.log(selectItem);
              console.log(tutorials);
              // window.open(`https://decert.me/quests/${selectItem.challenge}`, '_blank')
            }}
          >
            开始挑战
          </Button>
        }
      </div>
    </nav>
  );
}
