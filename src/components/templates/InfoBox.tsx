import React, { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { Contract } from '../../model/types'
import useWallet from '../../hooks/useWallet'
import { getContract, getContractForTransactions, verifyMerkleProof } from '../../utils/web3'
import { getContractClaimStatus } from '../../utils/retrieve'
import { GET_CHAIN_BY_ID } from '../../model/chains'


const InfoBox: React.FC<{ contract: Contract }> = ({ contract }) => {
    const { wallet, setChain, connect } = useWallet()
    const connectedWallet = wallet?.accounts[0]
    const [contractStatus, setContractStatus] = useState<string>()
    const [blockDifference, setBlockDifference] = useState<number>()
    const [price, setPrice] = useState<string>()
    const [minting, setMinting] = React.useState<boolean>(false)
    const [txHash, setTxHash] = React.useState<string>();
    const [claiming, setClaiming] = React.useState<boolean>(false)
    const [claimTxHash, setClaimTxHash] = React.useState<string>()
    const [isVerified, setIsVerified] = React.useState<boolean>()
    const [verifiedProof, setVerifiedProof] = React.useState<string>()

    const projectChain = GET_CHAIN_BY_ID(parseInt(contract.chainid));

    const isAllowlistMember = React.useCallback(async () => {
      if (connectedWallet && contract) {
        try {
          const { success, merkleProof } = await verifyMerkleProof(contract.name, connectedWallet.address)
          setIsVerified(success);
          setVerifiedProof(merkleProof);
        } catch {
          setIsVerified(false)
        }
      }
    }, [connectedWallet, contract])  

    const getContractStatus = React.useCallback(async () => {
      if (contract && projectChain) {
        try {
          const { success, status } = await getContractClaimStatus(contract.name, projectChain.id.toString())
          if (success) {
            setContractStatus(status);
          }
        } catch {
          alert('Could not get contract status');
        }
      }
    }, [contract, projectChain])
  
    const getBlocksRemaining = useCallback(async () => {
      if (wallet) {
        const walletProvider = new ethers.providers.Web3Provider(wallet.provider)
        const latestBlock = await walletProvider.getBlockNumber()
        // console.log("orig block: " + countdownBlock + " -  curr block: " + latestBlock + " = " + (countdownBlock - latestBlock))
        setBlockDifference(contract.mintstart - latestBlock);
      }
    }, [contract, wallet])

    const getPrice = useCallback(async () => {
      const currContract = await getContract(contract.contractaddress, projectChain)
      const price = await currContract.price()
      setPrice(price._hex);
    }, [contract, projectChain])

    const claimOnContract = async () => {
      if (wallet && connectedWallet && isVerified && verifiedProof !== null && projectChain) {
        setClaiming(true);
        try {
          await setChain({chainId: projectChain.hexId})
          const contractInstance = await getContractForTransactions(wallet, contract.contractaddress)
          const tx = await contractInstance.claim(connectedWallet?.address, 1, verifiedProof, {
            value: price,
            gasLimit: 9000000,
          })
          const claimResponse = await tx.wait()
          setClaimTxHash(claimResponse.transactionHash)
        } catch (error: any) {
          if (error.message) {
            alert(error.message);
          } else {
            alert('Something went wrong, please try again!');
          }
        } finally {
          setClaiming(false);
        }
      }
    };

    const mint = async () => {
      if (wallet && connectedWallet && projectChain) {
        setMinting(true);
        try {
          await setChain({chainId: projectChain.hexId})
          const contractInstance = await getContractForTransactions(wallet, contract.contractaddress)
          const tx = await contractInstance.mint(connectedWallet?.address, 1, {
            value: price,
            gasLimit: 9000000,
          });
          const mintResponse = await tx.wait();
          setTxHash(mintResponse.transactionHash);
        } catch (error: any) {
          if (error.message) {
            alert(error.message);
          } else {
            alert('Something went wrong, please try again!');
          }
        } finally {
          setMinting(false);
        }
      }
    };

    useEffect(() => {
      setInterval(() => {
        getBlocksRemaining()
      }, 2000)
      if (!price) getPrice()
      if (!contractStatus) getContractStatus()
      if (isVerified === null) isAllowlistMember()
    },
    [price, getPrice,
    blockDifference, setBlockDifference, getBlocksRemaining,
    contractStatus, getContractStatus,
    isVerified, isAllowlistMember
    ])

    return (
      <div className="space-y-5 w-fit">
        <div className="w-[400px] flex flex-col rounded-md border-[1.5px] border-[#EAEAEA] px-3 py-3">
          <div className="flex flex-row gap-2">
            <div className="block w-1/2 p-2 border-r-[1.5px] border-[#EAEAEA]">
              <h1 className="text-xl font-bold">Price</h1>
              {price && ethers.utils.formatEther(price)} ETH
            </div>
            <div className="block w-1/2 p-2">
              <h1 className="text-xl font-bold">Blocks until mint</h1>
              { (contractStatus === "none" || contractStatus === "claim") ? blockDifference : "Mint currently active"}
            </div>
          </div>
          <div className="mt-3">
          {contractStatus === 'none' && 
          (
          <button className="bg-black text-white w-full rounded-md py-2 disabled:bg-gray-500">
            Mint not active
          </button>
          )
        }
        {contractStatus === 'claim' &&
          (isVerified ? (
            claimTxHash ? (
              <a
                className="w-full rounded-md py-2 bg-emerald-800 text-white"
                href={`${projectChain?.etherscanUrl}/tx/${claimTxHash}`}
                target="_blank"
                rel="noreferrer"
              >
                Success: Check transaction
              </a>
            ) : (
              <button
              className="bg-black text-white w-full rounded-md py-2 disabled:bg-gray-500 drop-shadow-lg"
                onClick={
                  connectedWallet ? () => claimOnContract() : () => 
                  connect({
                    autoSelect: { 
                      label: 'Wallet Connect',
                      disableModals: false
                    }
                  })
                }
                disabled={claiming}
              >
                {' '}
                {connectedWallet
                  ? claiming
                    ? 'Claiming...'
                    : 'Claim Now'
                  : 'Connect Wallet'}
              </button>
            )
          ) : (
            <button className="bg-black text-white w-full rounded-md py-2 disabled:bg-gray-500">
              Mint not active
            </button>
          ))}
        {contractStatus === 'mint' &&
          (txHash ? (
            <a
              className="w-full rounded-md py-2 bg-emerald-800 text-white"
              href={`${projectChain?.etherscanUrl}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              Success: Check transaction
            </a>
          ) : (
            <button
              className="bg-black text-white w-full rounded-md py-2 disabled:bg-gray-500"
              onClick={
                connectedWallet ? () => mint() : () => 
                connect({
                  autoSelect: { 
                    label: 'Wallet Connect',
                    disableModals: false
                  }
                })
              }
              disabled={minting}
            >
              {' '}
              {connectedWallet
                ? minting
                  ? 'Minting...'
                  : 'Mint Now'
                : 'Connect Wallet'}
            </button>
        ))}
          </div>
        </div>
        <a 
        target="_blank"
        rel="noreferrer"
        href="/"
        >
          <div className="text-right text-sm text-black flex justify-center">
          powered by{' '}
          <img src="/logo-medici-black.svg" alt="Medici logo" width={20} className="mx-1" />
          Medici
          </div>
        </a>
     </div>
  );
}
export default InfoBox