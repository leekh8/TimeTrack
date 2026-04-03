/**
 * 서버 API 클라이언트 — localStorage fallback 포함
 * REACT_APP_API_URL 환경변수로 엔드포인트 지정 (기본: http://localhost:5000)
 */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const TIMEOUT_MS = 3000;

const fetchWithTimeout = (url, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
};

// 서버 가용 여부 캐시 (세션당 한 번만 체크)
let serverAvailable = null;

export const checkServer = async () => {
  if (serverAvailable !== null) return serverAvailable;
  try {
    const res = await fetchWithTimeout(`${API_BASE}/`);
    serverAvailable = res.ok;
  } catch {
    serverAvailable = false;
  }
  return serverAvailable;
};

export const apiTasks = {
  getAll: () =>
    fetchWithTimeout(`${API_BASE}/tasks`).then((r) => r.json()),

  create: (text) =>
    fetchWithTimeout(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then((r) => r.json()),

  update: (id, patch) =>
    fetchWithTimeout(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).then((r) => r.json()),

  remove: (id) =>
    fetchWithTimeout(`${API_BASE}/tasks/${id}`, { method: "DELETE" }),

  clearCompleted: () =>
    fetchWithTimeout(`${API_BASE}/tasks`, { method: "DELETE" }).then((r) =>
      r.json()
    ),
};
