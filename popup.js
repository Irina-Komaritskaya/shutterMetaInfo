// получаем доступ к кнопке
let start = document.getElementById("startBtn");
let keysSelect = document.getElementById("keys");

let a = "text";
// когда кнопка нажата — находим активную вкладку и запускаем нужную функцию
start.addEventListener("click", async () => {
  // получаем доступ к активной вкладке
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // выполняем скрипт
  chrome.scripting.executeScript({
    // скрипт будет выполняться во вкладке, которую нашли на предыдущем этапе
    target: { tabId: tab.id },
    function: startScript,
  });
});

function startScript() {
  const container = document.querySelector(
    '[data-automation="AssetGrids_MosaicAssetGrid_div"]'
  );
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
  const cutData = (initData, positionStart, positionFinish) => {
    const str = initData.slice(positionStart, positionFinish);
    const data = JSON.parse(str);
    return data;
  };

  const links = container.getElementsByTagName("a");

  const keysSelected = [];
  //   const descriptionSelected = [];

  const keyHandler = (key, e) => {
    const index = keysSelected.indexOf(key);
    if (index >= 0) {
      keysSelected.splice(index, 1);
      e.target.style.backgroundColor = "#4056A1";
    } else {
      keysSelected.push(key);
      e.target.style.backgroundColor = "green";
    }
    console.log(keysSelected);
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
      pin.setAttribute("class", "pin");
      pin.textContent = "i";
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
        information.style.top = e.pageY - 230 + "px";
        information.style.left = e.pageX + 20 + "px";
        container.append(information);

        const keysDiv = document.createElement("div");
        keysDiv.setAttribute("id", "keys");

        keys.forEach((key) => {
          const item = document.createElement("div");
          item.setAttribute("class", "item");
          item.innerHTML = key;
          if (keysSelected.find((x) => x === key)) {
            item.style.backgroundColor = "green";
          } else {
            item.style.backgroundColor = "#4056A1";
          }
          keysDiv.appendChild(item);
          item.addEventListener("click", (e) => keyHandler(key, e));
        });
        information.appendChild(keysDiv);

        const descriptionDiv = document.createElement("div");
        descriptionDiv.setAttribute("id", "description");

        descriptionDiv.innerHTML = description;
        information.appendChild(descriptionDiv);
      };
      pin.addEventListener("click", pinHandler);
    });
  }
}
