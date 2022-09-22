import React, { useEffect, useState, useCallback } from 'react'
import { Project } from '../../model/projects'
import { getContractCover, getContractInfoByName } from '../../utils/retrieve'
import CreatedProjectModal from './CreatedProjectModal'
import { Contract } from '../../model/types'
import { GET_CHAIN_BY_ID } from '../../model/chains'
import { getContract } from '../../utils/web3'
import useWallet from '../../hooks/useWallet'
import { utils } from 'ethers'
import LaunchedProjectModal from './LaunchedProjectModal'

enum Tabs {
  ACTION = 'Action',
  DETAILS = 'Details',
}

enum Actions {
  WITHDRAW = 'Withdraw',
  SET_PRICE = 'SetPrice',
  SET_MAX_PER_WALLET = 'SetMaxPerWallet',
  SET_CLAIM_BLOCK = 'SetClaimBlock',
  SET_MINT_BLOCK = 'SetMintBlock',
  TRANSFER_OWNERSHIP = 'TransferOwnership'
}

const LaunchedProject: React.FC<{ contractName: string, project: Project }> = ({contractName, project}) => {
  const [cover, setCover] = useState<string>();
  const [currentTab, setCurrentTab] = useState(Tabs.ACTION);
  const [balance, setBalance] = useState<any>()
  const [price, setPrice] = useState<any>()
  const [numMinted, setNumMinted] = useState<number>()
  const [maxSupply, setMaxSupply] = useState<number>()
  const [currentAction, setCurrentAction] = useState<Actions>();
  const [contract, setContract] = useState<Contract>();
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {setShowModal(!showModal)}
  const projectChain = contract && GET_CHAIN_BY_ID(parseInt(contract.chainid));

  const getCover = useCallback(async () => {
    const res = await getContractCover(contractName)
    setCover(res)
  }, [contractName])

  const getContractInfo = useCallback(async () => {
    const res = await getContractInfoByName(contractName)
    setContract(res)
  }, [contractName])

  const getContractDetails = useCallback(async () => {
    if (contract && projectChain) {
      const currContract = await getContract(contract.contractaddress, projectChain)
      const balance = await currContract.checkBalance()
      setBalance(utils.formatEther(balance._hex.toString()))
      const price = await currContract.price()
      setPrice(utils.formatEther(price._hex));
      const numMinted = await currContract.totalSupply()
      setNumMinted(numMinted.toString())
      const maxSupply = await currContract.maxSupply()
      setMaxSupply(maxSupply.toString())
    }
  }, [contract, projectChain])

  useEffect(() => {
    if (!cover) getCover()
    if (!contract) getContractInfo()
    if (!balance && !price && !numMinted && !maxSupply) getContractDetails()
  }, [
    cover, setCover,
    contract, setContract
  ])

  useEffect(() => {
    if (showModal) {
      document.getElementById("modal-container")!.style.display = 'block'
    } else {
      document.getElementById("modal-container")!.style.display = 'none'
    }
  }, [showModal, toggleModal])
  
  return (
    <div className="w-full h-screen flex flex-row -mt-16 bg-black">
      <div className="w-4/11 h-full p-10">
        <div className="flex flex-row mt-36 justify-between">
          <h1 className="font-drukwide text-5xl">{contractName}</h1>
          {/* <span className="bg-medici-purple px-4 py-2 rounded-md text-2xl">{project.status}</span> */}
        </div>
        <div className="w-full z-10 mt-10">
        <div>
          <ul className="font-drunkwide text-[#676767] header-title flex gap-8 border-b-[1.5px] border-[#676767] px-2">
            <li
              className={`${
                currentTab === Tabs.ACTION ? 'border-b-4' : ''
              } border-white relative top-[3px] cursor-pointer`}
              onClick={() => setCurrentTab(Tabs.ACTION)}
            >
              <h3 className={`${currentTab === Tabs.ACTION ? `text-white` : `text-[#676767]`} text-3xl font-authentic`}>ACTIONS</h3>
            </li>
            <li
              className={`${
                currentTab === Tabs.DETAILS ? 'border-b-4' : ''
              } border-white relative top-[3px] cursor-pointer`}
              onClick={() => setCurrentTab(Tabs.DETAILS)}
            >
              <h3 className={`${currentTab === Tabs.DETAILS ? `text-white` : `text-[#676767]`} text-3xl font-authentic`}>DETAILS</h3>
            </li>
          </ul>
        </div>
        <div>
          {currentTab === Tabs.ACTION ? (
          <div className="my-10 ml-3 space-y-5">
            <button className="text-left text-4xl text-[#676767] hover:text-white font-authentic"
            onClick={() => { setCurrentAction(Actions.WITHDRAW); toggleModal() }}>WITHDRAW FUNDS</button>
            <br></br>
            <button className="text-left text-4xl text-[#676767] hover:text-white font-authentic"
            onClick={() => { setCurrentAction(Actions.SET_PRICE); toggleModal() }}>SET PRICE</button>
            <br></br>
            <button className="text-left text-4xl text-[#676767] hover:text-white font-authentic"
            onClick={() => { setCurrentAction(Actions.SET_MAX_PER_WALLET); toggleModal() }}>SET MAX PER WALLET</button>
            <br></br>
            <button className="text-left text-4xl text-[#676767] hover:text-white font-authentic"
            onClick={() => { setCurrentAction(Actions.SET_CLAIM_BLOCK); toggleModal() }}>SET CLAIM BLOCK</button>
            <br></br>
            <button className="text-left text-4xl text-[#676767] hover:text-white font-authentic"
            onClick={() => { setCurrentAction(Actions.SET_MINT_BLOCK); toggleModal() }}>SET MINT BLOCK</button>
            <br></br>
            <button className="text-left text-4xl text-[#676767] hover:text-white font-authentic"
            onClick={() => { setCurrentAction(Actions.TRANSFER_OWNERSHIP); toggleModal() }}>TRANSFER OWNERSHIP</button>
            <br></br>
          </div>
          ) : (
            <div className="space-y-5 my-10 ml-3">
               <div className="flex flex-col justify-between leading-10 text-white/60 w-full">
          <h5 className="text-xl text-white mb-2">Details</h5>
          <table className="w-full">
            <tbody>
              <tr>
                <td>Balance</td>
                <td className="text-right">{balance} ETH</td>
              </tr>
              <tr>
                <td>Contract Address</td>
                <td className="text-right text-white">
                <a
                  href={`${projectChain!.etherscanUrl}/address/${
                    contract!.contractaddress
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                {contract?.contractaddress?.slice(0, 6)}...{contract?.contractaddress?.slice(-6)}
                </a>
                </td>
              </tr>
              <tr>
                <td>Contract Type</td>
                <td className="text-right">ERC-721</td>
              </tr>
              {contract && (
                <tr>
                  <td>Contract Owner</td>
                  <td className="text-right text-white">
                    {contract.masteraddress.slice(0, 6)}...{contract.masteraddress.slice(-6)}
                  </td>
                </tr>
              )}
              <tr>
                <td>Blockchain</td>
                <td className="text-right">{projectChain!.label}</td>
              </tr>
              <tr>
                <td>Number Minted</td>
                <td className="text-right">{numMinted}/{maxSupply}</td>
              </tr>
            </tbody>
          </table>
        </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <div className="w-full h-screen object-cover overflow-hidden">
        { cover && <img src={cover} className="w-full h-full object-cover"/> }
      </div>
      <div id="modal-container" className="flex items-center justify-center text-center{">
        { contract && <LaunchedProjectModal showModal={showModal} handleClose={toggleModal} contract={contract} action={currentAction}/>}
      </div>
    </div>
  );
}
export default LaunchedProject