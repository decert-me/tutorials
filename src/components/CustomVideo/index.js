import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import { getTutorialStatus } from '../../utils/tutorialsCache';
import { GlobalContext } from '../../provider';
import ReactPlayer from 'react-player'

export default function CustomVideo({videoId, videoCategory, time_length}) {

    const location = useLocation();
    const local = localStorage.getItem("decert.tutorials");
    const { updateStatus } = useContext(GlobalContext);
    let [selectItem, setSelectItem] = useState();
    let [isFinish, setIsFinish] = useState();
    
    let [timeStamp, setTimeStamp] = useState();     //  bilibili使用
    let [startTimeStamp, setStartTimeStamp] = useState();   //  开始计时的时间戳

    function setUpdateLocal() {
        const local = localStorage.getItem("decert.tutorials");
        const json = JSON.parse(local)
        json.forEach(element => {
            if (element.catalogueName === selectItem.catalogueName) {
                element.list.forEach((ele, index) => {
                    if (ele.docId === selectItem.docId) {
                        element.list[index] = {
                            ...ele,
                            ...timeStamp
                        }
                    }
                })
            }
        });
        console.log(json);
        localStorage.setItem("decert.tutorials", JSON.stringify(json));
    }

    // 获取本地存储当前page的时间
    function getUpdateLocal() {
        // 1、获取本地数据 --- 如果没有则请求`https://api.bilibili.com/x/player/playurl?...` : 则获取
        const json = JSON.parse(local)
        const doc = json.filter(e => e.catalogueName === selectItem.catalogueName)[0];
        const item = doc.list.filter(e => e.docId === selectItem.docId)[0];

        if (item?.time_length) {
            const { time_length, time_readed } = item;
            timeStamp = { time_length, time_readed };
        }else{
            timeStamp = {
                time_length,
                time_readed: 0
            }
        }
        setTimeStamp({...timeStamp});
        startTimeStamp = new Date().getTime();
        setStartTimeStamp(startTimeStamp);
        const timeout = timeStamp.time_length / 2 - timeStamp.time_readed;
        setTimeout(() => {
            update()
        }, timeout);
    }

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

    useEffect(() => {
        !isFinish && local && videoCategory !== "youtube" && getUpdateLocal()
        
        return () => {
        //   如果!isFinish 获取当前时间戳、减去start时间戳，记录在local中.
            if (!isFinish) {
                timeStamp.time_readed = (new Date().getTime() - startTimeStamp).toFixed(0);
                setTimeStamp({...timeStamp});
                setUpdateLocal();
            }
        };
      }, [location]);

    return (
        videoCategory === "youtube" ?
            <ReactPlayer 
            url={`https://www.youtube.com/embed/${videoId}`}
            controls={true}
            width={"auto"}
            height={"auto"}
            onEnded={() => update()}
        />
        :

        <iframe src={`//player.bilibili.com/player.html?${videoId}`}>
        </iframe>
    )
}