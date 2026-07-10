import { getDayKey, getDayStats, buildRecentSeries, applyFocusCycle } from "./stats";

describe("getDayKey", () => {
  test("로컬 시간대 기준 YYYY-MM-DD를 만든다 (UTC 아님)", () => {
    // 2026-03-01 01:00 로컬 — UTC로는 전날(02-28)일 수 있는 시각
    const d = new Date(2026, 2, 1, 1, 0, 0);
    expect(getDayKey(d)).toBe("2026-03-01");
  });

  test("월/일을 0-패딩한다", () => {
    expect(getDayKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("getDayStats", () => {
  const today = new Date(2026, 6, 10);
  const raw = [
    { date: "2026-07-10", focusMinutes: 50, cycles: 2 },
    { date: "2026-07-09", focusMinutes: 25, cycles: 1 },
  ];

  test("오늘 통계를 찾아 반환한다", () => {
    expect(getDayStats(raw, today)).toEqual({ date: "2026-07-10", focusMinutes: 50, cycles: 2 });
  });

  test("기록 없으면 0으로 채운 기본값", () => {
    expect(getDayStats([], today)).toEqual({ focusMinutes: 0, cycles: 0 });
  });

  test("입력이 배열이 아니어도 안전", () => {
    expect(getDayStats(null, today)).toEqual({ focusMinutes: 0, cycles: 0 });
  });
});

describe("buildRecentSeries", () => {
  const today = new Date(2026, 6, 10);

  test("항상 요청한 일수만큼, 오래된→오늘 순으로 반환", () => {
    const series = buildRecentSeries([], 7, today);
    expect(series).toHaveLength(7);
    expect(series[0].date).toBe("2026-07-04");
    expect(series[6].date).toBe("2026-07-10");
  });

  test("기록 있는 날은 값을, 없는 날은 0을 채운다", () => {
    const raw = [{ date: "2026-07-10", focusMinutes: 50, cycles: 2 }];
    const series = buildRecentSeries(raw, 7, today);
    expect(series[6]).toEqual({ date: "2026-07-10", focusMinutes: 50, cycles: 2 });
    expect(series[5]).toEqual({ date: "2026-07-09", focusMinutes: 0, cycles: 0 });
  });
});

describe("applyFocusCycle", () => {
  const today = new Date(2026, 6, 10);

  test("새 날짜면 항목을 추가한다", () => {
    const next = applyFocusCycle([], 25, today);
    expect(next).toContainEqual({ date: "2026-07-10", focusMinutes: 25, cycles: 1 });
  });

  test("기존 날짜면 분·사이클을 누적한다", () => {
    const raw = [{ date: "2026-07-10", focusMinutes: 25, cycles: 1 }];
    const next = applyFocusCycle(raw, 30, today);
    expect(next).toContainEqual({ date: "2026-07-10", focusMinutes: 55, cycles: 2 });
  });

  test("보존기간 밖(기본 30일) 항목은 잘라낸다", () => {
    const raw = [{ date: "2026-05-01", focusMinutes: 999, cycles: 9 }];
    const next = applyFocusCycle(raw, 25, today);
    expect(next.find((s) => s.date === "2026-05-01")).toBeUndefined();
  });

  test("원본 배열을 변경하지 않는다 (불변)", () => {
    const raw = [{ date: "2026-07-10", focusMinutes: 25, cycles: 1 }];
    applyFocusCycle(raw, 30, today);
    expect(raw[0]).toEqual({ date: "2026-07-10", focusMinutes: 25, cycles: 1 });
  });
});
