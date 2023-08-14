import React, { useEffect, useState } from 'react';
import Navbar from '@theme-original/Navbar';
import { useLocation } from '@docusaurus/router';
import CustomNav from '../../components/CustomNav';

export default function NavbarWrapper(props) {

  const location = useLocation();
  let [isMobile, setIsMobile] = useState(false);
  let [isShow, setIsShow] = useState(false);

  useEffect(() => {
    isMobile = document.documentElement.clientWidth <= 996;
    setIsMobile(isMobile);
  },[])

  useEffect(() => {
    isShow = location.pathname === "/tutorial/";
    setIsShow(isShow);
  },[location])

  return (
    <>
      <CustomNav />
      {
        !isMobile &&
          <div style={{
            width: "100%",
            height: "10px",
            backgroundColor: "#FBFBFB",
            position: "fixed",
            top: "82px",
            left: 0,
            zIndex: 999
          }} />
      }
      {
        !isShow &&
        <Navbar {...props} />
      }
    </>
  );
}
