import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import styles from './styles.module.css';
import { Progress } from 'antd';
import { GlobalContext } from '../../../provider';
export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {

  const { selectTutorial } = useContext(GlobalContext);

  const {href, label, className, autoAddBaseUrl} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  let [isFinish, setIsFinish] = useState();

  const progress = (percent) => {
    return (
      <>
        {
          percent !== 0 &&
            <Progress 
              type="circle" 
              percent={percent} 
              showInfo={false}
              size={level === 1 ? 20 : 18} 
              className={clsx(
                styles["custom-icon"],
                level === 1 && styles["custom-iconBig"]
              )}
              strokeColor="#43B472"
            />
        }
      </>
    )
  }

  useEffect(() => {
    if (selectTutorial.length > 0) {
      const res = selectTutorial.find(e => e.docId === item.docId.replace(/\/readme$/i, "/"));
      if (res) {        
        isFinish = res.is_finish;
        setIsFinish(isFinish)
      }
    }
  },[selectTutorial])

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx(
          'menu__link',
          !isInternalLink && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          },
        )}
        style={{
          position: "relative",
          paddingRight: 52
        }}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        {label}
        {!isInternalLink && <IconExternalLink />}
        {
          level === 1 ?
            progress(isFinish ? 100 : 0)
          :
            (
              isFinish &&
                <img 
                  src={require(`@site/static/img/${isFinish ? "icon-read" : "icon-unread"}.png`).default} 
                  alt="" 
                  className={clsx(styles["custom-icon"])}
                />
            )
        }
      </Link>
    </li>
  );
}
