import React, { useEffect, useState } from 'react';
import Navbar from '@theme-original/Navbar';
import CustomNav from '../../components/CustomNav';

export default function NavbarWrapper(props) {

  let [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    isMobile = document.documentElement.clientWidth <= 996;
    setIsMobile(isMobile);
  },[])

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
            zIndex: 999,
            display: 'none'
          }} />
      }
      <div style={{ display: "none" }}>

        <Navbar {...props} />
      </div>
    </>
  );
}
