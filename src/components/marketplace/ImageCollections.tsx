import React, { useState, useEffect } from 'react';
import { getAllImageCollections } from '../../utils/retrieve';
import '../../css/marketplace.css';
import CollectionCard from './CollectionCard';

interface ImageCollection {
  artist: string;
  name: string;
  cover_cdn_thumbnail_url: string;
  cover_cdn_url: string;
  description: string;
  resource_type: string;
}

const ImageCollections: React.FC<{}> = () => {
  const [imageCollections, setImageCollections] = useState<ImageCollection[]>();

  useEffect(() => {
    (async () => {
      if (!imageCollections) {
        const res = await getAllImageCollections();
        setImageCollections(res);
      }
    })();
  }, [imageCollections, setImageCollections]);

  return (
    <div className="grid md:grid-cols-3 z-20">
      {imageCollections &&
        imageCollections.map((col: ImageCollection, i) => (
          <CollectionCard
            artist={col.artist}
            name={col.name}
            image={col.cover_cdn_thumbnail_url}
          />
        ))}
    </div>
  );
};
export default ImageCollections;
