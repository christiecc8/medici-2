import React from 'react';

import stars from '../../assets/marketplace-stars.svg';
import stars2 from '../../assets/marketplace-stars-bottom.svg';
import '../../css/marketplace.css';

const Background: React.FC<{}> = () => {
  return (
    <div className="absolute top-0 left-0 z-0 h-[calc(100%+64px)] w-full flex flex-col -mt-16">
      {/* <img
        src={stars}
        className="w-20 bg-transparent absolute left-20 top-24"
        alt=""
      /> */}
      <div className="body-bg flex-100 w-full flex-1"></div>
      {/* <img
        src={stars2}
        className="w-20 bg-transparent absolute right-20 top-96"
        alt=""
      /> */}
    </div>
  );
};

export default Background;
