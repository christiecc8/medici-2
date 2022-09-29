import React from 'react';
import '../../css/marketplace.css';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC<{}> = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/page/')) {
    return null;
  }

  return (
    <header className="h-16 w-full px-4 z-10 -mt-10 flex flex-wrap items-end justify-between">
      <Link to="/" className="flex align-center self-start order-0">
        <img src="/logo-medici-dark.svg" alt="" className="mr-4" />
      </Link>
      <h1 className="font-drukwide header-title w-full md:w-auto text-3xl md:text-5xl text-center leading-none order-2 md:order-1">
        GALLERY
      </h1>
      {/* <Link to="/explore" className="hidden md:block">
            Explore
          </Link>
          <Link to="/about" className="hidden md:block">
            About
          </Link> */}
        <a href="/home" className="rounded-3xl bg-[#1E1E1E] text-white w-24 flex items-center justify-center h-10 font-authentic self-start order-1">
          Launch
        </a>
    </header>
  );
};

export default Header;
