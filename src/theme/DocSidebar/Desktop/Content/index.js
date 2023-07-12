import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import DocSidebarItems from '@theme/DocSidebarItems';
import styles from './styles.module.css';
import './custom.scss';
import { Button, Divider } from 'antd';
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
  let [selectItem, setSelectItem] = useState();

  useEffect(() => {
    json.forEach(e => {
      if (path.indexOf(e.catalogueName) !== -1) {
        selectItem = e;
        setSelectItem({...selectItem});
      }
    })
  },[])

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