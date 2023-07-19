import React from 'react';
import json from "./i18n.json";



export const getMenu = (language, address, disconnect) => {

    const menu = [
        {
            label: (<a href="/publish"> 发布 </a>),
            key: '0',
            icon: '',
        },
        {
            type: 'divider',
        },
        {
            label: (<a href={`/user/${address}`}> 个人中心 </a>),
            key: '1',
            icon: '',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <a 
                    href={`/${address}`}
                > 
                    认证
                </a>
            ),
            key: '2',
            icon: '',
        },
        {
            type: 'divider',
        },
        {
            label: (<p onClick={() => disconnect()}> 断开链接 </p>),
            key: '3',
            icon: '',
        }
    ]

    return menu
} 
