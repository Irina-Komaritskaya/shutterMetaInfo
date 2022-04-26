// получаем доступ к кнопке
let snow = document.getElementById("snow");
// когда кнопка нажата — находим активную вкладку и запускаем нужную функцию
snow.addEventListener("click", async () => {
  // получаем доступ к активной вкладке
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // выполняем скрипт
  chrome.scripting.executeScript({
    // скрипт будет выполняться во вкладке, которую нашли на предыдущем этапе
    target: { tabId: tab.id },
    // вызываем функцию, в которой лежит запуск снежинок
    function: snowFall,
  });
});

// запускаем снег
function snowFall() {
  const container = document.querySelector(
    '[data-automation="AssetGrids_MosaicAssetGrid_div"]'
  );
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
  const cutData = (initData, positionStart, positionFinish) => {
    const str = initData.slice(positionStart, positionFinish);
    const data = JSON.parse(str);
    return data;
  };

  const links = container.getElementsByTagName("a");

  for (let i = 0; i < links.length; i++) {
    const link = links[i].href;

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

      const item = links[i].parentElement;

      const pin = document.createElement("div");
      pin.setAttribute("id", "pin");
      pin.textContent = "i";
      pin.style.position = "absolute";
      pin.style.bottom = "10px";
      pin.style.left = "10px";
      pin.style.width = "20px";
      pin.style.height = "20px";
      pin.style.backgroundColor = "#00BFFF";
      pin.style.borderRadius = "20px";
      pin.style.textAlign = "center";
      pin.style.fontSize = "15px";
	  pin.style.zIndex = "10";
	  pin.style.cursor = "pointer";
      item.append(pin);

      const pinHandler = (e) => {
        e.stopPropagation();
		
        const information = document.createElement("div");
        information.setAttribute("id", "information");
		information.style.display = "flex";
        information.style.width = "300px";
        information.style.height = "200px";
        information.style.backgroundColor = "#00BFFF";
        information.style.position = "absolute";
		information.style.zIndex = "10";
		information.style.top = (e.pageY-230) + "px";
		information.style.left = (e.pageX+30) + "px";
        container.append(information);
		
      };

      pin.addEventListener("click", pinHandler);

      const infoDiv = document.createElement("div");
      infoDiv.setAttribute("class", "infoContainer");
      infoDiv.textContent = keys;
      item.append(infoDiv);
      infoDiv.style.position = "absolute";
      infoDiv.style.zIndex = "10";
      infoDiv.style.top = "0";
      infoDiv.style.left = "0";
    });
  }
}
