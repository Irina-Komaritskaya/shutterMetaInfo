import { getMetaData } from "../request";
export const checkboxHandler = (e) => {
    if (e.target.checked) {
        isChecked(e).then((keywords) => {
            console.log(keywords);
        });
    } else {
        console.log("uncheked");
    }
};

const isChecked = async (e) => {
    const link = e.target.parentElement.getElementsByTagName("a")[0];
    console.log(link);
    const metaData = await getMetaData(link);
    const keywords = metaData?.keywords;
    if (!metaData || !keywords) {
        return;
    }
    return keywords;
};
