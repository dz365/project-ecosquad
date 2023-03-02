import axios from "axios";

const serverURL = process.env.REACT_APP_API_SERVER_URL;
export const testAPIEndpoint = async (accessToken: string) => {
  return axios({
    url: serverURL,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);
};
