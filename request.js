export const getData = async (url) => {
    console.log(url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  let result = await response.json();
  console.log(result);
  return result;
};
