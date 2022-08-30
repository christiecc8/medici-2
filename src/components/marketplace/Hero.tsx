import React, { useState, useEffect, useCallback } from 'react'
import '../../css/marketplace.css';
import { getCuratedCollection } from '../../utils/retrieve';
import { getContract } from '../../utils/web3'
import { utils } from 'ethers'
import { GET_CHAIN_BY_ID } from '../../model/chains';
import { Chain } from '../../model/types';

const Hero: React.FC<{}> = () => {
  const [heroCollection,setHeroCollection] = useState<any>();
  const [curatedCollections, setCuratedCollections] = useState<any>()
  const [price, setPrice] = useState<any>()
  const [numMinted, setNumMinted] = useState<number>()
  const [maxSupply, setMaxSupply] = useState<number>()
  const [projectChain, setProjectChain] = useState<Chain>()

  useEffect(() => {
    ( async () => {
      if (!curatedCollections) {
      const res = await getCuratedCollection();
      console.log(res)
      setHeroCollection(res[2])
      setCuratedCollections(res)
      }
    })();
  }, [curatedCollections, setCuratedCollections])

  const getContractDetails = useCallback(async () => {
    if (heroCollection && projectChain) {
      const currContract = await getContract(heroCollection.contract, projectChain)
      const price = await currContract.price()
      setPrice(utils.formatEther(price._hex));
      const numMinted = await currContract.totalSupply()
      setNumMinted(numMinted.toString())
      const maxSupply = await currContract.maxSupply()
      setMaxSupply(maxSupply.toString())
    }
  }, [heroCollection, projectChain])

  useEffect(() => {
    if (heroCollection && !price && !numMinted && !maxSupply) {
      getContractDetails()
    }
    if (heroCollection && !projectChain) {
      setProjectChain(GET_CHAIN_BY_ID(parseInt(heroCollection.chainid)))
    }
  }, [
    heroCollection,
    getContractDetails,
    price,
    setPrice,
    numMinted,
    setNumMinted,
    maxSupply,
    setMaxSupply,
    projectChain
  ])

  return (
    <div className="z-10 mb-20 mt-20">
    { heroCollection && 
    <div className="flex flex-col md:flex-row gap-10 md:gap-20 justify-between w-full">
      <div className="hero-image">
        <img src={heroCollection.cover_cdn_url} className="w-full aspect-square rounded-2xl object-cover"/>
      </div>
      <div className="flex flex-col md:mt-10 space-y-5">
        <h1 className="font-drukwide header-title text-3xl">{heroCollection.name}</h1>
        <div className="flex flex-row">
          <div className="py-0 pr-5 border-r-[1.5px] border-[#87878786] border-spacing-3 h-max text-[#1E1E1E]">
            <h2>Created by</h2>
            <br></br>
            <span className="bg-[#1E1E1E] text-white font-authentic rounded-lg px-3 py-2">{heroCollection.artist ? `@${heroCollection.artist}` : "anon"}</span>
          </div>
          <div className="w-fit py-0 pl-5 text-[#1E1E1E]">
            <h2>Size</h2>
            <br></br>
            <span className="bg-[#1E1E1E] text-white font-authentic rounded-lg px-3 py-2">{numMinted}/{maxSupply}</span>
          </div>
        </div>
          <div className="block">
            <h2 className="text-[#1E1E1E]">Price</h2>
            <h2 className="text-[#1E1E1E] text-4xl font-nbarchitekt">{price}</h2>
          </div>
        <a className="bg-[#1E1E1E] font-authentic text-white px-4 py-2 rounded-md w-full text-center" href={`/page/${heroCollection.name}`} target="_blank" rel="noopener noreferrer">View NFT</a>
      </div>
    </div>
    }
    </div>
  )
}

export default Hero