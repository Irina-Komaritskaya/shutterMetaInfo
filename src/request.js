import { extractData } from "./content-script/extract-data";
const getData = async (url) => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    });

    let result = await response.text();
    return result;
};

export const getMetaData = async (link) => {
    const data = await getData(link);
    const positionStart = data.indexOf(`{"props":`);
    const positionFinish = data.lastIndexOf("</script>");
    const parseData = extractData(data, positionStart, positionFinish);
    const metaData = parseData.props.pageProps.asset;
    return metaData;
};
