import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("https://api.stackexchange.com/*", () => {
    return new HttpResponse(null, { status: 401 });
  }),
];
