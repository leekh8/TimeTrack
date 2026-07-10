import { render, screen } from "@testing-library/react";
import App from "./App";

test("앱 헤더에 TimeTrack 제목이 렌더된다", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "TimeTrack" })).toBeInTheDocument();
});

test("최근 7일 집중 히스토리 섹션이 렌더된다", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "최근 7일 집중" })).toBeInTheDocument();
});
