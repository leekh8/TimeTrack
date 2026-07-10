// 집중 통계 순수 헬퍼 — localStorage/React에 의존하지 않아 단독 테스트 가능.
// 저장 형식: [{ date: "YYYY-MM-DD", focusMinutes: number, cycles: number }, ...]

// 로컬 시간대 기준 날짜 키. (toISOString()은 UTC라 KST 오전 9시 이전이 어제로 밀리는 버그가 있었음)
export function getDayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 특정 날짜의 통계 1건 (없으면 0으로 채운 기본값)
export function getDayStats(rawStats, today = new Date()) {
  const key = getDayKey(today);
  const list = Array.isArray(rawStats) ? rawStats : [];
  return list.find((s) => s.date === key) || { focusMinutes: 0, cycles: 0 };
}

// 최근 N일 시계열 — 기록 없는 날은 0으로 채워 항상 길이 N (오래된 → 오늘 순)
export function buildRecentSeries(rawStats, days = 7, today = new Date()) {
  const byDate = new Map();
  for (const s of Array.isArray(rawStats) ? rawStats : []) byDate.set(s.date, s);

  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getDayKey(d);
    const hit = byDate.get(key);
    series.push({
      date: key,
      focusMinutes: hit ? hit.focusMinutes : 0,
      cycles: hit ? hit.cycles : 0,
    });
  }
  return series;
}

// 집중 사이클 1회 반영 후 보존기간(기본 30일) 밖을 잘라낸 새 배열 반환 (원본 불변)
export function applyFocusCycle(rawStats, focusMinutes, today = new Date(), retentionDays = 30) {
  const key = getDayKey(today);
  const stats = (Array.isArray(rawStats) ? rawStats : []).map((s) => ({ ...s }));

  const idx = stats.findIndex((s) => s.date === key);
  if (idx >= 0) {
    stats[idx].focusMinutes += focusMinutes;
    stats[idx].cycles += 1;
  } else {
    stats.push({ date: key, focusMinutes, cycles: 1 });
  }

  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - retentionDays);
  const cutoffKey = getDayKey(cutoff);
  // "YYYY-MM-DD" 문자열은 사전순 == 날짜순이라 문자열 비교로 시간대 이슈 없이 안전
  return stats.filter((s) => s.date >= cutoffKey);
}
