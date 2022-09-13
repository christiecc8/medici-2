import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ProjectStatus, Project } from '../model/projects';
import CreatedProject from '../components/projects/CreatedProject';
import LaunchedProject from '../components/projects/LaunchedProject';
import { getUploadPreview } from '../utils/upload';

export const ProjectPageRenderer: React.FC<{
  contractName: string
  project: Project
}> = ({ contractName, project }) => {
  console.log("Inside project page renderer for " + project.name)
  switch (project.status) {
    case ProjectStatus.LAUNCHED:
      return <LaunchedProject contractName={contractName} project={project}/>
    case ProjectStatus.CREATED:
      return <CreatedProject contractName={contractName} project={project}/>
    default:
      return <CreatedProject contractName={contractName} project={project}/>
  }
}

const ProjectPage: React.FC<{}> = () => {
  const params = useParams()
  const contractname = params.contractname as string;

  const [project, setProject] = useState<Project>();
  console.log("Trying to render project " + contractname)

  useEffect(() => {
    (async () => {
      if (contractname) {
        const res = await getUploadPreview(contractname);
        console.log(res)
        setProject(res)
      }
    })();
  }, [contractname])

  return (
  <div>
    { project && <ProjectPageRenderer contractName={contractname} project={project}/> }
  </div>
  );
}

export default ProjectPage