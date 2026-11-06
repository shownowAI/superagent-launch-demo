export function filterTasks(tasks, { search = '', status = 'all', priority = 'all', onlyPending = false } = {}) {
  const query = search.trim().toLocaleLowerCase();
  return tasks.filter(task =>
    (!query || `${task.id} ${task.title}`.toLocaleLowerCase().includes(query)) &&
    (status === 'all' || task.status === status) &&
    (priority === 'all' || task.priority === priority) &&
    (!onlyPending || task.status !== 'done') // 只看待处理：仅排除已完成，保留其他状态
  );
}

// 生成发布清单：与「只看待处理」一致，仅取未完成（status !== 'done'）的事项
export function buildReleaseChecklist(tasks) {
  const pending = tasks.filter(task => task.status !== 'done');
  if (pending.length === 0) return '已经全部准备好了，可以发布';
  const lines = pending.map(task => `[ ] ${task.id} ${task.title}（截止：${task.deadline}）`);
  return [`发布清单 · 待完成 ${pending.length} 项`, ...lines].join('\n');
}

export function updateTaskStatus(tasks, id, status) {
  if (!['todo', 'in-progress', 'review', 'done'].includes(status)) throw new Error('任务状态不正确');
  return tasks.map(task => task.id === id ? { ...task, status } : task);
}
