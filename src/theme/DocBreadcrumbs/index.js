import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {ThemeClassNames, useThemeConfig} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useSidebarBreadcrumbs,
} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
import styles from './styles.module.css';
import {
  HomeFilled,
} from '@ant-design/icons';
import { useLocation } from '@docusaurus/router';

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
// TODO move to design system folder
function BreadcrumbsItemLink({children, href, isLast}) {
  const className = 'breadcrumbs__link';
  if (isLast) {
    return (
      <span className={className} itemProp="name">
        {children}
      </span>
    );
  }
  return href ? (
    <Link className={className} href={href} itemProp="item">
      <span itemProp="name">{children}</span>
    </Link>
  ) : (
    // TODO Google search console doesn't like breadcrumb items without href.
    // The schema doesn't seem to require `id` for each `item`, although Google
    // insist to infer one, even if it's invalid. Removing `itemProp="item
    // name"` for now, since I don't know how to properly fix it.
    // See https://github.com/facebook/docusaurus/issues/7241
    <span className={className}>{children}</span>
  );
}
// TODO move to design system folder
function BreadcrumbsItem({children, active, index, addMicrodata, select, setSelect, toggleMenu}) {
  function isSelect(params) {
    if (setSelect) {      
      if (index === 1) {
        toggleMenu(false)
        setSelect(!select)
      }
      if (index === 0) {
        toggleMenu(true)
        setSelect(!select)
      }
    }
  }
  return (
    <li
      {...(addMicrodata && {
        itemScope: true,
        itemProp: 'itemListElement',
        itemType: 'https://schema.org/ListItem',
      })}
      onClick={() => isSelect()}
      className={clsx('breadcrumbs__item', {
        // 'breadcrumbs__item--active': active,
        // 'breadcrumbs_item_active': active,
        },
        active && styles.breadcrumbs_item_active

      )}>
      {children}
      <meta itemProp="position" content={String(index + 1)} />
    </li>
  );
}

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items;
}

export default function DocBreadcrumbs() {

  const json = require("../../../tutorials.json");
  const breadcrumbs = useSidebarBreadcrumbs();
  const items = useNavbarItems();
  const location = useLocation();
  const [leftItems, rightItems] = splitNavbarItems(items);
  const [isShow, setIsShow] = useState(false);
  let [isMobile, setIsMobile] = useState(false);
  let [select, setSelect] = useState(false);
  let [primaryMenu, setPrimaryMenu] = useState([]);
  let [top, setTop] = useState(0);
  let [selectRepoUrl, setSelectRepoUrl] = useState();
  
  
  function toggleMenu(params) {
    setIsShow(params)
  }

  useEffect(() => {
    leftItems.map(e => {
      const base = e.docId.split("/")[0];
      if (location.pathname.includes(base)) {
        primaryMenu.push(e)
      }
    })
    setPrimaryMenu([...primaryMenu])
  },[])

  useEffect(() => {
    const box = document.querySelector(".theme-doc-breadcrumbs");
    if (box) {
      const resizeObserver = new ResizeObserver(entries => {
        // 监听到元素大小变化后执行的回调函数
        const { height } = entries[0].contentRect;
        top = height;
        setTop(top);
      });
  
      resizeObserver.observe(box);
  
      return () => {
        resizeObserver.unobserve(box);
      };
    }
  }, []);

  if (!breadcrumbs) {
    return null;
  }

  useEffect(() => {
    if (select) {
      document.querySelector("body").style.cssText = "overflow: hidden !important;"
    }else{
      document.querySelector("body").style.cssText = "overflow: auto;"
    }
  },[select])

  useEffect(() => {
    const obj = breadcrumbs[0];
    let selectDoc;
    if (obj.type === "category") {
      const arr = obj.items.filter(e => e.type === "link");
      selectDoc = arr[0].docId.split("/")[0];
    }else{
      selectDoc = obj.docId.split("/")[0];
    }
    const arr = json.filter(e => e.catalogueName === selectDoc)
    selectRepoUrl = arr[0].repoUrl;
    setSelectRepoUrl(selectRepoUrl);
    
    isMobile = document.documentElement.clientWidth <= 996 ? true : false;
    setIsMobile(isMobile);
  },[])

  return (
    <>
      <nav
        className={clsx(
          ThemeClassNames.docs.docBreadcrumbs,
          styles.breadcrumbsContainer,
        )}
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.navAriaLabel',
          message: 'Breadcrumbs',
          description: 'The ARIA label for the breadcrumbs',
        })}>
          {
            isMobile ?
            <ul
              className="breadcrumbs"
              itemScope
              itemType="https://schema.org/BreadcrumbList">
                {RepoUrl(selectRepoUrl, isMobile)}
              <li className='breadcrumbs__item'>
              <a href="https://decert.me/tutorials">
                <HomeFilled style={{color: "#000"}} />
              </a>
            </li>
            {primaryMenu.concat(breadcrumbs).map((item, idx) => {
              const isLast = idx === primaryMenu.concat(breadcrumbs).length - 1;
                return (
                  <BreadcrumbsItem
                    key={idx}
                    active={isLast}
                    index={idx}
                    addMicrodata={!!item.href}
                    >
                    <BreadcrumbsItemLink href={item.href} isLast={isLast}>
                      {item.label}
                    </BreadcrumbsItemLink>
                  </BreadcrumbsItem>
                );
              })}
            </ul> 
            :
            <ul
            className="breadcrumbs"
            itemScope
            itemType="https://schema.org/BreadcrumbList">
              {RepoUrl(selectRepoUrl, isMobile)}
            <li className='breadcrumbs__item'>
              <a href="https://decert.me/tutorials">
                <HomeFilled style={{color: "#000"}} />
              </a>
            </li>
            {primaryMenu.concat(breadcrumbs).map((item, idx) => {
              const isLast = idx === primaryMenu.concat(breadcrumbs).length - 1;
              return (
                <BreadcrumbsItem
                  key={idx}
                  active={isLast}
                  index={idx}
                  addMicrodata={!!item.href}
                  select={select}
                  setSelect={setSelect}
                  toggleMenu={toggleMenu}
                >
                  <BreadcrumbsItemLink href={item.href} isLast={isLast}>
                    {item.label}
                  </BreadcrumbsItemLink>
                </BreadcrumbsItem>
              );
            })}
          </ul>
          }
      </nav>
      {
        select &&
        <div>
          <div className='custom-bread' style={{top: `${top + 16 + 60 + 5}px`}}>
            {
              isShow ?
              <NavbarMobileSidebarPrimaryMenu />
              :
              <>
              <NavbarMobileSidebarSecondaryMenu />
              </>
            }
          </div>
          <div className="custom-mask" onClick={() => setSelect(false)}></div>
        </div>
      }
    </>
  );
}
