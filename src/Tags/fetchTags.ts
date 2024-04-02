import axios from "axios";

import { Tag } from "./Tags.types";
import { DEFAULT_PAGE_SIZE } from "./consts";

const createPageSize = (page: number, tagsNumber: number) => {
  if (page === 1) return Math.min(tagsNumber, DEFAULT_PAGE_SIZE);

  if (Math.ceil(tagsNumber / DEFAULT_PAGE_SIZE) === page)
    return tagsNumber % DEFAULT_PAGE_SIZE;

  return DEFAULT_PAGE_SIZE;
};

export const fetchTags = (page: number, tagsNumber: number) => {
  const pageSize = createPageSize(page, tagsNumber);

  return axios.get<{ items: Tag[] }>(
    `https://api.stackexchange.com/2.3/tags?page=${page}&pagesize=${pageSize}&order=desc&sort=activity&site=stackoverflow`
  );
};
