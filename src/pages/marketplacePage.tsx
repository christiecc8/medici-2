import React, { useState, useEffect } from 'react';
import Header from '../components/marketplace/Header';
import Background from '../components/marketplace/Background';
import Hero from '../components/marketplace/Hero';
import CuratedCollection from '../components/marketplace/CuratedCollection';
import ImageCollections from '../components/marketplace/ImageCollections';
import MusicCollections from '../components/marketplace/MusicCollections';
import { getCuratedCollection } from '../utils/retrieve';

enum Tabs {
  Art = 'art',
  Music = 'music',
}

const Marketplace: React.FC<{}> = () => {
  const [heroCollection, setHeroCollection] = useState<any>();
  const [curatedCollections, setCuratedCollections] = useState<any>();
  const [currentTab, setCurrentTab] = useState(Tabs.Art);

  useEffect(() => {
    (async () => {
      if (!curatedCollections) {
        const res = await getCuratedCollection();
        setHeroCollection(res[0]);
        setCuratedCollections(res);
      }
    })();
  }, [curatedCollections, setCuratedCollections]);

  return (
    <div className="w-full flex flex-col items-center">
      <Background />
      <Header />
      <div className="w-4/5 z-20 mt-10 space-y-5">
        <h1 className="text-black text-2xl">Welcome to the Medici Gallery. This is where you can explore the art and music NFTs that has been launched with our Creator tool.</h1>
      </div>
      <Hero hero={heroCollection} />
      <h1 className="font-drukwide header-title text-3xl text-left">
        Curated Collections
      </h1>
      {curatedCollections &&
        curatedCollections.map((collection: any) => (
          <CuratedCollection collection={collection} key={collection.name}/>
        ))}

      <div className="w-full z-10 mt-10">
        <div>
          <ul className="font-drunkwide text-black header-title flex gap-8 border-b-2 border-black px-2">
            <li
              className={`${
                currentTab === Tabs.Art ? 'border-b-4' : ''
              } border-black relative top-[3px] cursor-pointer`}
              onClick={() => setCurrentTab(Tabs.Art)}
            >
              <h3 className="text-3xl font-bold">Art</h3>
            </li>
            <li
              className={`${
                currentTab === Tabs.Music ? 'border-b-4' : ''
              } border-black relative top-[3px] cursor-pointer`}
              onClick={() => setCurrentTab(Tabs.Music)}
            >
              <h3 className="text-3xl font-bold">Music</h3>
            </li>
          </ul>
        </div>
        <div>
          {currentTab === Tabs.Art ? (
            <ImageCollections />
          ) : (
            <MusicCollections />
          )}
        </div>
      </div>
    </div>
  );
};
export default Marketplace;
