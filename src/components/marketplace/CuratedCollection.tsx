import React, { useState, useEffect, useCallback } from 'react';
import '../../css/marketplace.css';
import { getContract } from '../../utils/web3';
import { getThumbnails, getPreviews } from '../../utils/reservations';
import ThumbnailCard from './ThumbnailCard';
import PreviewCard from './PreviewCard';
import { utils } from 'ethers';
import { GET_CHAIN_BY_ID } from '../../model/chains';
import { Chain } from '../../model/types';

const CuratedCollection: React.FC<{ collection: any }> = ({ collection }) => {
  const [price, setPrice] = useState<any>();
  const [numMinted, setNumMinted] = useState<number>();
  const [maxSupply, setMaxSupply] = useState<number>();
  const [projectChain, setProjectChain] = useState<Chain>();
  const [thumbnails, setThumbnails] = useState<string[]>();
  const [previews, setPreviews] = useState<string[]>();

  const getCollectionThumbnails = useCallback(async () => {
    try {
      if (collection) {
        const res = await getThumbnails(collection.name);
        if (res === '') {
          const musicres = await getPreviews(collection.name);
          setPreviews(musicres.data);
        }
        setThumbnails(res);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }, [collection]);

  const getContractDetails = useCallback(async () => {
    if (collection && projectChain) {
      const currContract = await getContract(collection.contract, projectChain);
      const price = await currContract.price();
      setPrice(utils.formatEther(price._hex));
      const numMinted = await currContract.totalSupply();
      setNumMinted(numMinted.toString());
      const maxSupply = await currContract.maxSupply();
      setMaxSupply(maxSupply.toString());
    }
  }, [collection, projectChain]);

  useEffect(() => {
    if (collection && !price && !numMinted && !maxSupply) {
      getContractDetails();
    }
    if (collection && !projectChain) {
      setProjectChain(GET_CHAIN_BY_ID(parseInt(collection.chainid)));
    }
    if (collection && !(thumbnails || previews)) {
      getCollectionThumbnails();
    }
  }, [
    collection,
    getContractDetails,
    price,
    setPrice,
    numMinted,
    setNumMinted,
    maxSupply,
    setMaxSupply,
    thumbnails,
    getCollectionThumbnails,
    setThumbnails,
    projectChain,
  ]);

  return (
    <div className="w-full border-black border-y-2 backdrop-blur-lg md:h-[375px] flex flex-col p-3">
      <div className="items-start">
        <h1 className="font-nbarchitekt text-[#1E1E1E]">
          {numMinted}/{maxSupply}
        </h1>
      </div>
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex flex-col-reverse h-full mb-4 md:mb-0">
          {collection && (
            <h1 className="font-drukwide text-3xl md:text-5xl text-[#1E1E1E]">
              {collection.name}
            </h1>
          )}
          <div className="space-x-5 my-3">
            <span className="bg-[#1E1E1E] text-white font-authentic rounded-lg px-3 py-2">
              {collection.artist ? `@${collection.artist}` : 'anon'}
            </span>
            <span className="bg-[#1E1E1E] text-white font-authentic rounded-lg px-3 py-2">
              {collection.symbol}
            </span>
          </div>
        </div>
        <div className="w-full md:w-1/2 grid md:grid-cols-3 flex-2 gap-2">
          {thumbnails &&
            Object.keys(thumbnails).slice(0, 3).map((thumbnail: any, i) => (
              <a
              href={`/page/${collection.name}`}
              target="_blank"
              rel="noopener noreferrer"
              key={`${collection.name}-${i}`}
              >
                <ThumbnailCard
                  name={collection.name}
                  image={thumbnails[i]}
                  index={i}
                  key={`${collection.name}-${i}`}
                />
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};
export default CuratedCollection;
