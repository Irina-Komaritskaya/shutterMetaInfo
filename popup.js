import { getData } from "./request";
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

  const container = document.querySelector(
    '[data-automation="AssetGrids_MosaicAssetGrid_div"]'
  );
  const links = container.getElementsByTagName("a");
  for (let i = 0; i < links.length; i++) {
    const link = links[i].href;
    getData(link).then((res) => {
      const positionStart = res.indexOf(`{"props":`);
      const positionFinish = res.lastIndexOf("</script>");
      const str = res.slice(positionStart, positionFinish);
      const data = JSON.parse(str);

      const key = data.props.pageProps.asset.keywords;
      console.log(key);
    });

    // let meetup = JSON.parse(str);
  }
}
