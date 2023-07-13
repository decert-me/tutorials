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

  useEffect(() => {
    if (selectTutorial.length > 0) {
      const res = selectTutorial.find(e => e.docId === item.docId.replace(/\/readme$/i, "/"));
      isFinish = res.is_finish;
      setIsFinish(isFinish)
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
          position: "relative"
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
          isFinish &&
          <Progress 
            type="circle" 
            percent={100} 
            size={20} 
            style={{
              position: "absolute",
              right: 12
            }}
          />
            :
            <Progress 
            type="circle" 
            percent={isFinish ? 100 : 0} 
            size={20} 
            style={{
              position: "absolute",
              right: 12
            }}
          />
        }
      </Link>
    </li>
  );
}
