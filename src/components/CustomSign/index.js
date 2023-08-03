import React, { useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect, useSigner } from "wagmi";
import { authLoginSign, getLoginMsg } from "../../request/public";
import { Modal } from 'antd';
import { GlobalContext } from "../../provider";
const { confirm } = Modal;


export default function CustomSign(params) {
    
    const { address, isConnected } = useAccount();
    const { updateUser } = useContext(GlobalContext);
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
    }

    async function getSignature(params) {
        nonce = await getLoginMsg({address})
        .then(res => {
            return res.data.loginMessage;
        })
        setNonce(nonce);
        await signer?.signMessage(nonce)
        // .then(res => {
        //     res && localStorage.setItem(`decert.token`,res)
        //     Modal.destroyAll();
        // })
        .then(async(res) => {
            // 3、获取token
            await authLoginSign({
                address: address,
                message: nonce,
                signature: res
            })
            .then(res => {
                if (res) {
                    localStorage.setItem(`decert.token`,res.data.token)
                    window.history.go(0)
                }
            })
        })
        .catch(err => {
            // 拒绝签名
            Modal.destroyAll();
            disconnect();
            updateUser();
        })
    }

    useEffect(() => {
        const token = localStorage.getItem("decert.token");
        isConnected && !token && getNonce();
    },[isConnected])

    useEffect(() => {
        if (signer) {
            signer && getSignature();
        }
    },[signer])

    return (
        <div>

        </div>
    )
}