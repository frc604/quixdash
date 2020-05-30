import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders Quixdash", () => {
  const { getByText } = render(<App />);
  const text = getByText(/Quixdash/i);
  expect(text).toBeInTheDocument();
});
