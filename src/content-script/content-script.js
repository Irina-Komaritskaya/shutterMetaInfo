import { checkboxHandler } from "./selected-image";

const container = document.querySelector(
    '[data-automation="AssetGrids_MosaicAssetGrid_div"]'
);
const links = container.getElementsByTagName("a");
const keywordsSelected = {};

const main = async () => {
    for (let i = 0; i < links.length; i++) {
        const item = links[i].parentElement;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.setAttribute("id", `checkbox_${i}`);
        checkbox.setAttribute("class", "checkbox");
        item.append(checkbox);
        item.addEventListener("change", checkboxHandler);
    }
};

main();
