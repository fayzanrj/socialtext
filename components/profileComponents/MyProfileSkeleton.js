import React from "react";

import styles from '@/styles/myprofile.module.css'
const MyProfileSkeleton = () => {
  return (
    <div className="loader  p-10 md:px-20 lg:px-32">
      <div className="wrapper">
        <div className="circle"></div>
        <div className="line-1"></div>
        <div className="line-2"></div>
        <div className="line-3"></div>
      </div>
    </div>
  );
};

export default MyProfileSkeleton;
