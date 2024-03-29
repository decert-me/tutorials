import React, { useContext, useEffect, useState } from 'react';
import { Button } from "antd";
import "../../css/component/customNav.scss"
import logo from "../../../static/img/logo-normal.png"
import {
    MenuOutlined,
    CloseOutlined,
    GlobalOutlined
  } from '@ant-design/icons';
import json from "./i18n.json";
import ConnectModal from './ConnectModal';
import ConnectButton from './ConnectButton';
import { useAccount, useDisconnect } from 'wagmi';
import { getMenu } from './menu';
import { useWeb3Modal } from '@web3modal/react';
import { GlobalContext } from '../../provider';

export default function CustomNav() {

    const { open } = useWeb3Modal();
    const { address, isConnected } = useAccount()
    const { updateUser } = useContext(GlobalContext);
    const { disconnect } = useDisconnect({
        onSuccess() {
            localStorage.removeItem("decert.token");
            updateUser();
            window.history.go(0);
        }
    });

    let [openConnect, setOpenConnect] = useState(false);
    let [menu, setMenu] = useState([]);     //  登陆后user展示下拉菜单

    let [isOpenM, setIsOpenM] = useState(false);
    let [isMobile, setIsMobile] = useState(false);
    let [language, setLanguage] = useState("CN");
    let [cache, setCache] = useState("");
    
    function toggleI18n() {
        language = language === "CN" ? "EN" : "CN";
        setLanguage(language);
    }

    function goHome(params) {
        if (typeof window !== 'undefined') {
            window.open("https://decert.me", "_self");
        }
    }

    function openModal() {
        isMobile ?
        open()
        :
        setOpenConnect(true);
    }

    function handleCancel() {
        setOpenConnect(false);
    }

    const menus = [
        { to: "https://decert.me/tutorials", label: json[language].lesson },
        { to: "https://decert.me/challenges", label: json[language].explore },
        { to: "https://decert.me/vitae", label: json[language].cert }
    ]

    useEffect(() => {
        if (isOpenM) {
          cache = document.querySelector("body").style.cssText;
          setCache(cache);
          document.querySelector("body").style.cssText = cache + "overflow: hidden !important;"
          document.querySelector("#docusaurus_skipToContent_fallback").style.cssText = "z-index: 1;"
        }else{
          document.querySelector("body").style.cssText = cache
          document.querySelector("#docusaurus_skipToContent_fallback").style.cssText = ""
        }
    },[isOpenM])

    useEffect(() => {
        isMobile = document.documentElement.clientWidth <= 996;
        setIsMobile(isMobile);
    },[])

    useEffect(() => {
        if (isConnected) {
            menu = getMenu(language, address, disconnect);
            setMenu([...menu]);
        }
    },[isConnected])

    return (
        <>
        <ConnectModal open={openConnect} handleCancel={handleCancel} />
        <div className="Header">
            <div className="header-content">
                <div className='nav-left'>
                    <div className="logo" onClick={goHome}>
                        <img src={logo} alt="" />
                    </div>
                    {
                        menus.map((e,i) => 
                            <a href={e.to} key={i} className={i === 0 ? "active" : ""}>
                                {e.label}
                            </a>    
                        )
                    }
                </div>
                <div className='nav-right'>
                    {
                        isMobile ?
                        <>
                            <div 
                                className={isOpenM ? "cfff":""}
                                style={{fontSize: "16px"}}
                                onClick={() => {setIsOpenM(!isOpenM)}} 
                            >
                                {
                                    isOpenM ?
                                    <CloseOutlined />
                                    :
                                    <MenuOutlined /> 
                                }
                            </div>
                        </>
                        :
                        <>
                            <Button 
                                type="ghost"
                                ghost
                                className='lang custom-btn'
                                id='hover-btn-line'
                                onClick={() => toggleI18n()}
                            >
                                {language === 'CN' ? "CN" : "EN"}
                            </Button>
                            <ConnectButton
                                menu={menu} 
                                openModal={openModal} 
                            />
                        </>
                    }
                </div>
            </div>
        </div>
        {
            isMobile &&
            <div className={`mask-box ${isOpenM ? "mask-box-show" : ""}`}>
                <ul>
                    {
                        menus.map((e,i) => 
                            <a href={e.to} key={i}>
                                <li>
                                    {e.label}
                                </li>
                            </a>    
                        )
                    }
                    
                    <li className="toggle" onClick={() => toggleI18n()}>
                        <GlobalOutlined className='icon' />
                        <p>{language === 'cn' ? "中文" : "EN"}</p>
                    </li>
                </ul>


                {
                    isConnected ?
                    <Button danger type="primary" onClick={() => disconnect()}>断开连接</Button>
                    :
                    <Button onClick={() => openModal()}>连接钱包</Button>
                }
            </div>
        }
        </>
    )
}
                