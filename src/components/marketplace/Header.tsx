import React from 'react'
import '../../css/marketplace.css';
import { Link, useLocation } from 'react-router-dom';


const Header: React.FC<{}> = () => {
  const location = useLocation()
  if (location.pathname.startsWith('/page/')) {
    return null
  }


  return (
    <header className="h-16 w-full px-2 lg:px-0 py-4 top-0 left-0 z-10 -mt-10">
      <div className="w-full md:w-4/5 mx-auto flex items-center justify-between h-full">
          <Link to="/" className="flex align-center">
            <img src="/logo-medici-dark.svg" alt="" className="mr-4" />
          </Link>
          <h1 className="font-drukwide header-title text-3xl md:text-5xl">GALLERY</h1>
          {/* <Link to="/explore" className="hidden md:block">
            Explore
          </Link>
          <Link to="/about" className="hidden md:block">
            About
          </Link> */}
          <span className="rounded-3xl bg-[#1E1E1E] text-white px-5 py-2 font-authentic">Create</span>
        </div>
    </header>
  )
}

export default Header