export const extractData = (initData, positionStart, positionFinish) => {
    const str = initData.slice(positionStart, positionFinish);
    const data = JSON.parse(str);
    return data;
};
