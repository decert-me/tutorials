import React, { useContext, useEffect } from 'react';
import { Divider, Modal } from "antd";
import { useAccount, useConnect } from "wagmi";
import { GlobalContext } from '../../provider';
import { useWeb3Modal } from '@web3modal/react';


export default function ConnectModal(props) {

    const { open, handleCancel } = props;

    const { open: openWeb3Modal, close } = useWeb3Modal();
    const { setIsSign } = useContext(GlobalContext);
    const { connect, connectors } = useConnect({
        chainId: Number(process.env.CHAIN_ID)
    });
    const { connector, isReconnecting } = useAccount({
        onConnect() {
            handleCancel();
        }
    })

    function goConnect(e) {
        if (e.name === "WalletConnect") {
            handleCancel()
            openWeb3Modal()
            setIsSign(true);
            return
        }
        connect({ connector: e })
        setIsSign(true);
    }

    return (
        <Modal
            className="ModalConnect" 
            open={open}
            onCancel={handleCancel}
            footer={null}
            closeIcon={<></>}
            width={500}
            centered
        >
            {
                connectors.map((x,i) => (
                    <div key={x.name}>
                    <div
                        className="wallet-item"
                        disabled={!x.ready || isReconnecting || connector?.id === x.id}
                        onClick={() => goConnect(x)}
                    >
                        <div className="item">
                            <div className="img">
                                <img src={require(`@site/static/img/${x.name}.png`).default} alt="" />
                            </div>
                            <p className="name">
                                {x.name}
                            </p>
                            <p className="tips">
                                {x.name === 'MetaMask' ? 
                                'Connect to your MetaMask Wallet'
                                :'Scan with WalletConnect to connect'
                                }
                            </p>
                        </div>
                    </div>
                    {
                        i < connectors.length-1 &&
                        <Divider />
                    }
                    </div>
                ))
                }
        </Modal>
    )
}