const axios = require('axios');


async function getBilibiliTimeLength(params) {
    const url = `https://api.bilibili.com/x/player/playurl?${params}`;
    const referer = url;
    console.log(url);
    const headers = {
        Referer: referer,
    };
    return await axios.get(url, {headers})
    .then(res => {
        return res.data.data.timelength
    })
}

module.exports = {
    getBilibiliTimeLength
};