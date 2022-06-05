import { getMetaData } from "../request";

export const checkboxHandler = (e) => {
    const id = e.target.parentElement.getElementsByTagName("a")[0].href;
    if (e.target.checked) {
        console.log("CHECED");
        isChecked(e).then((keywords) => {
            const [sorted, notSorted] = sortKeywords(keywords);

            chrome.storage.local.get(["keywords"], function (result) {
                let arr =
                    Object.entries(result.keywords).length === 0
                        ? []
                        : result.keywords;
                arr = [
                    ...arr,
                    {
                        id: id,
                        sellKeywords: notSorted,
                        notSellKeywords: sorted,
                    },
                ];

                chrome.storage.local.set({ keywords: arr });
            });
        });
    } else {
        chrome.storage.local.get(["keywords"], function (result) {
            let arr = result.keywords;
            const index = arr.findIndex((x) => x.id === id);
            arr.splice(index, 1);
            chrome.storage.local.set({ keywords: arr });
        });
    }
};

const isChecked = async (e) => {
    const link = e.target.parentElement.getElementsByTagName("a")[0];
    const metaData = await getMetaData(link);
    const keywords = metaData?.keywords;
    if (!metaData || !keywords) {
        return;
    }
    return keywords;
};

const sortKeywords = (arr) => {
    let separator = null;

    for (let i = arr.length - 1; i > 0; i--) {
        if (arr[i - 1] > arr[i]) {
            separator = i + 1;
            break;
        }
    }
    const sorted = arr.slice(separator, arr.length - 1);
    const notSorted = arr.slice(0, separator);

    return [sorted, notSorted];
};
