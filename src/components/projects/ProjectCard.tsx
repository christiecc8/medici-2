import React, { useEffect, useState } from 'react'
import { ProjectStatus, Project } from '../../model/projects'
import { Link } from 'react-router-dom'

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
  (project.status === ProjectStatus.PROCESSING) ? (
    <div>   
      <div className="w-full aspect-video rounded-xl object-cover overflow-hidden backdrop-grayscale">
        <img src={project.cover_cdn_thumbnail_url} alt={project.name} className="w-full aspect-video rounded-2xl object-cover"/>
      </div>
      <h1 className="font-nbarchitekt mt-2">{project.name}</h1>
     </div>
  )
  : (
  <Link
    to={`/project/${project.name}`}>
    <div>   
      <div className="w-full aspect-video rounded-xl object-cover overflow-hidden">
        <img src={project.cover_cdn_thumbnail_url} alt={project.name} className="w-full aspect-video rounded-2xl object-cover"/>
      </div>
      <h1 className="font-nbarchitekt mt-2">{project.name}</h1>
    </div>
  </Link>
  ))
}
export default ProjectCard