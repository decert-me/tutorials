import React, { useEffect, useState } from 'react';
import "./styles.scss"
import { Button, Drawer } from 'antd';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';

export default function CustomSidebar(params) {

    const json = require("../../../tutorials.json");
    const [open, setOpen] = useState(false);
    let [tokenId, setTokenId] = useState();

    const showDrawer = () => {
        setOpen(!open);
    };

    const onClose = () => {
        setOpen(false);
    };

    function init() {
        tokenId = json[0]?.challenge;
        setTokenId(tokenId);
    }

    useEffect(() => {
        init();
    },[])
    
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
                    json[0].docType !== "page" &&
                    <NavbarMobileSidebarSecondaryMenu />
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