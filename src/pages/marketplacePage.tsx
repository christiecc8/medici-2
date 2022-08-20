import React from 'react'
import Background from '../components/marketplace/Background'
import Header from '../components/marketplace/Header'
import ImageCollections from '../components/marketplace/ImageCollections';

const Marketplace: React.FC<{}> = () => {
  return (
    <div className="w-full flex flex-col p-5 items-center">
      <Background/>
      <Header/>
      <ImageCollections/>
    </div>
  );
}
export default Marketplace;