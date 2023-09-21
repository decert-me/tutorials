import React, { useEffect, useState } from 'react';
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
import {
  HomeFilled,
} from '@ant-design/icons';

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
  let [tutorial, setTutorial] = useState();
  let [isMobile, setIsMobile] = useState(false);



  useEffect(() => {
    const arr = source.split("/");
    const select = arr[arr.length - 2];
    const selectTutorial = json.filter(item => item.catalogueName === select);
    if (selectTutorial.length !== 0) {
      tutorial = selectTutorial[0];
      setTutorial({...tutorial});
      isMobile = document.documentElement.clientWidth <= 996 ? true : false;
      setIsMobile(isMobile);
    }
  },[])
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
                    fontWeight: 600
                  }}
                >{tutorial.label}</span>
              </li>
            </ul>
          </div>
        }
        <main className="container container--fluid margin-vert--lg page">
          <div className={clsx('row', styles.mdxPageWrapper)}>
            <div className={clsx('col', !hideTableOfContents && 'col--8')}>
              <article style={{ position: "relative" }}>
                {/* {
                  isMobile &&
                  // toc写入
                  "xx"
                } */}
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
            {!hideTableOfContents && MDXPageContent.toc.length > 0 && (
              <div className="col col--2">
                <TOC
                  toc={MDXPageContent.toc}
                  minHeadingLevel={frontMatter.toc_min_heading_level}
                  maxHeadingLevel={frontMatter.toc_max_heading_level}
                />
              </div>
            )}
          </div>
        </main>
      </Layout>
    </HtmlClassNameProvider>
  );
}
