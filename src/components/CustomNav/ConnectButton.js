import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown } from "antd";
import { useAccount, useSigner } from 'wagmi';
import CustomSign from '../CustomSign';
import { GlobalContext } from '../../provider';

export default function ConnectButton(props) {
    
    const { 
        isMobile, 
        menu, openModal
    } = props;

    const { isSign, setIsSign } = useContext(GlobalContext);
    const { address, isConnected } = useAccount();

    function NickName(address) {
        return address && address.substring(0,5) + "..." + address.substring(38,42);
    }

    useEffect(() => {
        console.log(menu);
    },[menu])

    return (
        <>
            {
                isSign &&
                <CustomSign />
            }
            {
                isMobile ?
                    <>

                    </>
                :
                    isConnected ?
                        <Dropdown
                            placement="bottom" 
                            // trigger="click"
                            menu={{
                                items: menu
                            }}
                            overlayClassName="custom-dropmenu"
                            overlayStyle={{
                                width: "210px"
                            }}
                        >
                            <div className="user" id="hover-btn-line">
                                {/* <img src={user?.avatar} alt="" /> */}
                                <p>{NickName(address)}</p>
                            </div>
                        </Dropdown>
                    :
                        <Button
                            onClick={() => openModal()} 
                            id='hover-btn-full'
                            className='connect'
                        >链接钱包</Button>
            }   
        </>
    )
}