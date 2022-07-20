import { html } from "./modal-html";
// const filteredKeywords = async () => {
//     let arr = [];
//     console.log(0);
//     await chrome.storage.local.get(["keywords"], function (result) {
//         arr = result.keywords;
//         console.log(1);
//         // chrome.storage.local.set({ keywords: arr });
//     });
//     return arr;
// };
export const modal = () => {
    document.body.insertAdjacentHTML("beforebegin", html);

    const otherKeywords = document.getElementById("otherKeywords");
    const selectedKeywords = document.getElementById("selectedKeywords");
    const sellKeywords = document.getElementById("sellKeywords");
    const clickedKeywords = [];

    chrome.storage.local.get(["keywords"], function (result) {
        const arr = result.keywords;
        const [sell, notSell] = extractKeywords(arr);

        insertKeywords(sell, sellKeywords, clickedKeywords);
        insertKeywords(notSell, otherKeywords, clickedKeywords);
    });
};
const insertKeywords = (arr, parent, clickedKeywords) => {
    const parentEl = parent;
    arr.forEach((x) => {
        const keyword = document.createElement("div");
        keyword.setAttribute("class", "keyword");
        keyword.textContent = x;
        parentEl.append(keyword);
        keyword.addEventListener("click", (e) =>
            keywordHandler(e, clickedKeywords)
        );
    });
};

const extractKeywords = (arr) => {
    let sellKeywords = [];
    let notSellKeywords = [];

    arr.forEach((x) => {
        sellKeywords = sellKeywords.concat(x.sellKeywords);
        notSellKeywords = notSellKeywords.concat(x.notSellKeywords);
    });

    let uniqueSellKeywords = sellKeywords.filter((item, index) => {
        return sellKeywords.indexOf(item) === index;
    });
    let uniqueNotSellKeywords = notSellKeywords.filter((item, index) => {
        return notSellKeywords.indexOf(item) === index;
    });

    return [uniqueSellKeywords, uniqueNotSellKeywords];
};

const keywordHandler = (e, clickedKeywords) => {
    e.stopPropagation();
    e.target.classList.toggle("selectedKeyword");
    const keyword = e.target.innerHTML;
    const indexSelected = clickedKeywords.indexOf(keyword);

    if (indexSelected === -1) {
        clickedKeywords.push(e.target.innerHTML);
    } else {
        console.log(indexSelected);
        clickedKeywords.splice(indexSelected, 1);
    }
    console.log(selectedKeywords);
};
// const pinHandler = (e) => {
//     e.stopPropagation();
//     if (document.getElementById("information")) {
//       document.getElementById("information").remove();
//     }
//     if (clickedId === e.srcElement.id) {
//       clickedId = null;
//       return;
//     }

//     if (keysSelected.find((x) => x === key)) {
//         item.style.backgroundColor = "green";
//       } else {
//         item.style.backgroundColor = "#4056A1";
//       }
//       keysDiv.appendChild(item);
//       item.addEventListener("click", (e) => keyHandler(key, e));
//     });
