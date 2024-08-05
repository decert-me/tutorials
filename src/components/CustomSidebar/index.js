import React, { useContext, useEffect, useState } from 'react';
import "./styles.scss"
import { Button, Drawer } from 'antd';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';
import { tutorialsDataToCache, tutorialsInit, tutorialsItemsInit } from '../../utils/tutorialsCache';
import { useAccount } from 'wagmi';
import { GlobalContext } from '../../provider';
import { getTutorialProgress } from '../../request/public';

export default function CustomSidebar({toc}) {

    const sidebar = useDocsSidebar();
    const { address } = useAccount();
    const { updateTutorial } = useContext(GlobalContext);
    const json = require("../../../tutorials.json");
    const [open, setOpen] = useState(false);
    let [tokenId, setTokenId] = useState();
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

    const showDrawer = () => {
        setOpen(!open);
        document.body.classList.add("scroll-hidden");
    };

    const onClose = () => {
        setOpen(false);
        document.body.classList.remove("scroll-hidden");
    };

    function init() {
        tokenId = json[0]?.challenge;
        setTokenId(tokenId);
    }

    function eventInit(params) {
        const doms = document.querySelectorAll(".custom-drawer .menu__link");
        // 为每个节点添加点击事件
        doms.forEach(function(dom) {
            dom.addEventListener('click', onClose);
        });
    }

    async function sidebarInit(params) {
        // 1、所选教程 ==> arr
        const items = tutorialsItemsInit(sidebar.items);

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
        let docId = findDocId(sidebar.items)?.docId.split('/')[0];
        json.forEach(e => {
          if (docId === e.catalogueName) {
            selectItem = e;
            setSelectItem({...selectItem});
          }
        })
        sidebarInit();
    }

    useEffect(() => {
        init();
    },[]);

    useEffect(() => {
        open && json[0].docType !== "page" && eventInit();
    },[open])

    useEffect(() => {
        sidebar && update();
    },[sidebar])
    
    return (
        <>
            {/* 移动端弹出侧边栏 */}
            <div className="custom-sidebar"
                onClick={showDrawer}
            >
                <img src={require(`@site/static/img/icon-menu.png`).default} alt="" />
            </div>


            <Drawer
                rootClassName={`custom-drawer ${tokenId ? "pb80" : ""}`}
                placement="bottom"
                closable={false}
                onClose={onClose}
                open={open}
                // mask={false}
                key="bottom"
                // zIndex={20}
            >
                {
                    json[0].docType !== "page" ?
                    <NavbarMobileSidebarSecondaryMenu />
                    :
                    <ul className="page-ul">
                        {
                            toc.map(item => 
                                <li key={item.id}>
                                    <a href={`#${item.id}`} onClick={onClose}>{item.value}</a>
                                </li>  
                            )
                        }
                    </ul>
                }

                {/* <NavbarMobileSidebarPrimaryMenu /> */}
                {
                    tokenId &&
                    <div className="goChallenge">
                        <Button 
                            type="primary"
                            onClick={() => {
                                window.open(`${tokenId}`, '_blank')
                            }}
                        >
                            开始挑战</Button>
                    </div>
                }
                <div className="custom-line" onClick={() => showDrawer()} />
            </Drawer>
        </>
    )
}