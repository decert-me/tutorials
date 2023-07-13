import React, { createContext, useState } from 'react';
import { updateProgress } from '../request/public';
import { useAccount } from 'wagmi';
import { updateLocalTutorial } from '../utils/tutorialsCache';

// 创建全局上下文
const GlobalContext = createContext();

// 创建一个提供器组件
const GlobalContextProvider = ({ children }) => {

  const { address } = useAccount();
  const [isSign, setIsSign] = useState(false);
  let [selectTutorial, setSelectTutorial] = useState([]);
  
  function updateTutorial(arr) {
    selectTutorial = arr;
    setSelectTutorial([...selectTutorial]);
  }

  function updateStatus(docId) {
    selectTutorial.forEach(e => {
      if (e.docId === docId) {
        e.is_finish = true;
      }
    })
    setSelectTutorial([...selectTutorial]);

    // TODO: 后端更新、本地local更新
    if (address) {
      address &&
      updateProgress({
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
  }

  return (
    <GlobalContext.Provider value={{ isSign, setIsSign, selectTutorial, updateTutorial, updateStatus }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };