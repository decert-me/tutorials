import { useLocation } from '@docusaurus/router';
import React, { useContext, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { getTutorialStatus } from '../../utils/tutorialsCache';
import { GlobalContext } from '../../provider';

export default function CustomVideo({videoId}) {

    const location = useLocation();
    const { updateStatus } = useContext(GlobalContext);
    let [selectItem, setSelectItem] = useState();
    let [isFinish, setIsFinish] = useState();

    // 阅读完当前页
    function update(params) {
        updateStatus(selectItem.docId)
        setIsFinish(true);
    }

    function init(params) {
        const path = location.pathname.split("/tutorial/")[1];
        const catalogueName = path.split("/")[0];
        selectItem = {
          catalogueName: catalogueName,
          docId: path,
        }
        setSelectItem({...selectItem});
        if (catalogueName === "category") {
          return
        }
        isFinish = getTutorialStatus(selectItem);
        setIsFinish(isFinish)
    }

    useEffect(() => {
        init()
    },[location])
    
    return (
        <YouTube
            videoId={videoId}                  // defaults -> ''
            // id={string}                       // defaults -> ''
            // className={string}                // defaults -> ''
            // iframeClassName={string}          // defaults -> ''
            // style={object}                    // defaults -> {}
            // title={string}                    // defaults -> ''
            // loading={string}                  // defaults -> undefined
            // opts={obj}                        // defaults -> {}
            // onReady={func}                    // defaults -> noop
            // onPlay={func}                     // defaults -> noop
            // onPause={func}                    // defaults -> noop
            onEnd={() => update()}                      // defaults -> noop
            // onError={func}                    // defaults -> noop
            // onStateChange={func}              // defaults -> noop
            // onPlaybackRateChange={func}       // defaults -> noop
            // onPlaybackQualityChange={func}    // defaults -> noop
            />
    )
}