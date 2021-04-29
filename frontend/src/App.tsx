import Web3Modal from 'web3modal'
import { Web3Provider } from '@ethersproject/providers'
import React, { useEffect, useState } from 'react'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { getNetworkNameFromId } from './utils/Network'
import { NetworkNames } from './config/enums'
import TopBar from './components/TopBar'
import Page from './components/Page'

declare global {
  interface Window {
    ethereum: any | undefined
  }
}

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {
    // metamask enabled by default so no need to specify here
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          /**
           * The RPC URL mapping should be indexed by chainId and it requires at least one value
           * ChainId's: Mainnet (1), Ropsten (3), Rinkeby(4), Goerli (5) and Kovan (42)
           **/
          1: 'http://localhost:9545'
        }
      }
    }
  }
})

// Get target network from `CHAIN_NETWORK` env variable
// The env variable needs to be defined in .env file locally or from command line
const targetNetwork = process.env.REACT_APP_CHAIN_NETWORK
  ? (process.env.REACT_APP_CHAIN_NETWORK as NetworkNames)
  : NetworkNames.LOCAL
console.log('targetNetwork:', targetNetwork)

const App = () => {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()
  const [network, setNetwork] = useState(
    window.ethereum
      ? getNetworkNameFromId(window.ethereum.chainId)
      : NetworkNames.UNKNOWN
  )
  // mock account
  const [account, setAccount] = useState(
    '0x9d9f8ab500e93FFF4fB5F1E688FfA9B9dE719FBa'
  )

  return (
    <>
      <TopBar networkName={network} account={account} />
      <Page account={account} networkName={network} />
    </>
  )
}

export default App
