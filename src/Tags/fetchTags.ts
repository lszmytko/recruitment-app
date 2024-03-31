import axios from "axios";

import { Tag } from "./Tags.types";

export const fetchTags = (postsNumber: number) => {
  return axios.get<{ items: Tag[] }>(
    `https://api.stackexchange.com/2.3/tags?pagesize=${postsNumber}&order=desc&sort=activity&site=stackoverflow`
  );
};
