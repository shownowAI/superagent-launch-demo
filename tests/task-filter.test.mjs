import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTasks, updateTaskStatus } from '../src/task-filter.mjs';
import { initialTasks } from '../src/seed-data.mjs';

test('搜索能匹配任务编号和名称，不改变输入', () => {
  const before = structuredClone(initialTasks);
  assert.deepEqual(filterTasks(initialTasks, { search: ' rel-003 ' }).map(t => t.title), ['演示视频']);
  assert.deepEqual(filterTasks(initialTasks, { search: '产品' }).map(t => t.id), ['REL-001', 'REL-002']);
  assert.deepEqual(initialTasks, before);
});

test('状态与优先级筛选同时生效', () => {
  assert.deepEqual(filterTasks(initialTasks, { status: 'in-progress', priority: 'high' }).map(t => t.id), ['REL-003']);
  assert.deepEqual(filterTasks(initialTasks, { status: 'todo', priority: 'low' }), []);
});

test('更新一项状态时，其他任务保持原样', () => {
  const updated = updateTaskStatus(initialTasks, 'REL-003', 'done');
  assert.equal(updated.find(t => t.id === 'REL-003').status, 'done');
  assert.equal(initialTasks.find(t => t.id === 'REL-003').status, 'in-progress');
  assert.deepEqual(updated.filter(t => t.id !== 'REL-003'), initialTasks.filter(t => t.id !== 'REL-003'));
  assert.throws(() => updateTaskStatus(initialTasks, 'REL-003', 'unknown'), /任务状态不正确/);
});
