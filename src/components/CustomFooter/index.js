import React from 'react';
import Twitter from '../../../static/img/icon-twitter.png'
import Discord from '../../../static/img/icon-discord.png'
import Notion from '../../../static/img/icon-notion.png'
import Github from '../../../static/img/icon-github.png'
import logo_white from "../../../static/img/logo-white.png";
import "../../css/component/customFooter.scss"
import { Divider } from 'antd';

export default function AppFooter({ isMobile }) {

  const urls = [
    {label: "Dune", value: "https://dune.com/decertme/decert"},
    {label: "Notion", value: "https://decert.notion.site/Decert-me-8b479c6e443740f192a56f2e090829ab"},
    {label: "Twitter", value: "https://twitter.com/decertme"},
    {label: "Discord", value: `https://discord.gg/${process.env.REACT_APP_DISCORD_VERIFY_INVITE_LINK}`},
    {label: "Github", value: "https://github.com/decert-me"},
  ]

    return (
        <div className='Footer'>
          <div className="footer-content">
              {/* logo info */}
            <div className="left">
              <div className="logo">
                <img src={logo_white} alt="" />
              </div>
              <p>You are what you build.</p>
            </div>
            {/* right icon */}
            <div className="right">
              {
                urls.map(e => 
                  <a key={e.value} href={e.value} target="_blank">{e.label}</a>
                )
              }
            </div>
          </div>
          <Divider />
          <div className="footer-record">
            <span className="versions">© 2023 DeCert.me | </span>
            <a href="https://beian.miit.gov.cn/" target="_blank"><span className='versions' style={{color: "#fff"}}>粤ICP备17140514号-3</span></a>
          </div>
        </div>
    )
}