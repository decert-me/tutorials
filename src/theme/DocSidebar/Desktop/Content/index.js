import './custom.scss';
import React, {useContext, useEffect, useState} from 'react';
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
import { GlobalContext } from '../../../../provider';


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
  const { updateTutorial } = useContext(GlobalContext);
  let [selectItem, setSelectItem] = useState();
  let [tutorials, setTutorials] = useState();

  function findDocId(arr) {

    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];

      if (obj.hasOwnProperty('docId')) {
        return obj;
      }
    
      if (obj.hasOwnProperty('items') && Array.isArray(obj.items)) {
        for (let i = 0; i < obj.items.length; i++) {
          const result = findDocId(obj.items);
          if (result !== null) {
            return result;
          }
        }
      }
    }
    return null;
  }
  

  async function init(params) {
    // 1、所选教程 ==> arr
    const items = tutorialsItemsInit(sidebar);

    if (address) {
      // 2、向后端发起请求
      const data = JSON.parse(JSON.stringify(items));
      data.forEach(e => delete e.is_finish)
      await getTutorialProgress({
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
      if (!selectItem) {
        return
      }
      tutorials = tutorialsInit(selectItem.catalogueName, items)
      setTutorials([... tutorials]);
    }

    const local = JSON.parse(localStorage.getItem("decert.tutorials"));
    updateTutorial(local.filter(e => e.catalogueName === selectItem.catalogueName)[0].list)
  }

  function update(params) {
    let docId = findDocId(sidebar).docId.split('/')[0];
    json.forEach(e => {
      if (docId === e.catalogueName) {
        selectItem = e;
        setSelectItem({...selectItem});
      }
    })
    init();
  }

  useEffect(() => {
    address && init()
  },[address])

  useEffect(() => {
    update()
  },[sidebar])

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
        styles.menu_src_DocSidebar
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
              window.open(`https://decert.me/quests/${selectItem.challenge}`, '_blank')
            }}
          >
            开始挑战
          </Button>
        }
      </div>
    </nav>
  );
}
