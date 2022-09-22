import React, { useEffect, useState, useCallback } from 'react'
import { ProjectStatus, Project } from '../../model/projects'
import { getContractCover } from '../../utils/retrieve'
import CreatedProjectModal from './CreatedProjectModal'
import { RiCloseFill } from 'react-icons/ri'
import useWallet from '../../hooks/useWallet'

enum Tabs {
  ACTION = 'Action',
  DETAILS = 'Details',
}

enum Actions {
  LAUNCH = 'Launch',
  EDIT_COVER = 'Edit Cover',
  UPLOAD_ALLOWLIST = 'Upload Allowlist'
}

const CreatedProject: React.FC<{ contractName: string, project: Project }> = ({contractName, project}) => {
  const [cover, setCover] = useState<string>();
  const [currentTab, setCurrentTab] = useState(Tabs.ACTION);
  const [currentAction, setCurrentAction] = useState<Actions>();
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {setShowModal(!showModal)}
  const { wallet } = useWallet();

  const getCover = useCallback(async () => {
    const res = await getContractCover(contractName)
    setCover(res)
  }, [contractName])

  useEffect(() => {
    if (!cover) getCover()
  }, [cover, setCover])

  useEffect(() => {
    if (showModal) {
      document.getElementById("modal-container")!.style.display = 'block'
    } else {
      document.getElementById("modal-container")!.style.display = 'none'
    }
  }, [showModal, toggleModal])
  
  return (
    <div className="w-full h-screen flex flex-row -mt-16 bg-black">
      <div className="w-4/11 h-full p-10">
        <div className="flex flex-row mt-36 justify-between">
          <h1 className="font-drukwide text-5xl">{contractName}</h1>
          {/* <span className="bg-medici-purple px-4 py-2 rounded-md text-2xl">{project.status}</span> */}
        </div>
        <div className="w-full z-10 mt-10">
        <div>
          <ul className="font-drunkwide text-[#676767] header-title flex gap-8 border-b-[1.5px] border-[#676767] px-2">
            <li
              className={`${
                currentTab === Tabs.ACTION ? 'border-b-4' : ''
              } border-white relative top-[3px] cursor-pointer`}
              onClick={() => setCurrentTab(Tabs.ACTION)}
            >
              <h3 className={`${currentTab === Tabs.ACTION ? `text-white` : `text-[#676767]`} text-3xl font-authentic`}>ACTIONS</h3>
            </li>
            <li
              className={`${
                currentTab === Tabs.DETAILS ? 'border-b-4' : ''
              } border-white relative top-[3px] cursor-pointer`}
              onClick={() => setCurrentTab(Tabs.DETAILS)}
            >
              <h3 className={`${currentTab === Tabs.DETAILS ? `text-white` : `text-[#676767]`} text-3xl font-authentic`}>DETAILS</h3>
            </li>
          </ul>
        </div>
        <div>
          {currentTab === Tabs.ACTION ? (
          <div className="my-10 ml-3 space-y-5">
            <button className="text-left text-4xl text-[#676767] hover:text-white font-authentic"
            onClick={() => { setCurrentAction(Actions.LAUNCH); toggleModal() }}>LAUNCH PROJECT</button>
            <br></br>
            {/* <button className="text-left text-4xl text-[#676767] hover:text-white font-authentic"
            onClick={() => { setCurrentAction(Actions.EDIT_COVER); toggleModal() }}>EDIT COVER</button>
            <br></br>
            <button className="text-left text-4xl text-[#676767] hover:text-white font-authentic"
            onClick={() => { setCurrentAction(Actions.UPLOAD_ALLOWLIST); toggleModal() }}>UPLOAD ALLOWLIST</button> */}
          </div>
          ) : (
            <div className="space-y-5 my-10 ml-3">
              <h1 className="font-authentic text-2xl">Nothing to see here...yet 😉 Launch a project to see this tab!</h1>
            </div>
          )}
        </div>
      </div>
      </div>
      <div className="w-full h-screen object-cover overflow-hidden">
        { cover && <img src={cover} className="w-full h-full object-cover"/> }
      </div>
      <div id="modal-container" className="flex items-center justify-center text-center{">
        <CreatedProjectModal showModal={showModal} handleClose={toggleModal} project={project} wallet={wallet!} name={contractName}/>
      </div>
    </div>
  );
}
export default CreatedProject