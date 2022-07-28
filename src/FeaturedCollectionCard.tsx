import React from 'react'
import { Link } from 'react-router-dom'

const FeaturedCollectionCard: React.FC<{ imageURL: string, index: number, contractName: string, colorhex: string, secondarycolorhex: string }> = ({
  imageURL,
  index,
  contractName,
  colorhex,
  secondarycolorhex
}) => {
  return (
    <div className="rounded-2xl mx-2 my-4 order-1 md:order-2 drop-shadow-md"
        style={{
          background: `${colorhex}`,
          color: (colorhex === "#1b1a1f" && secondarycolorhex === "#1b1a1f") ? "#FFFFFF" : `${secondarycolorhex}`
    }}>
     { imageURL ? (
      <img src={imageURL} className="rounded-t-2xl overflow-hidden object-cover object-center w-full w-full h-[450px]"/>
    ) : (
    <img
      src={'https://placeholder.pics/svg/120x150'}
      alt={contractName}
      className="rounded-t-2xl overflow-hidden object-cover object-center w-full w-full h-[450px]"
    />
    )
    }

    <div className="flex flex-col justify-between items-start px-4 py-6">
      <span className="flex items-center font-semibold">
        {/* {name} {verified && <MdVerified className="ml-2" />} */}
        {contractName} #{index}
      </span>{' '}
    </div>
    </div>
  )
}

export default FeaturedCollectionCard