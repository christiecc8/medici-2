import React, { useEffect, useState, useCallback } from 'react'
import useWallet from '../../hooks/useWallet';
import { Project } from '../../model/projects';
import { Chain, Contract } from '../../model/types';
import { INVALID_CHAIN } from '../../model/chains';
import { utils } from 'ethers'
import Modal from '@mui/material/Modal';
import { IconButton } from '@mui/material';
import { RiCloseFill } from 'react-icons/ri';
import { WalletState } from '@web3-onboard/core';
import { getMerkleRoot, generateNewContract, getNewLaunchedContract, whitelist } from '../../utils/web3'
import { parseData } from '../../utils/parse'

const CreatedProjectModal: React.FC<{showModal: boolean, handleClose: any, project: Project, wallet: WalletState, name: string}> = ({showModal, handleClose, project, wallet, name}) => {
  const [step, setStep] = useState<number>(1)
  const [hasAllowlist, setHasAllowlist] = useState<boolean>()
  const [ContractCreationResult, setContractCreationResult] = useState<Contract>()
  const {currentChain, setChain} = useWallet()

  const nextStep = () => {
    setStep(step + 1);
  };

  const generateSmartContract = async (merkleRoot: string, whitelistedAddresses: string[]) => {
    try {
        await generateNewContract(
          wallet,
          merkleRoot,
          { 
            name: name,
            symbol: project.symbol!,
            baseuri: project.baseURI,
            maxSupply: parseInt(project.totalSupply),
            price: "0.01",
            maxMintsPerPerson: 1,
            masterAddress: utils.getAddress(wallet.accounts[0].address),
            claimStartBlock: "0",
            mintStartBlock: "0"
        });
        const result = await getNewLaunchedContract(utils.getAddress(wallet.accounts[0].address), currentChain!);
        setContractCreationResult(result);
        await whitelist(name, currentChain!.hexId, whitelistedAddresses, merkleRoot);
    } catch {
        alert("Something went wrong!")
    }
  }

  const noAllowlist = async () => {
    if (!wallet) {
      alert("Please connect your wallet and try again!")
    }
    else {
      /* medici wallet address as second address for merkle tree */
      const parsedStrings = [wallet.accounts[0].address, '0xABeF33AA09593Ee532Cf203074Df2f19f9C61f8f'];
      const merkleRoot = await getMerkleRoot(parsedStrings);
      await generateSmartContract(merkleRoot, parsedStrings)
    }
  }
  
  const onSubmitAllowlist = async (file: File) => {
    if (hasAllowlist) {
      console.log(file);
      const parsedStrings = await parseData(file);
      const merkleRoot = await getMerkleRoot(parsedStrings);
      await generateSmartContract(merkleRoot, parsedStrings)
    }
  }

  const LaunchProjectModalStepOne = (
    <Modal
      open={showModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <div className="relative w-[400px] top-[20%] mx-auto p-5 text-white text-center rounded-2xl bg-white/10 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none z-100">
    <IconButton
    aria-label="close"
    onClick={handleClose}
    sx={{
      position: 'absolute',
      right: 8,
      top: 8
    }}
    >
    <RiCloseFill color='white' />
  </IconButton>
    <h1 className="text-3xl m-2 font-drukwide text-left">Launch</h1>
      <div className="space-y-3 w-4/5 mt-5">
        <h1>Do you have an allowlist?</h1>
        <div className="space-x-5">
          <button className="bg-black text-white px-5 py-2 rounded-md" onClick={() => { setHasAllowlist(false); noAllowlist(); setStep(3)}}>No</button>
          <button className="bg-black text-white px-5 py-2 rounded-md" onClick={() => { setHasAllowlist(true); nextStep()}}>Yes</button>
        </div>
      </div>
    </div>
    </Modal>
  )

  const LaunchProjectModalHasAllowlist = (
    <Modal
      open={showModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <div className="relative w-[400px] top-[20%] mx-auto p-5 text-white text-center rounded-2xl bg-white/10 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none z-100">
    <IconButton
    aria-label="close"
    onClick={handleClose}
    sx={{
      position: 'absolute',
      right: 8,
      top: 8
    }}
    >
    <RiCloseFill color='white' />
    </IconButton>
    <h1 className="text-3xl m-2 font-drukwide text-left">Launch</h1>
      <div className="space-y-3 mt-5">
        <div id="allowlist-options" className="m-10 items-center space-y-5 w-3/5">
        <div id="allowlist-upload">
        <input
            type="file"
            name="whitelistData"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            id="whitelistData"
            style={{'display': 'none'}}
            onChange={(event) => onSubmitAllowlist(event.target.files![0])}
        />
        <label htmlFor="whitelistData">
          <div className="flex w-full items-center">
            <span className="bg-black p-3 rounded-md m-auto text-center whitespace-nowrap">Upload Allowlist</span>
          </div>
        </label>
        </div>
      </div>
      </div>
    </div>
    </Modal>
  )

  const LaunchProjectModalGenerateContract = (
    <Modal
      open={showModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <div className="relative w-[400px] top-[20%] mx-auto p-5 text-white text-center rounded-2xl bg-white/10 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none z-100">
      <IconButton
      aria-label="close"
      onClick={handleClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8
      }}
      >
      <RiCloseFill color='white' />
      </IconButton>
      <h1 className="text-3xl m-2 font-drukwide text-left">Launch</h1>
        <div className="space-y-3 mt-5">
          
        </div>
      </div>
    </Modal>
  )

  switch(step) {
    case 3: return LaunchProjectModalGenerateContract
    case 2: return LaunchProjectModalHasAllowlist
    default: return LaunchProjectModalStepOne
  }
}
export default CreatedProjectModal