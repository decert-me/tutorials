import React, { useEffect, useState } from 'react';
import "./styles.scss"
import { Button, Drawer } from 'antd';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';

export default function CustomSidebar({toc}) {

    const json = require("../../../tutorials.json");
    const [open, setOpen] = useState(false);
    let [tokenId, setTokenId] = useState();

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

    useEffect(() => {
        init();
    },[]);

    useEffect(() => {
        // open && json[0].docType !== "page" && eventInit();
    },[open])
    
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
                                window.open(`https://decert.me/quests/${tokenId}`, '_blank')
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