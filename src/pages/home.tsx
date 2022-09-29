import React, { useState, useEffect, useCallback } from 'react'
import HomeMenu from '../components/home/HomeMenu'
import AlphaBanner from '../components/home/AlphaBanner'
import { Modal } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { RiCloseFill } from 'react-icons/ri'
import { useLocalStorage } from '../hooks/useLocalStorage'


const Home: React.FC<{}> = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {setShowModal(!showModal)}
  const [visited, setVisited] = useLocalStorage("visited", false);

  const navigateAway = useCallback(() => {
    setVisited(false)
  }, [setVisited])
  
  useEffect(() => {
    // if user navigates away to a completely different site
    // or refreshes the page etc
    window.addEventListener("beforeunload", navigateAway);
  
    // if user navigates to another page on the same site
    return () => {
      navigateAway();
      window.removeEventListener("beforeunload", navigateAway);
    };
  }, [navigateAway]);
  

useEffect(() => {
  if (visited === false) {
    toggleModal()
  }
}, [visited])

useEffect(() => {
  if (showModal) {
    document.getElementById("modal-container")!.style.display = 'block'
  } else {
    document.getElementById("modal-container")!.style.display = 'none'
  }
}, [showModal, toggleModal])

  return (
    <div className="pb-20">
      <div className="w-full flex flex-col p-5 items-center">
      <AlphaBanner/>
        <div className="whitespace-nowrap">
          <h1 className="text-center text-[34px] md:text-6xl font-semibold">
          ✨ <span className="tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-violet-500 to-fuchsia-500">Launch Your Project</span> ✨
          </h1>
        </div>
        <br></br>
        <span className="md:w-3/5 text-center font-extralight md:text-2xl text-zinc-300">
        Create customizable NFT smart contracts and claim pages! 
        </span>
      <br></br>
      </div> 
      <HomeMenu/>
      <div id="modal-container" className="flex items-center justify-center text-center h-screen">
      {/* <Modal
            open={showModal}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
          <div className="relative top-[20%] mx-auto p-5 w-4/5 text-white text-center rounded-2xl bg-zinc-400/5 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none">
          <IconButton
          aria-label="close"
          onClick={toggleModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          >
          <RiCloseFill color='white' />
        </IconButton>
          <h1 className="text-3xl m-2">Alert</h1>
            <div className="space-y-3 w-full p-5 items-center">
              <p> Launch by Medici is currently going through some exciting upgrades! As a result, our service is not available at this time. Check back in later, and join our Discord to talk to us directly or follow us on Twitter for live updates. Thank you for using our tool 💜</p>
              <ul className="flex align-center w-full mt-10">
              <li>
              <a href="https://twitter.com/medici_xyz"
              target="_blank"
              rel="noreferrer">
                
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Twitter</title>
                  <path
                    d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z"
                    fill="#FFFFFF"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a href="https://discord.gg/3bcQWRjZwP"
              target="_blank"
              rel="noreferrer">
                <svg
                  width="48"
                  height="32"
                  viewBox="0 -28.5 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Discord</title>
                  <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#FFFFFF" fill-rule="nonzero"></path>
                </svg>
              </a>
            </li>
          </ul>
            </div>
            {/* <img src={`${process.env.PUBLIC_URL}/medici_demo_1.gif`} className="w-1/2"/> */}
          {/* </div>
          </Modal> */}
          <Modal
            open={showModal}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
          <div className="relative top-[20%] mx-auto p-5 w-4/5 text-white text-center rounded-2xl bg-zinc-400/5 backdrop-blur-lg border-white border-[1px] space-y-3 hero-collection flex flex-col items-center justify-center outline-none">
          <IconButton
          aria-label="close"
          onClick={toggleModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          >
          <RiCloseFill color='white' />
        </IconButton>
          <h1 className="text-3xl m-2">🚀 What's New 🚀</h1>
            <div className="space-y-3 w-4/5 mt-5">
              <p> 💫 launch music NFTs and Mint Pages </p>
              <p> 💫 manage project details and preview tokens </p>
              <p> 💫 customize mint style and experience </p>
            </div>
            <img src={`${process.env.PUBLIC_URL}/medici_demo_1.gif`} className="w-1/2"/>
          </div>
          </Modal>
      </div>
      </div>
  )
}

export default Home
