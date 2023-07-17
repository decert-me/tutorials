import { updateProgress } from "../request/public";

export function tutorialsInit(catalogueName, items) {
    let tutorials = [];
    // 查询local是否有该题缓存
    const local = localStorage.getItem("decert.tutorials");
    if (!local) {
        // 没有初始化过: 1、初始化tutorials 2、初始化当前category
        catalogueNameInit(tutorials, catalogueName, items);
        return tutorials
    }else{
        // 有初始化: 1、判断是是否有该题缓存
        tutorials = JSON.parse(local);
        if (tutorials.some(ele => ele.catalogueName === catalogueName)) {
            //  TODO: 有缓存: 和新获取的local合并
            return tutorials            
        }else{
            // 没有该题缓存, 初始化后返回
            catalogueNameInit(tutorials, catalogueName, items);
            return tutorials
        }
    }
}

export function tutorialsItemsInit(sidebar) {
    let arr = [];
    sidebar.forEach(ele => {
        ele.docId ?
            arr.push({
                docId: ele.docId.replace(/\/readme$/i, "/"),
                is_finish: false
            })
            :
            ele.items.forEach(e => {
                arr.push({
                    docId: e.docId.replace(/\/readme$/i, "/"),
                    is_finish: false
                })
            })
    });
    return arr
}

export function catalogueNameInit(tutorials, catalogueName, items) {
    tutorials.push({
        catalogueName: catalogueName,
        list: items
    })
    localStorage.setItem("decert.tutorials", JSON.stringify(tutorials))
}

export async function tutorialsDataToCache(data) {
    const local = localStorage.getItem("decert.tutorials");
    
    // 是否有local
    if (local) {
        // 是否有当前category的local
        const tutorials = JSON.parse(local);
        if (tutorials.some(ele => ele.catalogueName === data.catalogue_name)) {
            // local有该题缓存, local缓存同步data
            // 所有为finish的更新

            await tutorials.forEach(async(e) => {
                if (e.catalogueName === data.catalogue_name) {
                    // 查找local所有finish
                    let arr = [];
                    let dataArr = [];
                    e.list.forEach(item => {
                        item.is_finish && arr.push(item)
                    })
                    data.data.forEach(item => {
                        item.is_finish && dataArr.push(item)
                    })
                    // 如果后端数据没一个finish的则前端cache同步后端
                    if (dataArr.length > 0) {
                        // 后端 to local
                        e.list = data.data
                    }else{
                        // local to 后端
                        await updateProgress({
                            catalogueName: e.catalogueName,
                            data: arr
                        })
                    }
                    
                }
            })
            localStorage.setItem("decert.tutorials", JSON.stringify(tutorials))
        }else{
            // 没有该题缓存, 初始化后返回
            catalogueNameInit(tutorials, data.catalogue_name, data.data);
        }
    }else{
        // 直接初始化
        catalogueNameInit([], data.catalogue_name, data.data);
    }
}

export function getTutorialStatus(params) {
    const { catalogueName, docId } = params;
    const local = localStorage.getItem("decert.tutorials");
    let flag;
    if (local) {
        const tutorials = JSON.parse(local);
        let selectTutorial;
        tutorials.forEach(e => {
            if (e.catalogueName === catalogueName) {
                selectTutorial = e.list;
            }
        })
        if (!selectTutorial) {
            return false
        }
        selectTutorial.forEach(e => {
            if (e.docId === docId) {
                flag = e.is_finish
            }
        })
        return flag
    }
}

export function updateLocalTutorial(params) {
    const { catalogueName, docId } = params;
    const local = localStorage.getItem("decert.tutorials");
    if (local) {
        const tutorials = JSON.parse(local);
        tutorials.forEach(e => {
            if (e.catalogueName === catalogueName) {
                e.list.forEach(ele => {
                    if (ele.docId === docId) {
                        ele.is_finish = !ele.is_finish;
                    }
                })
            }
        })
        localStorage.setItem("decert.tutorials", JSON.stringify(tutorials))
    }
}