import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'
import Button from '@mui/material/Button'

import Home from './pages/home'
import DropEditor from './pages/dropeditor'
import Project from './pages/project'
import ProjectManager from './pages/project_manager'
import Creator from './pages/creator'
import Reservation from './pages/reservation'

import Header from './components/header/Header'
import WalletContextProvider from './contexts/WalletContextProvider'
import Background from './components/Background'
import ClaimPage from './pages/claimPage'
import EmptyPage from './pages/emptyPage'
import StarryBackground from './components/home/StarryBackground'
import party from 'party-js'

const customTheme = createTheme({
  palette: {
    primary: { main: '#151719', dark: 'white' },
    secondary: { main: '#6618E4', dark: '#952EE6' },
  },
  typography: {
    fontFamily: 'Poppins',
  },
})

const sparkleConfig = {
  lifetime: party.variation.range(0.5, 1.0),
  size: party.variation.range(0.5, 0.8),
  count: 15,
}

document.body.addEventListener('click', (event) => {
  party.sparkles(event, sparkleConfig)
})

const Test = () => {
  const [playing, setPlaying] = React.useState(true)
  return (
    <div className="bg-white w-full md:w-2/3 p-10 rounded-xl my-10">
      <div className="relative flex w-full h-[300px] md:h-[450px]">
        <div
          className="w-[300px] md:w-[450px] h-full animate-spin-slow overflow-hidden rounded-full relative flex items-center justify-center"
          style={{
            animationPlayState: playing ? 'running' : 'paused',
          }}
        >
          <img src="blue_smoke_web.png" className="object-cover z-10" />
          <div className="h-[60px] w-[60px] rounded-full z-10 bg-black absolute " />
          <div className="h-[20px] w-[20px] rounded-full z-10 bg-gray-500 absolute " />
        </div>
        <img
          src="https://vinylblade.com/_nuxt/img/arm.f195722.png"
          className={`h-[300px] md:h-[450px] transition-transform ease-in-out duration-500 ${
            playing ? 'rotate-45' : ''
          }`}
          style={{
            transformOrigin: '50% 25% 0',
          }}
        />
      </div>
      <Button
        sx={{
          borderColor: '#6618E4',
          border: '1px solid',
          backgroundColor: playing ? '#6618E4' : 'white',
          color: playing ? 'white' : '#6618E4',
          ':hover': {
            color: '#6618E4',
          },
        }}
        onClick={() => setPlaying((val) => !val)}
      >
        Play
      </Button>
    </div>
  )
}

const App: React.FC<{}> = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <WalletContextProvider>
        <div className="text-medici-primary relative overflow-auto min-h-full">
          <Router>
            <main className="font-sans mt-16">
              <Background />
              <StarryBackground />
              <Header />
              <div className="z-1 relative">
                <Routes>
                  <Route path="/create" element={<Creator />} />
                  <Route path="/launch" element={<DropEditor />} />
                  <Route path="/page/:name" element={<ClaimPage />} />
                  <Route path="/projects" element={<ProjectManager />} />
                  <Route
                    path="/project/:contractname"
                    element={<Project />}
                  />
                  <Route path="/reservation/:name" element={<Reservation />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/test" element={<Test />} />
                  <Route path="*" element={<EmptyPage />} />
                </Routes>
              </div>
            </main>
          </Router>
        </div>
      </WalletContextProvider>
    </ThemeProvider>
  )
}

export default App
