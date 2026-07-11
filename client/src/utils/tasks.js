/**
 * 할 일(Task) 관련 순수 헬퍼 — 렌더링과 분리해 단위 테스트 가능하게.
 */

// 같은 밀리초에 두 번 호출돼도 겹치지 않도록 단조 증가 시퀀스를 덧붙인다.
// (기존 `${Date.now()}`는 빠른 연타·붙여넣기 시 id 중복 → React key 경고 +
//  toggle/delete/update가 엉뚱한 항목에 적용되는 버그를 유발했다.)
let seq = 0;

export const makeTaskId = () =>
  `t-${Date.now().toString(36)}-${(seq++).toString(36)}`;

/**
 * 미완료 항목만 드래그로 재정렬하고, 완료 항목은 뒤에 그대로 붙인다.
 * 원본 배열을 변형하지 않고 새 배열을 반환한다(불변).
 * 범위를 벗어난 인덱스는 원본을 그대로 반환한다.
 */
export const reorderActiveTasks = (tasks, sourceIndex, destIndex) => {
  if (!Array.isArray(tasks)) return [];
  const active = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);
  if (
    sourceIndex < 0 ||
    sourceIndex >= active.length ||
    destIndex < 0 ||
    destIndex > active.length
  ) {
    return tasks;
  }
  const [moved] = active.splice(sourceIndex, 1);
  active.splice(destIndex, 0, moved);
  return [...active, ...completed];
};
