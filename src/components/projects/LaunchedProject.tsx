import React, { useEffect, useState } from 'react'
import { ProjectStatus, Project } from '../../model/projects'

const LaunchedProject: React.FC<{ contractName: string, project: Project }> = ({contractName, project}) => {
  return (
    <p>Launched: {contractName}</p>
  );
}
export default LaunchedProject