import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { beforeAll, afterEach, afterAll } from "vitest";

import Tags from "./Tags";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { server } from "../../src/mocks/node";

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// vi.mock("./fetchTags", () => ({
//   fetchTags: vi.fn(),
// }));

const setup = () => {
  render(<Tags />, { wrapper });
};

describe("Tests", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should render refresh button when api call results in error", async () => {
    server.use(
      http.get("https://api.stackexchange.com/*", () => {
        console.log("przechwycono zapytanieeeee");
        return new HttpResponse(null, { status: 401 });
      })
    );
    setup();

    const refreshButton = await screen.findByRole("button", {
      name: /odśwież/i,
    });
    expect(refreshButton).toBeInTheDocument();
  });

  // test("displays error message on fetch failure", async () => {
  //   fetchTags.mockRejectedValueOnce(new Error("Failed to fetch"));

  //   render(<Tags />, { wrapper });

  //   await waitFor(() => {
  //     expect(screen.getByText(/Coś poszło nie tak.../i)).toBeInTheDocument();
  //   });
  // });
});
