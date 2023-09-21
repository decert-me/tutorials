import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import hljs from "highlight.js";
import { solidity } from 'highlightjs-solidity';

export default function CodeBlockWrapper(props) {
  let [obj, setObj] = useState(props)

  useEffect(() => {
    if (!obj?.className) {
      hljs.registerLanguage("solidity", solidity)
      const res = hljs.highlightAuto(props.children);
      obj = {
        ...obj,
        className: "language-" + res.language
      }
      setObj({...obj})
    }
  },[])

  return (
    <>
      <CodeBlock {...obj} />
    </>
  );
}
