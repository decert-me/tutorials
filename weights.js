

const common = [
    {
        catalogueName: "ZK",
        weights: [
            {
                id: "MgJskhhYY2o",
                value: 100
            }
        ]
    }
]


function toSort(catalogueName, videoItems) {
    const weights = common.filter(e => e.catalogueName === catalogueName)[0].weights;
    weights.forEach(element => {
        const id = element.id;
        videoItems.forEach(ele => {
            if (ele.id === id) {
                ele.weights = element.value
            }
        })
    });
    videoItems.sort((a, b) => a.weights - b.weights);
    return videoItems
}


module.exports = {
    toSort
}