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
  const links = container.getElementsByTagName("a");
  console.log(links[1].href);
 
  for (let i = 0; i < links.length; i++) {
    links[i].href;
    
    
  }
}
