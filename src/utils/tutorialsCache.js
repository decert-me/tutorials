
export function tutorialsInit(catalogueName, items) {
    let tutorials = [];
    // TODO: 查询local是否有该题缓存
    const local = localStorage.getItem("decert.tutorials");
    if (!local) {
        // 没有初始化过: 1、初始化tutorials 2、初始化当前category
        catalogueNameInit(tutorials, catalogueName, items);
        return tutorials
    }else{
        // 有初始化: 1、判断是是否有该题缓存
        tutorials = JSON.parse(local);
        if (tutorials.some(ele => ele.catalogueName === catalogueName)) {
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
                docId: ele.docId,
                is_finish: false
            })
            :
            ele.items.forEach(e => {
                arr.push({
                    docId: e.docId,
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