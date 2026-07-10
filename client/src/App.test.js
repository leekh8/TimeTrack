import { render, screen } from "@testing-library/react";
import i18n from "./i18n";
import App from "./App";

// 테스트 환경(jsdom)은 navigator 로케일이 고정적이지 않으므로 언어를 명시해 결정적으로
beforeAll(async () => {
  await i18n.changeLanguage("ko");
});

test("앱 헤더에 TimeTrack 제목이 렌더된다", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "TimeTrack" })).toBeInTheDocument();
});

test("최근 7일 집중 히스토리 섹션이 렌더된다 (ko)", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "최근 7일 집중" })).toBeInTheDocument();
});

test("언어 전환 버튼이 있고 EN 라벨이 보인다", () => {
  render(<App />);
  expect(screen.getByRole("button", { name: "English로 전환" })).toBeInTheDocument();
});
