import React, { useState, useEffect } from 'react';
import Header from '../components/marketplace/Header';
import Background from '../components/marketplace/Background';
import Hero from '../components/marketplace/Hero';
import CuratedCollection from '../components/marketplace/CuratedCollection';
import ImageCollections from '../components/marketplace/ImageCollections';
import MusicCollections from '../components/marketplace/MusicCollections';
import { getCuratedCollection } from '../utils/retrieve';

const Marketplace: React.FC<{}> = () => {
  const [heroCollection, setHeroCollection] = useState<any>();
  const [curatedCollections, setCuratedCollections] = useState<any>();

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
      <Hero hero={heroCollection} />
      <h1 className="font-drukwide header-title text-3xl text-left">
        Curated Collections
      </h1>
      {curatedCollections &&
        curatedCollections.map((collection: any) => (
          <CuratedCollection collection={collection} />
        ))}
      <ImageCollections />
      <MusicCollections />
    </div>
  );
};
export default Marketplace;
