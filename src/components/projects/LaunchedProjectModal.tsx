import React, { useEffect, useState, useCallback } from 'react'
import { Chain, Contract } from '../../model/types';
import useWallet from '../../hooks/useWallet';
import { getContractForTransactions, readyToTransact } from '../../utils/web3';
import Modal from '@mui/material/Modal';
import { IconButton, CircularProgress } from '@mui/material';
import { RiCloseFill } from 'react-icons/ri';
import { utils } from 'ethers';
import { GET_CHAIN_BY_ID } from '../../model/chains';

const LaunchedProjectModal: React.FC<{showModal: boolean, handleClose: any, contract: Contract, action: any}> = ({showModal, handleClose, contract, action}) => {
  const [actionInProgress, setActionInProgress] = useState<boolean>()
  const [currentActionSuccess, setCurrentActionSuccess] = useState<boolean>()
  const [value, setValue] = useState<string>()
  const {wallet, connect, setChain, currentChain} = useWallet()
  const projectChain = GET_CHAIN_BY_ID(parseInt(contract?.chainid))

  const closeModal = () => {
    setValue("")
    setCurrentActionSuccess(false)
    setActionInProgress(false)
    handleClose()
  }

  const onWithdraw = async () => {
    await readyToTransact(connect, setChain, projectChain, wallet, currentChain)
    if (contract) {
      setActionInProgress(true)
      try {
        const signedContract = await getContractForTransactions(wallet, contract.contractaddress)
        const tx = await signedContract.withdraw()
        const withdrawResponse = await tx.wait()
        setCurrentActionSuccess(true)
      } catch (error: any) {
        setCurrentActionSuccess(false)
        if (error.message) {
          alert(error.message)
        } else {
          alert("Something went wrong!")
        } 
      } finally {
        setActionInProgress(false)
      }
    }
  }

  const onSetPrice = async(newPrice: string) => {
    readyToTransact(connect, setChain, projectChain, wallet, currentChain)
    setActionInProgress(true)
    if (contract) {
      try {
        const myContract = await getContractForTransactions(wallet, contract.contractaddress)
        console.log(myContract)
        await myContract.changePrice(utils.parseUnits(newPrice,'ether'))
        setCurrentActionSuccess(true)
      } catch (error: any) {
        setCurrentActionSuccess(false)
        if (error.message) {
          alert(error.message)
        } else {
          alert('Something went wrong, please try again!')
        }
      } finally {
        setActionInProgress(false)
      }
    }
  }

  const onSetMaxPerWallet = async(newMaxMintsPerPerson: string) => {
    readyToTransact(connect, setChain, projectChain, wallet, currentChain)
    setActionInProgress(true)
    if (contract) {
      try {
        const myContract = await getContractForTransactions(wallet, contract.contractaddress)
        await myContract.changeMaxMintPerPerson(newMaxMintsPerPerson)
        setCurrentActionSuccess(true)
      } catch (error: any) {
        setCurrentActionSuccess(false)
        if (error.message) {
          alert(error.message)
        } else {
          alert('Something went wrong, please try again!')
        }
      } finally {
        setActionInProgress(false)
      }
    }
  }

  const onSetClaimBlock = async (newClaimBlock: string) => {
    readyToTransact(connect, setChain, projectChain, wallet, currentChain)
    if (contract) {
    try {
      const myContract = await getContractForTransactions(wallet, contract.contractaddress)
      console.log(myContract)
      await myContract.changeClaimsPeriodStart(newClaimBlock)
    } catch (error: any) {
      if (error.message) {
        alert(error.message)
      } else {
        alert('Something went wrong, please try again!')
      }
    }
    }
  }

  const onSetMintBlock = async (newMintBlock: string) => {
    readyToTransact(connect, setChain, projectChain, wallet, currentChain)
    if (contract) {
      try {
        const myContract = await getContractForTransactions(wallet, contract.contractaddress)
        console.log(myContract)
        await myContract.changeMintPeriodStart(newMintBlock)
      } catch (error: any) {
        if (error.message) {
          alert(error.message)
        } else {
          alert('Something went wrong, please try again!')
        }
      }
    }
  }

  const onTransferOwnership = async (newOwnerAddress: string) => {
    readyToTransact(connect, setChain, projectChain, wallet, currentChain)
    if (contract) {
      try {
        const myContract = await getContractForTransactions(wallet, contract.contractaddress)
        console.log(myContract)
        await myContract.transferOwnership(newOwnerAddress)
      } catch (error: any) {
        if (error.message) {
          alert(error.message)
        } else {
          alert('Something went wrong, please try again!')
        }
      }
    }
  }

  const onSubmit = (value: string) => {
    switch(action) {
      case 'SetPrice': return onSetPrice(value)
      case 'SetMaxPerWallet': return onSetMaxPerWallet(value)
      case 'SetClaimBlock': return onSetClaimBlock(value)
      case 'SetMintBlock': return onSetMintBlock(value)
      case 'TransferOwnership': return onTransferOwnership(value)
    }
  }

  const LaunchProjectModalWithdraw = (
    <Modal
      open={showModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <div className="relative w-[400px] top-[20%] mx-auto p-5 text-white text-center rounded-2xl bg-white/10 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none z-100">
    <IconButton
    aria-label="close"
    onClick={closeModal}
    sx={{
      position: 'absolute',
      right: 8,
      top: 8
    }}
    >
    <RiCloseFill color='white' />
  </IconButton>
    <h1 className="text-3xl m-2 font-drukwide text-left">Withdraw Funds</h1>
      <div className="space-y-3 w-full mt-10">
      {(!actionInProgress) && (!currentActionSuccess) && <button className="bg-black px-5 py-2 rounded-md" onClick={onWithdraw}>Withdraw</button>}
      { actionInProgress && (!currentActionSuccess) && <CircularProgress sx={{color: '#B81CD4'}}/>}
      {/* { (!actionInProgress) && (!currentActionSuccess) && <h1>Something went wrong!</h1>} */}
      { (!actionInProgress) && (currentActionSuccess) && <h1>Withdrawal complete! If your modal is stuck, close and try again.</h1>}
      </div>
    </div>
    </Modal>
  )

  const LaunchProjectModalSetPrice = (
    <Modal
      open={showModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <div className="relative w-[400px] top-[20%] mx-auto p-5 text-white text-center rounded-2xl bg-white/10 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none z-100">
    <IconButton
    aria-label="close"
    onClick={closeModal}
    sx={{
      position: 'absolute',
      right: 8,
      top: 8
    }}
    >
    <RiCloseFill color='white' />
  </IconButton>
    <h1 className="text-3xl m-2 font-drukwide text-left">Set Price</h1>
      <div className="space-y-3 w-full mt-10">
      {(!actionInProgress) && (!currentActionSuccess) && (
        <div className="flex flex-col space-y-2 items-center">
          <div className="text-left mb-3">
            <label htmlFor="input-price" className="block py-2 text-white">Price</label>
            <div className="inline-block"><input id="input-price" type="string" className="w-4/5 text-zinc-500 text-2xl p-1 rounded-lg bg-white border-2 border-zinc-300 outline-none mr-4" onChange={(event) => setValue(event.target.value)}/>ETH</div>
          </div>
          <button className="text-center px-4 py-2 bg-black text-white rounded-md" onClick={() => { onSubmit(value!) }}>Confirm</button>
        </div>
      )}
      { actionInProgress && (!currentActionSuccess) && <CircularProgress sx={{color: '#B81CD4'}}/>}
      {/* { (!actionInProgress) && (!currentActionSuccess) && <h1>Something went wrong!</h1>} */}
      { (!actionInProgress) && (currentActionSuccess) && <h1>Setting price complete! If your modal is stuck, close and try again.</h1>}
      </div>
    </div>
    </Modal>
  )

  const LaunchProjectModalSetMaxPerWallet = (
    <Modal
      open={showModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <div className="relative w-[400px] top-[20%] mx-auto p-5 text-white text-center rounded-2xl bg-white/10 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none z-100">
    <IconButton
    aria-label="close"
    onClick={closeModal}
    sx={{
      position: 'absolute',
      right: 8,
      top: 8
    }}
    >
    <RiCloseFill color='white' />
  </IconButton>
    <h1 className="text-3xl m-2 font-drukwide text-left">Set Max Per Wallet</h1>
      <div className="space-y-3 w-full mt-10">
      {(!actionInProgress) && (!currentActionSuccess) && (
        <div className="flex flex-col space-y-2 items-center">
          <div className="text-left mb-3">
            <label htmlFor="input-price" className="block py-2 text-white">Max # Mints Per Wallet</label>
            <input id="input-price" type="string" className="w-4/5 text-zinc-500 text-2xl p-1 rounded-lg bg-white border-2 border-zinc-300 outline-none mr-4" onChange={(event) => setValue(event.target.value)}/>
          </div>
          <button className="text-center px-4 py-2 bg-black text-white rounded-md" onClick={() => { onSubmit(value!) }}>Confirm</button>
        </div>
      )}
      { actionInProgress && (!currentActionSuccess) && <CircularProgress sx={{color: '#B81CD4'}}/>}
      {/* { (!actionInProgress) && (!currentActionSuccess) && <h1>Something went wrong!</h1>} */}
      { (!actionInProgress) && (currentActionSuccess) && <h1>Setting max complete! If your modal is stuck, close and try again.</h1>}
      </div>
    </div>
    </Modal>
  )

  const LaunchProjectModalSetClaimBlock = (
    <Modal
      open={showModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <div className="relative w-[400px] top-[20%] mx-auto p-5 text-white text-center rounded-2xl bg-white/10 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none z-100">
    <IconButton
    aria-label="close"
    onClick={closeModal}
    sx={{
      position: 'absolute',
      right: 8,
      top: 8
    }}
    >
    <RiCloseFill color='white' />
  </IconButton>
    <h1 className="text-3xl m-2 font-drukwide text-left">Set Claim Block</h1>
      <div className="space-y-3 w-full mt-10">
      {(!actionInProgress) && (!currentActionSuccess) && (
        <div className="flex flex-col space-y-2 items-center">
          <div className="text-left mb-3">
            <label htmlFor="input-price" className="block py-2 text-white">Set Claim Block</label>
            <input id="input-price" type="string" className="w-4/5 text-zinc-500 text-2xl p-1 rounded-lg bg-white border-2 border-zinc-300 outline-none mr-4" onChange={(event) => setValue(event.target.value)}/>
          </div>
          <button className="text-center px-4 py-2 bg-black text-white rounded-md" onClick={() => { onSubmit(value!) }}>Confirm</button>
        </div>
      )}
      { actionInProgress && (!currentActionSuccess) && <CircularProgress sx={{color: '#B81CD4'}}/>}
      {/* { (!actionInProgress) && (!currentActionSuccess) && <h1>Something went wrong!</h1>} */}
      { (!actionInProgress) && (currentActionSuccess) && <h1>Setting claim block complete!</h1>}
      </div>
    </div>
    </Modal>
  )

  const LaunchProjectModalSetMintBlock = (
    <Modal
      open={showModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <div className="relative w-[400px] top-[20%] mx-auto p-5 text-white text-center rounded-2xl bg-white/10 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none z-100">
    <IconButton
    aria-label="close"
    onClick={closeModal}
    sx={{
      position: 'absolute',
      right: 8,
      top: 8
    }}
    >
    <RiCloseFill color='white' />
  </IconButton>
    <h1 className="text-3xl m-2 font-drukwide text-left">Set Mint Block</h1>
      <div className="space-y-3 w-full mt-10">
      {(!actionInProgress) && (!currentActionSuccess) && (
        <div className="flex flex-col space-y-2 items-center">
          <div className="text-left mb-3">
            <label htmlFor="input-price" className="block py-2 text-white">Set Mint Block</label>
            <input id="input-price" type="string" className="w-4/5 text-zinc-500 text-2xl p-1 rounded-lg bg-white border-2 border-zinc-300 outline-none mr-4" onChange={(event) => setValue(event.target.value)}/>
          </div>
          <button className="text-center px-4 py-2 bg-black text-white rounded-md" onClick={() => { onSubmit(value!) }}>Confirm</button>
        </div>
      )}
      { actionInProgress && (!currentActionSuccess) && <CircularProgress sx={{color: '#B81CD4'}}/>}
      {/* { (!actionInProgress) && (!currentActionSuccess) && <h1>Something went wrong!</h1>} */}
      { (!actionInProgress) && (currentActionSuccess) && <h1>Setting mint block complete!</h1>}
      </div>
    </div>
    </Modal>
  )

  const LaunchProjectModalTransferOwnership = (
    <Modal
      open={showModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <div className="relative w-[400px] top-[20%] mx-auto p-5 text-white text-center rounded-2xl bg-white/10 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none z-100">
    <IconButton
    aria-label="close"
    onClick={closeModal}
    sx={{
      position: 'absolute',
      right: 8,
      top: 8
    }}
    >
    <RiCloseFill color='white' />
  </IconButton>
    <h1 className="text-3xl m-2 font-drukwide text-left">Transfer Ownership</h1>
      <div className="space-y-3 w-full mt-10">
      {(!actionInProgress) && (!currentActionSuccess) && (
        <div className="flex flex-col space-y-2 items-center">
          <div className="text-left mb-3">
            <label htmlFor="input-price" className="block py-2 text-white">New Owner address:</label>
            <input id="input-price" type="string" className="w-4/5 text-zinc-500 text-2xl p-1 rounded-lg bg-white border-2 border-zinc-300 outline-none mr-4" onChange={(event) => setValue(event.target.value)}/>
          </div>
          <button className="text-center px-4 py-2 bg-black text-white rounded-md" onClick={() => { onSubmit(value!) }}>Confirm</button>
        </div>
      )}
      { actionInProgress && (!currentActionSuccess) && <CircularProgress sx={{color: '#B81CD4'}}/>}
      {/* { (!actionInProgress) && (!currentActionSuccess) && <h1>Something went wrong!</h1>} */}
      { (!actionInProgress) && (currentActionSuccess) && <h1>Transferring ownership complete!</h1>}
      </div>
    </div>
    </Modal>
  )


  switch(action) {
    case 'Withdraw': return LaunchProjectModalWithdraw
    case 'SetPrice': return LaunchProjectModalSetPrice
    case 'SetMaxPerWallet': return LaunchProjectModalSetMaxPerWallet
    case 'SetClaimBlock': return LaunchProjectModalSetClaimBlock
    case 'SetMintBlock': return LaunchProjectModalSetMintBlock
    case 'TransferOwnership': return LaunchProjectModalTransferOwnership
    default: return LaunchProjectModalWithdraw
  }
}
export default LaunchedProjectModal