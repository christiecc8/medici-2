import React from 'react'
import '../../css/marketplace.css'
import { Link } from 'react-router-dom'

const PreviewCard: React.FC<{name: string, image: string, index: number}> = ({name, image, index}) => {
  console.log(image)
  return (
    <div>
       <Link
          to={`/page/${name}`}>
            <div className="justify-center drop-shadow-lg rounded-2xl bg-[#2e2c38] aspect-video items-center flex flex-col m-2 overflow-hidden">   
                <div className="group relative">
                    <div className="w-full aspect-video rounded-2xl object-cover overflow-hidden">
                      {/* <img src={image} alt={name} className="w-full aspect-video rounded-2xl object-cover"/> */}
                      <div className="relative flex w-full h-[250px] lg:h-[450px]">
            <div
              className="bg-black/95 min-w-[250px] w-[250px] lg:w-[450px] h-full animate-spin-slow overflow-hidden rounded-full relative flex items-center justify-center"
            >
              <img
                src={image}
                className="object-cover z-10 h-full w-full"
                alt={name}
              />
              <div className="text-3xl text-white z-10 absolute top-8 break-all w-1/2 text-center">
                {/* {name} */}
              </div>
              <div className="text-xl text-white z-10 absolute bottom-8 break-all w-1/2 text-center">
                {/* {claim.artist} */}
              </div>
              <div className="h-[100px] w-[100px] rounded-full z-10 bg-black absolute " />
              <div className="h-[30px] w-[30px] rounded-full z-10 bg-gray-500 absolute " />
            </div>
            <img
              src="https://vinylblade.com/_nuxt/img/arm.f195722.png"
              className={`h-[250px] lg:h-[450px] transition-transform ease-in-out duration-500`}
              style={{
                transformOrigin: '50% 25% 0',
              }}
              alt=""
            />
          </div>
                    </div>
                    <div className="absolute h-full left-0 top-0 rounded-2xl right-0 p-5 group-hover:bg-medici-purple/60 bg-transparent transition-all ease-in">
                        <h1 className="text-4xl font-bold text-center mt-[20%] text-white opacity-100">{name}(#{index})</h1>
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default PreviewCard