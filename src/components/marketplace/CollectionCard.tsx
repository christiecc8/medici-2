import React from 'react'
import '../../css/marketplace.css'
import { Link } from 'react-router-dom'

const CollectionCard: React.FC<{name: string, artist: string, image: string}> = ({name, artist, image}) => {
  return (
    <div>
       <Link
          to={`/page/${name}`}>
            <div className="justify-center drop-shadow-lg rounded-2xl bg-[#2e2c38] aspect-video items-center flex flex-col m-2 overflow-hidden">   
                <div className="group relative">
                    <div className="w-full aspect-video rounded-2xl object-cover overflow-hidden">
                      <img src={image} alt={name} className="w-full aspect-video rounded-2xl object-cover"/>
                    </div>
                    <div className="absolute h-full left-0 top-0 rounded-2xl right-0 p-5 group-hover:bg-medici-purple/60 bg-transparent transition-all ease-in">
                        <h1 className="text-4xl font-bold text-center mt-[20%] text-white opacity-100">{name}({artist})</h1>
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default CollectionCard