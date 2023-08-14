import React, { forwardRef, useImperativeHandle, useState } from "react";
import "./index.scss"
import { useUpdateEffect } from "ahooks";
import { useTranslation } from "react-i18next";

function CustomCategory(props, ref) {
    
    const { 
        items, 
        label,
        sidebarIndex,
        allSelectItems,
        changeSelectItems
    } = props;

    useImperativeHandle(ref, () => ({
        removeSelect
    }))

    const { t } = useTranslation();
    let [selectItems, setSelectItems] = useState([]);
    const [isActive, setIsActive] = useState(true);

    function handleSelect(item) {
        const index = selectItems.findIndex(e => e.key === item.key);
        if (index === -1) {
            selectItems.push(item);
        }else{
            selectItems.splice(index, 1);
        }
        setSelectItems([...selectItems]);
        // 返回新数组
        changeSelectItems(selectItems)
    }

    function removeSelect(key, index) {
        if (index !== sidebarIndex) {
            return
        }
        const i = selectItems.findIndex(e => e.key === key);
        selectItems.splice(i, 1);
        setSelectItems([...selectItems]);
    }

    useUpdateEffect(() => {
        const newArr = allSelectItems[sidebarIndex];
        if (newArr.length === selectItems.length) {
            return
        }
        selectItems = newArr;
        setSelectItems([...selectItems]);
    },[allSelectItems])

    return (
        <div className="CustomCategory">
            <div className="label">
                <p>{t(`tutorial.${label}`)}</p>
                <div 
                    className={`arrow ${isActive ? "" : "arrow-rotate"}`} 
                    onClick={() => setIsActive(!isActive)}
                >
                    <img src={require("@site/static/img/icon-arrow.png").default} alt="" />
                </div>
            </div>
            <div className={`items ${isActive ? "" : "items-hide"}`}>
                {
                    items.map(item =>
                        <div 
                            key={item.key}
                            className={`item ${selectItems.some(e => e.key === item.key) ? "item-active" : ""}`}
                            onClick={() => handleSelect(item)}
                        >
                            {t(`tutorial.${item.label}`)} <img src={require(`@site/static/img/icon-${selectItems.some(e => e.key === item.key) ? "reduce" : "add"}.png`)} alt="" />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default forwardRef(CustomCategory)