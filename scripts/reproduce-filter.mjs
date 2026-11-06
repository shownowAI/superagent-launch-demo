import assert from 'node:assert/strict';
import { filterTasks } from '../src/task-filter.mjs';
import { initialTasks } from '../src/seed-data.mjs';

const visible = filterTasks(initialTasks, { onlyPending: true });
console.log('点击“只看待处理”后显示：', visible.map(t => `${t.title}（${t.status}）`).join('、'));
assert.equal(visible.some(t => t.status === 'done'), false, '只看待处理时，不应出现已完成的 GitHub 项目');
