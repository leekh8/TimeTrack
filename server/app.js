const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// 인메모리 저장소 (재시작 시 초기화 — 추후 DB 연동 권장)
let tasks = [];

// ── 헬스체크 ──────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "TimeTrack 서버가 실행 중입니다." });
});

// ── 할 일 목록 조회 ───────────────────────────────
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// ── 할 일 추가 ────────────────────────────────────
app.post("/tasks", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "text 필드가 필요합니다." });
  }
  const task = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  res.status(201).json(task);
});

// ── 할 일 수정 (텍스트 또는 완료 상태) ────────────
app.put("/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "해당 할 일을 찾을 수 없습니다." });
  }
  const { text, completed } = req.body;
  if (text !== undefined) tasks[index].text = text.trim();
  if (completed !== undefined) tasks[index].completed = Boolean(completed);
  res.json(tasks[index]);
});

// ── 할 일 순서 변경 (드래그 앤 드롭) ─────────────
app.put("/tasks/reorder", (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: "orderedIds 배열이 필요합니다." });
  }
  const reordered = orderedIds
    .map((id) => tasks.find((t) => t.id === id))
    .filter(Boolean);
  if (reordered.length !== tasks.length) {
    return res.status(400).json({ error: "orderedIds가 전체 목록과 일치하지 않습니다." });
  }
  tasks = reordered;
  res.json(tasks);
});

// ── 할 일 삭제 ────────────────────────────────────
app.delete("/tasks/:id", (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== req.params.id);
  if (tasks.length === before) {
    return res.status(404).json({ error: "해당 할 일을 찾을 수 없습니다." });
  }
  res.status(204).send();
});

// ── 전체 삭제 (완료된 항목만) ─────────────────────
app.delete("/tasks", (req, res) => {
  tasks = tasks.filter((t) => !t.completed);
  res.json({ message: "완료된 할 일을 삭제했습니다.", remaining: tasks.length });
});

app.listen(PORT, () => {
  console.log(`TimeTrack 서버: http://localhost:${PORT}`);
});
