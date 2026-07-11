import { makeTaskId, reorderActiveTasks } from "./tasks";

describe("makeTaskId", () => {
  it("같은 밀리초에 여러 번 호출해도 모두 고유하다", () => {
    const ids = Array.from({ length: 1000 }, () => makeTaskId());
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("문자열 id를 반환한다", () => {
    expect(typeof makeTaskId()).toBe("string");
    expect(makeTaskId().length).toBeGreaterThan(0);
  });
});

describe("reorderActiveTasks", () => {
  const tasks = [
    { id: "a", completed: false },
    { id: "b", completed: false },
    { id: "c", completed: false },
    { id: "x", completed: true },
  ];

  it("미완료 항목을 앞으로 이동한다", () => {
    const result = reorderActiveTasks(tasks, 2, 0);
    expect(result.map((t) => t.id)).toEqual(["c", "a", "b", "x"]);
  });

  it("완료 항목은 항상 뒤에 유지된다", () => {
    const result = reorderActiveTasks(tasks, 0, 2);
    expect(result[result.length - 1].id).toBe("x");
    expect(result.map((t) => t.id)).toEqual(["b", "c", "a", "x"]);
  });

  it("원본 배열을 변형하지 않는다 (불변)", () => {
    const snapshot = tasks.map((t) => t.id);
    reorderActiveTasks(tasks, 0, 2);
    expect(tasks.map((t) => t.id)).toEqual(snapshot);
  });

  it("범위를 벗어난 인덱스는 원본을 그대로 반환한다", () => {
    expect(reorderActiveTasks(tasks, 5, 0)).toBe(tasks);
    expect(reorderActiveTasks(tasks, -1, 0)).toBe(tasks);
  });

  it("배열이 아니면 빈 배열을 반환한다", () => {
    expect(reorderActiveTasks(null, 0, 0)).toEqual([]);
  });
});
