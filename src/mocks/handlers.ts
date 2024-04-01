import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("https://api.stackexchange.com/*", () => {
    console.log("przechwycono zapytanie");
    return new HttpResponse(null, { status: 401 });
  }),
];
