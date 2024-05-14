// prod server smooth Algo
// export const BASE_URL = "https://api.midad.tn";

export const BASE_URL = "http://192.168.2.7:3030";

export const createConfig = (userToken) => {
  return {
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*'
    },
  };
};
