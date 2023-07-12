import React, { createContext, useState } from 'react';

// 创建全局上下文
const GlobalContext = createContext();

// 创建一个提供器组件
const GlobalContextProvider = ({ children }) => {
  const [isSign, setIsSign] = useState(false);

  return (
    <GlobalContext.Provider value={{ isSign, setIsSign }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };