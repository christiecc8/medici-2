import React, { useState, useEffect, useCallback } from 'react'
import useWallet from '../hooks/useWallet'
import { Contract } from '../model/types'
import { getAllContracts } from '../utils/retrieve'
import ContractCardV2 from '../components/projects/ContractCardV2'
import { Chain } from '../model/types'

const ProjectManager: React.FC<{}> = () => {
const { wallet, connect, setChain, currentChain } = useWallet()
const connectedWallet = wallet?.accounts[0].address;

const [contracts, setContracts] = useState<Contract[]>()
  
const getContracts = useCallback(async () => {
  if (connectedWallet && currentChain) {
  const { contracts } = await getAllContracts(connectedWallet, currentChain.id);
  setContracts(contracts)
  }
}, [contracts, currentChain, connectedWallet])

useEffect(() => {
  getContracts()
}, [connectedWallet, currentChain, getContracts])

  return (
    <div className="w-full p-10 md:mt-10 flex flex-col items-center">
        <h1 className="text-center text-4xl font-semibold">
            All Projects
        </h1>
        <br></br>
        <span className="text-center md:w-3/5 font-extralight md:text-2xl text-zinc-500">
        {!connectedWallet && <p>Connect your wallet to see all your projects.</p>}
        </span>
        {/* { connectedWallet && connectedChain && <AllContracts masterAddress={connectedWallet} connectedChain={connectedChain.id}/>} */}
        <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3">
        {contracts && contracts.map((contract: Contract, i) => (
          <ContractCardV2 contract={contract} key={`${contract}-${i}`}/>
      ))}
        </div>
    </div>
  )
}

export default ProjectManager