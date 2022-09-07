import React from 'react'
import '../../css/marketplace.css'
import { Link } from 'react-router-dom'

const CollectionCard: React.FC<{name: string, artist: string, image: string}> = ({name, artist, image}) => {
  return (
    <div className="m-2">
       <Link
          to={`/page/${name}`}>
            <div className="thumbnail-card">
              <img src={image} alt={name} className="w-full aspect-video object-cover overflow-hidden"/>
            </div>
            <h1 className="font-drukwide text-[#1E1E1E] mt-2">{name}</h1>
        </Link>
    </div>
  )
}

export default CollectionCard