import { expect, test, describe } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { server } from "../../src/mocks/node";
import { mockFetchTagsResponse } from "../mocks/responses/fetchTagsResponse";
import Tags from "./Tags";

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const setup = () => {
  render(<Tags />, { wrapper });
};

describe("Tests", () => {
  test("should render refresh button when api call results in error", async () => {
    server.use(
      http.get("https://api.stackexchange.com/*", () => {
        return new HttpResponse(null, { status: 401 });
      })
    );
    setup();

    const refreshButton = await screen.findByRole("button", {
      name: /odśwież/i,
    });
    expect(refreshButton).toBeInTheDocument();
  });

  test("renders proper number of rows when api call results in success", async () => {
    server.use(
      http.get("https://api.stackexchange.com/*", () => {
        return HttpResponse.json(mockFetchTagsResponse);
      })
    );
    setup();

    await waitFor(() => {
      expect(screen.getAllByRole("row")).toHaveLength(8);
    });
  });
});
