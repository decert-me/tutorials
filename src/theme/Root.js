import React from 'react';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'

import { GlobalContextProvider } from '../provider';  //  全局变量

// Default implementation, that you can customize
export default function Root({children}) {

    const projectId = process.env.WALLETCONNECT_PROJECT_ID;

    const { chains, provider, webSocketProvider } = configureChains(
        [mainnet, polygonMumbai, polygon],
        [publicProvider()],
        [w3mProvider({ projectId })],
        { targetQuorum: 1 },
    )

    const web3modalClient = createClient({
        autoConnect: true,
        connectors: [
          ...w3mConnectors({ projectId, version: 2, chains })
        ],
        provider,
        webSocketProvider,
    })

    const wagmiClient = createClient({
        autoConnect: true,
        connectors: [
          new MetaMaskConnector({ chains }),
          new WalletConnectConnector({
            chains,
            options: {
              projectId: projectId,
              showQrModal: true
            },
          }),
        ],
        provider,
        webSocketProvider,
    })

    const ethereumClient = new EthereumClient(web3modalClient, chains)

    return (
        <GlobalContextProvider>

            <WagmiConfig client={wagmiClient}>
                <>{children}</>
            </WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </GlobalContextProvider>
    )
    
    
}