import React, { createContext, useState } from 'react';
import { updateProgress } from '../request/public';

// 创建全局上下文
const GlobalContext = createContext();

// 创建一个提供器组件
const GlobalContextProvider = ({ children }) => {
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

  return (
    <GlobalContext.Provider value={{ isSign, setIsSign, selectTutorial, updateTutorial, updateStatus }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };