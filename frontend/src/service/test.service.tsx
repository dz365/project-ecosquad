import axios from "axios";
import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST!,
  apiKey: process.env.REACT_APP_MEILISEARCH_KEY!,
});

const searchIndex = client.index("posts");

const serverURL = process.env.REACT_APP_API_SERVER_URL;
const testAPIEndpoint = async (accessToken: string) => {
  return axios({
    url: serverURL,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);
};

const getUser = async (accessToken: string, userId: string) => {
  return axios({
    url: `${serverURL}/users/${userId}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);
};

const createUser = async (accessToken: string, formData: FormData) => {
  return axios
    .postForm(`${serverURL}/users`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
};

const updateUser = async (
  accessToken: string,
  formData: FormData,
  userId: string
) => {
  return axios
    .patchForm(`${serverURL}/users/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
};

const createPost = async (accessToken: string, formData: FormData) => {
  return axios
    .postForm(`${serverURL}/posts`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
};

const getPosts = async () => {
  return searchIndex.getDocuments().then((res: any) => res);
};

const getPost = async (accessToken: string, id: number) => {
  return axios({
    url: `${serverURL}/posts/${id}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.data);
};

const updatePost = async (
  accessToken: string,
  postId: number,
  formData: FormData
) => {
  return axios
    .patch(`${serverURL}/posts/${postId}`, formData, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
};

export {
  testAPIEndpoint,
  getUser,
  createUser,
  updateUser,
  createPost,
  getPost,
  getPosts,
  updatePost,
};
