import React, { useState, useEffect, useCallback } from 'react';
import '../../css/marketplace.css';
import { getContract } from '../../utils/web3';
import { utils } from 'ethers';
import { GET_CHAIN_BY_ID } from '../../model/chains';
import { Chain } from '../../model/types';

import stars from '../../assets/marketplace-stars.svg';
import stars2 from '../../assets/marketplace-stars-bottom.svg';

const Hero: React.FC<{ hero: any }> = ({ hero }) => {
  const [price, setPrice] = useState<any>();
  const [numMinted, setNumMinted] = useState<number>();
  const [maxSupply, setMaxSupply] = useState<number>();
  const [projectChain, setProjectChain] = useState<Chain>();

  const getContractDetails = useCallback(async () => {
    if (hero && projectChain) {
      const currContract = await getContract(hero.contract, projectChain);
      const price = await currContract.price();
      setPrice(utils.formatEther(price._hex));
      const numMinted = await currContract.totalSupply();
      setNumMinted(numMinted.toString());
      const maxSupply = await currContract.maxSupply();
      setMaxSupply(maxSupply.toString());
    }
  }, [hero, projectChain]);

  useEffect(() => {
    if (hero && !price && !numMinted && !maxSupply) {
      getContractDetails();
    }
    if (hero && !projectChain) {
      setProjectChain(GET_CHAIN_BY_ID(parseInt(hero.chainid)));
    }
  }, [
    hero,
    getContractDetails,
    price,
    setPrice,
    numMinted,
    setNumMinted,
    maxSupply,
    setMaxSupply,
    projectChain,
  ]);

  return (
    <div className="z-10 mt-20 mb-10 w-full items-center relative">
      <img
        src={stars}
        className="w-20 bg-transparent absolute -left-2 md:left-20 -top-4"
        alt=""
      />
      <img
        src={stars2}
        className="w-20 bg-transparent absolute -right-2 md:right-20 -bottom-10"
        alt=""
      />
      {hero && (
        <div className="flex flex-col md:flex-row gap-24 justify-center items-center p-10">
          <div className="hero-image w-full md:w-1/3">
            <img
              src={hero.cover_cdn_url}
              className="w-full aspect-square rounded-2xl object-cover"
              alt={hero.name}
            />
          </div>
          <div className="flex flex-col space-y-5 w-full md:w-1/3">
            <h1 className="font-drukwide header-title text-3xl">{hero.name}</h1>
            <div className="flex flex-row">
              <div className="py-0 pr-5 border-r-[1.5px] border-[#87878786] border-spacing-3 text-[#1E1E1E]">
                <h2>Created by</h2>
                <div className="bg-[#1E1E1E] text-white font-authentic rounded-full min-w-[100px] h-8 flex items-center justify-center mt-6">
                  {hero.artist ? `@${hero.artist}` : 'anon'}
                </div>
              </div>
              <div className="py-0 pl-5 text-[#1E1E1E]">
                <h2>Size</h2>
                <div className="bg-[#1E1E1E] text-white font-authentic rounded-full min-w-[80px] h-8 flex items-center justify-center mt-6">
                  {numMinted}/{maxSupply}
                </div>
              </div>
            </div>
            <div className="block">
              <h2 className="text-[#1E1E1E]">Price</h2>
              <h2 className="text-[#1E1E1E] text-4xl font-nbarchitekt">
                {price}
              </h2>
            </div>
            <a
              className="bg-[#1E1E1E] font-authentic text-white px-4 py-2 rounded-md w-full text-center"
              href={`/page/${hero.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View NFT
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
