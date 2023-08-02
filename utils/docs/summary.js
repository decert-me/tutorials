function parseLabel(label, catalogueName) {
  const regex = /\[(.*?)\]\((.*?)\)/;
  const match = label.match(regex);
  return {
    label: match[1],
    id: match[2].replace("./", catalogueName + "/").replace(".md", '').replace(/\d+_/, "").replace(/%20/g, " ")
  }
}

function refactor(params, catalogueName) {
  let arr = params;
  arr.forEach((e,i) => {
    // 解构label
    const obj = parseLabel(e.label, catalogueName)

    if (e.items.length === 0) {
      arr[i] = { ...obj, type: "doc" }
      delete arr[i].items
    } else {
      arr[i] = { 
        ...e,
        label: obj.label,
        link: {
          type: "doc",
          id: obj.id
        }, 
        type: "category" 
      }
      arr[i].items = refactor(e.items, catalogueName)
    }
  })
  return arr
}

function parseSummary(tokens, catalogueName) {
    const result = [];
    let ulOpen = -1;  //  ul层级
  
    function pushItem(obj) {
      if (ulOpen < 0) return;
    
      let target = result;
      for (let i = 0; i < ulOpen; i++) {
        if (!target.length) return;
        target = target[target.length - 1].items;
      }
      
      target.push(obj);
    }
  
    tokens.forEach(token => {
      if (token.content.trim() === "Summary") {
        return
      }
  
      switch (token.type) {
        case "bullet_list_open":
          ulOpen += 1;
          break;
        case "bullet_list_close":
          ulOpen -= 1;
          break;
        case "inline":
          pushItem({label: token.content.trim(), items: []})
        default:
          break;
      }
    });

    return refactor(result, catalogueName);
}

module.exports = {
    parseSummary
};