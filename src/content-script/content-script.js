import { checkboxHandler } from "./selected-image";
import { modal } from "../modal/modal";
modal();
const container = document.querySelector(
    '[data-automation="AssetGrids_MosaicAssetGrid_div"]'
);
const links = container.getElementsByTagName("a");

for (let i = 0; i < links.length; i++) {
    const item = links[i].parentElement;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("id", `checkbox_${i}`);
    checkbox.setAttribute("class", "checkbox");
    item.append(checkbox);
    item.addEventListener("change", checkboxHandler);
    item.addEventListener("change", modal);
}
