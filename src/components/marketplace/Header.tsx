import React from 'react';
import '../../css/marketplace.css';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC<{}> = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/page/')) {
    return null;
  }

  return (
    <header className="h-16 w-full px-4 z-10 -mt-10 flex items-end justify-between">
      <Link to="/" className="flex align-center self-start">
        <img src="/logo-medici-dark.svg" alt="" className="mr-4" />
      </Link>
      <h1 className="font-drukwide header-title text-3xl md:text-5xl leading-none">
        GALLERY
      </h1>
      {/* <Link to="/explore" className="hidden md:block">
            Explore
          </Link>
          <Link to="/about" className="hidden md:block">
            About
          </Link> */}
      <span className="rounded-3xl bg-[#1E1E1E] text-white w-24 flex items-center justify-center h-10 font-authentic self-start">
        Create
      </span>
    </header>
  );
};

export default Header;
