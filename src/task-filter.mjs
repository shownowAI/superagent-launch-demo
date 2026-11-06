export function filterTasks(tasks, { search = '', status = 'all', priority = 'all', onlyPending = false } = {}) {
  const query = search.trim().toLocaleLowerCase();
  return tasks.filter(task =>
    (!query || `${task.id} ${task.title}`.toLocaleLowerCase().includes(query)) &&
    (status === 'all' || task.status === status) &&
    (priority === 'all' || task.priority === priority) &&
    (!onlyPending || task.status !== 'done') // 只看待处理：仅排除已完成，保留其他状态
  );
}

export function updateTaskStatus(tasks, id, status) {
  if (!['todo', 'in-progress', 'review', 'done'].includes(status)) throw new Error('任务状态不正确');
  return tasks.map(task => task.id === id ? { ...task, status } : task);
}
