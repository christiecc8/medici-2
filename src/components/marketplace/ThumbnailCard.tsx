import React from 'react'
import '../../css/marketplace.css'
import { Link } from 'react-router-dom'

const ThumbnailCard: React.FC<{name: string, image: string, index: number}> = ({name, image, index}) => {
  return (
    <div className="bg-[#1E1E1E] w-[257px] h-[314px] p-2 rounded-lg">  
      <div className="w-full h-[244px] overflow-hidden rounded-lg bg-red-300 object-cover">
        <img src={image} alt={`${name}-${index}}`} className="w-full h-full"/>
      </div>
      <h1 className="font-nbarchitekt mt-2">MINT</h1>
    </div>
  )
}

export default ThumbnailCard