const container = document.querySelector(
  '[data-automation="AssetGrids_MosaicAssetGrid_div"]'
);
const links = container.getElementsByTagName("a");

const cutData = (initData, positionStart, positionFinish) => {
  const str = initData.slice(positionStart, positionFinish);
  const data = JSON.parse(str);
  return data;
};
console.log(container);
async function getData(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  let result = await response.text();
  return result;
}

for (let i = 0; i < links.length; i++) {
  const link = links[i].href;
  console.log(link);
  getData(link).then((res) => {
    const positionStart = res.indexOf(`{"props":`);
    const positionFinish = res.lastIndexOf("</script>");
    const data = cutData(res, positionStart, positionFinish);
    const asset = data.props.pageProps.asset;

    if (asset === undefined || asset === null) {
      return;
    }
    const keys = asset.keywords;
    if (keys === undefined || keys === null) {
      return;
    }
    const description = asset.description;

    const itemImg = links[i].parentElement;
    const pin = document.createElement("div");
    pin.setAttribute("id", `pin_${i}`);
    pin.setAttribute("class", "pin");
    pin.textContent = "i";
    itemImg.append(pin);
  });
}
