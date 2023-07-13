import serviceAxios from "./index";

// 获取登录签名信息
export const getLoginMsg = (data) => {
    return serviceAxios({
        url: `/users/getLoginMessage?address=${data.address}`,
        method: "get",
        data
    })
}

// 校验登录签名信息
export const authLoginSign = (data) => {
    return serviceAxios({
        url: `/users/authLoginSign`,
        method: "post",
        data
    })
}


// 获取个人资料
export const getUser = (data) => {
    return serviceAxios({
        url: `/users/${data.address}`,
        method: "get",
        data
    })
}

// 获取阅读进度
export const getTutorialProgress = (data) => {
    return serviceAxios({
        url: `/tutorial/progress`,
        method: "post",
        data
    })
}

// 更新阅读进度
export const updateProgress = (data) => {
    return serviceAxios({
        url: `/tutorial/progress`,
        method: "put",
        data
    })
}
