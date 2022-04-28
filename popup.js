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

  const keysSelected = [];
  const keyHandler = (key, e) => {
    const index = keysSelected.indexOf(key);
    if (index >= 0) {
      keysSelected.splice(index, 1);
      e.target.style.backgroundColor = "#4056A1";
    } else {
      keysSelected.push(key);
      e.target.style.backgroundColor = "green";
    }
    console.log(e.target);
  };

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
      const description = asset.description;

      const itemImg = links[i].parentElement;

      const pin = document.createElement("div");
      pin.setAttribute("id", `pin_${i}`);
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
      itemImg.append(pin);

      let clickedId = null;
      const pinHandler = (e) => {
        e.stopPropagation();

        if (document.getElementById("information")) {
          document.getElementById("information").remove();
        }
        if (clickedId === e.srcElement.id) {
          clickedId = null;
          return;
        }
        clickedId = e.srcElement.id;
        const information = document.createElement("div");
        information.setAttribute("id", "information");
        information.style.display = "flex";
        information.style.flexDirection = "column";
        information.style.padding = "10px";
        information.style.width = "600px";
        information.style.backgroundColor = "#EFE2BA";
        information.style.position = "absolute";
        information.style.zIndex = "10";
        information.style.top = e.pageY - 230 + "px";
        information.style.left = e.pageX + 20 + "px";
        container.append(information);

        const keysDiv = document.createElement("div");
        keysDiv.setAttribute("id", "keys");
        keysDiv.style.backgroundColor = "white";
        keysDiv.style.display = "flex";
        keysDiv.style.flexDirection = "row";
        keysDiv.style.flexWrap = "wrap";
        keysDiv.style.padding = "10px";
        keys.forEach((key) => {
          const item = document.createElement("div");
          item.setAttribute("class", "item");
          item.style.marginLeft = "10px";
          item.style.marginTop = "3px";
          item.style.padding = "5px";
          item.style.color = "white";
          item.style.borderRadius = "10px";
          item.style.backgroundColor = "#4056A1";
          item.style.cursor = "pointer";
          item.innerHTML = key;
          keysDiv.appendChild(item);
          item.addEventListener("click", (e) => keyHandler(key, e));
        });
        information.appendChild(keysDiv);

        const descriptionDiv = document.createElement("div");
        descriptionDiv.setAttribute("id", "description");
        descriptionDiv.style.backgroundColor = "#D79922";
        descriptionDiv.style.marginTop = "10px";
        descriptionDiv.style.color = "white";
        descriptionDiv.style.padding = "10px";
        descriptionDiv.innerHTML = description;
        information.appendChild(descriptionDiv);
      };

      pin.addEventListener("click", pinHandler);
    });
  }
}
