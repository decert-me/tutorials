import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect, useSigner } from "wagmi";
import { getLoginMsg } from "../../request/public";
import { Modal } from 'antd';
const { confirm } = Modal;


export default function CustomSign(params) {
    
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: signer } = useSigner();
    let [nonce, setNonce] = useState();

    async function getNonce(params) {
        confirm({
            title: 'Please sign the message in your wallet.',
            className: "modalSigner",
            icon: <></>,
            maskStyle: {
                backgroundColor: "rgba(0, 0, 0, 0.9)"
            },
            content: null,
            footer: null
        });

        nonce = await getLoginMsg({address})
        .then(res => {
            return res.data.loginMessage;
        })
        setNonce(nonce);
    }

    async function getSignature(params) {
        signer?.signMessage(nonce)
        .then(res => {
            res?.data && localStorage.setItem(`decert.token`,res.data.token)
            Modal.destroyAll();
        })
        .catch(err => {
            // 拒绝签名
            Modal.destroyAll();
            disconnect();
        })
    }

    useEffect(() => {
        const token = localStorage.getItem("decert.token");
        isConnected && !token && getNonce();
    },[isConnected])

    useEffect(() => {
        nonce && signer && getSignature();
    },[signer])

    return (
        <div>
            
        </div>
    )
}