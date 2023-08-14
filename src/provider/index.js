import React, { createContext, useEffect, useState } from 'react';
import { updateProgress } from '../request/public';
import { updateLocalTutorial } from '../utils/tutorialsCache';

// 创建全局上下文
const GlobalContext = createContext();

// 创建一个提供器组件
const GlobalContextProvider = ({ children }) => {

  const [isSign, setIsSign] = useState(false);
  let [selectTutorial, setSelectTutorial] = useState([]);
  let [user, setUser] = useState();
  let [isMobile, setIsMobile] = useState();

  
  function updateTutorial(arr) {
    selectTutorial = arr;
    setSelectTutorial([...selectTutorial]);
  }

  async function updateStatus(docId) {

    // TODO: 后端更新、本地local更新
    if (user?.address) {
      user.address &&
      await updateProgress({
        catalogueName: docId.split("/")[0],
        data: [
          {
            docId: docId,
            is_finish: true
          }
        ]
      })
    }
    // 本地更新
    updateLocalTutorial({
      catalogueName: docId.split("/")[0],
      docId: docId
    })

    selectTutorial.forEach(e => {
      if (e.docId === docId) {
        e.is_finish = true;
      }
    })
    setSelectTutorial([...selectTutorial]);
  }

  function updateUser(params) {
    if (params) {
      user = params;
      setUser({...user})
    }else{
      user = null;
      setUser(user);
    }
  }

  function resize(params) {
    console.log("Xxx");
  }

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    }
  },[])

  return (
    <GlobalContext.Provider value={{ 
      isMobile,
      isSign, 
      setIsSign, 
      selectTutorial, 
      updateTutorial, 
      updateStatus,

      updateUser,
      user
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };