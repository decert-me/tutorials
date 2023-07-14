import React, { useContext, useEffect, useState } from 'react';
import "./styles.scss"
import { Button, Drawer } from 'antd';
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout';
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';
import { GlobalContext } from '../../provider';

export default function CustomSidebar(params) {

    const json = require("../../../tutorials.json");
    const { selectTutorial } = useContext(GlobalContext);
    const [open, setOpen] = useState(false);
    let [tokenId, setTokenId] = useState();

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    function init() {
        const catalogueName = selectTutorial[0].docId.split("/")[0]
        const arr = json.filter(e => e.catalogueName === catalogueName);
        tokenId = arr[0]?.challenge;
        setTokenId(tokenId);
    }

    useEffect(() => {
        selectTutorial && selectTutorial.length > 0 && init();
    },[selectTutorial])
    
    return (
        <>
            {/* 移动端弹出侧边栏 */}
            <div className="custom-sidebar"
                onClick={showDrawer}
            >
                click
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
                <NavbarMobileSidebarSecondaryMenu />
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
            </Drawer>
        </>
    )
}