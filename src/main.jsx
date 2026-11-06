import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, ArrowUp, Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Circle, CircleDashed, ClipboardList, Command, Copy, ListTodo, PanelLeft, Search, Timer, X } from 'lucide-react';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Checkbox } from './components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { initialTasks } from './seed-data.mjs';
import { buildReleaseChecklist, filterTasks, updateTaskStatus } from './task-filter.mjs';
import './styles.css';

const statuses = [
  { value: 'todo', label: '待开始', icon: Circle },
  { value: 'in-progress', label: '进行中', icon: Timer },
  { value: 'review', label: '待确认', icon: CircleDashed },
  { value: 'done', label: '已完成', icon: CheckCircle },
];
const priorities = [
  { value: 'high', label: '优先', icon: ArrowUp },
  { value: 'medium', label: '常规', icon: ArrowRight },
  { value: 'low', label: '从容', icon: ArrowDown },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [onlyPending, setOnlyPending] = useState(false);
  const [selected, setSelected] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [copied, setCopied] = useState(false);
  const checklistRef = useRef(null);
  const checklistText = buildReleaseChecklist(tasks);
  const copyChecklist = async () => {
    try {
      await navigator.clipboard.writeText(checklistText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      if (checklistRef.current) {
        const range = document.createRange();
        range.selectNodeContents(checklistRef.current);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };
  const visible = filterTasks(tasks, { search, status, priority, onlyPending });
  const done = tasks.filter(task => task.status === 'done').length;
  const hasFilters = search || status !== 'all' || priority !== 'all' || onlyPending;
  const reset = () => { setSearch(''); setStatus('all'); setPriority('all'); setOnlyPending(false); };
  const selectTask = (id, checked) => setSelected(current => checked ? [...new Set([...current, id])] : current.filter(item => item !== id));
  const showAll = () => { reset(); setSidebarOpen(false); };

  return (
    <div className={`desk-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className='desk-sidebar' aria-label='工作空间导航'>
        <div className='desk-brand'><span className='brand-icon'><Command size={19} /></span><div>Release Desk<small>产品发布工作台</small></div></div>
        <div className='desk-workspace'><span className='workspace-icon'>AN</span><div>Agent Notes<small>团队工作空间</small></div><ChevronDown size={14} /></div>
        <div className='nav-label'>工作空间</div>
        <nav>
          <button className={`desk-nav ${!onlyPending && status !== 'done' ? 'active' : ''}`} onClick={showAll}><ListTodo size={16} />发布任务<span>{tasks.length}</span></button>
          <button className={`desk-nav ${onlyPending ? 'active' : ''}`} onClick={() => { setStatus('all'); setOnlyPending(true); setSidebarOpen(false); }}><CircleDashed size={16} />待处理</button>
          <button className={`desk-nav ${status === 'done' ? 'active' : ''}`} onClick={() => { setOnlyPending(false); setStatus('done'); setSidebarOpen(false); }}><CheckCircle size={16} />已完成<span>{done}</span></button>
        </nav>
        <div className='desk-sidebar-note'>每一步准备，都在这里。</div>
        <div className='desk-user'><Avatar><AvatarFallback>林</AvatarFallback></Avatar><div>林舟<small>独立开发者</small></div><ChevronDown size={14} /></div>
      </aside>
      {sidebarOpen && <button className='sidebar-backdrop' aria-label='收起导航' onClick={() => setSidebarOpen(false)} />}
      <main id='tasks' className='desk-main'>
        <header className='desk-header'><Button variant='ghost' size='icon' aria-label='展开导航' onClick={() => setSidebarOpen(open => !open)}><PanelLeft size={17} /></Button><span className='header-divider' /><div className='desk-breadcrumb'>Agent Notes<span>/</span><strong>发布任务</strong></div><Avatar className='header-avatar'><AvatarFallback>林</AvatarFallback></Avatar></header>
        <section className='desk-content'>
          <div className='desk-title-row'><div><div className='desk-eyebrow'>AGENT NOTES / 1.0 发布</div><h1>发布任务</h1><p>从第一张截图，到正式发布。把每件准备工作，向前推进一步。</p></div><Badge variant='outline' className='release-progress'><span className='progress-dot' />{done} / {tasks.length} 已完成</Badge></div>
          <div className='desk-toolbar' role='toolbar' aria-label='任务筛选'>
            <div className='task-search'><Search size={15} /><input aria-label='搜索任务' placeholder='搜索任务名称或编号...' value={search} onChange={e => setSearch(e.target.value)} />{search && <button aria-label='清空搜索' onClick={() => setSearch('')}><X size={13} /></button>}</div>
            <Button size='sm' variant={onlyPending ? 'default' : 'outline'} aria-pressed={onlyPending} onClick={() => setOnlyPending(value => !value)}><CircleDashed size={15} />只看待处理{onlyPending && <Check size={14} />}</Button>
            <Button size='sm' variant={showChecklist ? 'default' : 'outline'} aria-pressed={showChecklist} onClick={() => setShowChecklist(value => !value)}><ClipboardList size={15} />生成发布清单{showChecklist && <Check size={14} />}</Button>
            <label className='toolbar-select'><span>状态</span><select aria-label='按状态筛选' value={status} onChange={e => setStatus(e.target.value)}><option value='all'>全部状态</option>{statuses.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select><ChevronDown size={13} /></label>
            <label className='toolbar-select'><span>优先级</span><select aria-label='按优先级筛选' value={priority} onChange={e => setPriority(e.target.value)}><option value='all'>全部优先级</option>{priorities.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select><ChevronDown size={13} /></label>
            {hasFilters && <Button size='sm' variant='ghost' onClick={reset}>重置<X size={13} /></Button>}
          </div>
          {showChecklist && (
            <div className='checklist-panel' role='region' aria-label='发布清单'>
              <div className='checklist-head'>
                <div className='checklist-title'><ClipboardList size={15} />发布清单</div>
                <div className='checklist-actions'>
                  <Button size='sm' variant='ghost' onClick={copyChecklist}><Copy size={14} />{copied ? '已复制' : '复制'}</Button>
                  <Button size='sm' variant='ghost' aria-label='收起发布清单' onClick={() => setShowChecklist(false)}><X size={14} /></Button>
                </div>
              </div>
              <pre ref={checklistRef} className='checklist-text'>{checklistText}</pre>
            </div>
          )}
          <div className='task-table-frame'>
            <Table className='task-table' aria-label='产品发布任务'>
              <TableHeader><TableRow><TableHead className='selection-cell'><Checkbox aria-label='选择当前显示的全部任务' checked={visible.length > 0 && visible.every(task => selected.includes(task.id))} onCheckedChange={checked => setSelected(current => checked ? [...new Set([...current, ...visible.map(task => task.id)])] : current.filter(id => !visible.some(task => task.id === id)))} /></TableHead><TableHead>任务编号</TableHead><TableHead className='task-title-head'>事项</TableHead><TableHead>状态</TableHead><TableHead>截止</TableHead><TableHead>优先级</TableHead></TableRow></TableHeader>
              <TableBody>{visible.length ? visible.map(task => {
                const currentStatus = statuses.find(item => item.value === task.status);
                const currentPriority = priorities.find(item => item.value === task.priority);
                return <TableRow key={task.id} data-state={selected.includes(task.id) ? 'selected' : undefined} data-task-id={task.id}><TableCell className='selection-cell'><Checkbox aria-label={`选择${task.title}`} checked={selected.includes(task.id)} onCheckedChange={checked => selectTask(task.id, checked)} /></TableCell><TableCell className='task-id'>{task.id}</TableCell><TableCell><div className='task-title'><Badge variant='outline'>{task.label}</Badge><span>{task.title}</span></div></TableCell><TableCell><div className={`task-status status-${task.status}`}><currentStatus.icon size={16} /><select aria-label={`${task.title}的状态`} value={task.status} onChange={e => setTasks(current => updateTaskStatus(current, task.id, e.target.value))}>{statuses.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div></TableCell><TableCell className='task-deadline'>{task.deadline}</TableCell><TableCell><div className='task-priority'><currentPriority.icon size={15} /><span>{currentPriority.label}</span></div></TableCell></TableRow>;
              }) : <TableRow><TableCell colSpan={6} className='table-empty'>没有符合条件的任务。</TableCell></TableRow>}</TableBody>
            </Table>
          </div>
          <div className='table-footer'><span>已选 {selected.filter(id => visible.some(task => task.id === id)).length} / {visible.length} 项</span><div><span>共 {visible.length} 项任务</span><span className='pagination-label'>第 1 / 1 页</span><Button variant='outline' size='icon' aria-label='上一页' disabled><ChevronLeft size={15} /></Button><Button variant='outline' size='icon' aria-label='下一页' disabled><ChevronRight size={15} /></Button></div></div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
