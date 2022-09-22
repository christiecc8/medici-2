import React, { useState, useEffect, useCallback } from 'react'
import useWallet from '../hooks/useWallet'
import { getAllProjectsByAddress } from '../utils/retrieve'
import { ProjectStatus, Project } from '../model/projects'
import ProjectCard from '../components/projects/ProjectCard'
import { Link } from 'react-router-dom'

const ProjectManager: React.FC<{}> = () => {
const { wallet, currentChain } = useWallet()
const connectedWallet = wallet?.accounts[0].address;

const [processingProjects, setProcessingProjects] = useState<Project[]>()
const [createdProjects, setCreatedProjects] = useState<Project[]>()
const [launchedProjects, setLaunchedProjects] = useState<Project[]>()
  
const getContracts = useCallback(async () => {
  if (connectedWallet) {
    const processingProjects: Project[] = []
    const createdProjects: Project[] = []
    const launchedProjects: Project[] = []
    
    const allProjects = await getAllProjectsByAddress(connectedWallet)
    allProjects.map((project: Project) => {
      const status = project.status;
      if (status === ProjectStatus.PROCESSING) { 
        processingProjects.push(project)
      } else if (status === ProjectStatus.CREATED) {
        createdProjects.push(project)
      } else {
        launchedProjects.push(project)
      }
    })
    setProcessingProjects(processingProjects)
    setCreatedProjects(createdProjects)
    setLaunchedProjects(launchedProjects)
  }
}, [connectedWallet])

useEffect(() => {
  getContracts()
}, [connectedWallet, currentChain, getContracts])

  return (
    <div className="w-full p-10 md:mt-10 flex flex-col">
      <div className="space-y-5 mb-10">
        <h1 className="text-4xl font-drukwide">Projects</h1>
        <h2 className="text-gray-400">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</h2>
      </div>
      <div className="space-y-5 mb-10">
        <h1 className="text-3xl font-drukwide">Launched Projects</h1>
        <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {launchedProjects && launchedProjects.map((project: Project, i) => (
          <ProjectCard project={project}/>))}
        </div>
      </div>
      <div className="space-y-5 mb-10">
        <h1 className="text-3xl font-drukwide">Created Projects</h1>
        <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 gap-3 min-h-max">
          {createdProjects && createdProjects.map((project: Project, i) => (
          <ProjectCard project={project}/>))}
          {processingProjects && processingProjects.map((project: Project, i) => (
          <ProjectCard project={project}/>))}
          <Link
          to="/create"
          className="w-full h-[88%] inline-block aspect-video rounded-xl border-2 border-dashed border-white">   
          <h1 className="font-nbarchitekt mt-[20%] text-center align-middle">Create A Project</h1>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProjectManager