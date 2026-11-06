# Launch Demo · 产品发布工作台

这是 DeepSeek SuperAgent 教程的公开示例，拟用于 `superagent-launch-demo`。界面来自 [Shadcn Admin](https://github.com/satnaing/shadcn-admin) 的 Tasks 页面，按 MIT 许可提取基础组件，并适配为六项中文产品发布任务。

## 先体验一个真实可复现的问题

你准备发布 Agent Notes 1.0，落地页、截图、演示视频等事项都列在工作台里。

1. 点击“只看待处理”。
2. 检查表格，已经完成的“GitHub 项目”仍然出现。
3. 这就是要交给 SuperAgent 修复的问题：只显示还没完成的任务，搜索、状态与优先级筛选仍应正常。

这是教学副本故意保留的问题，不代表上游 Shadcn Admin 存在同样的缺陷。账号 A 发任务，SuperAgent 用账号 B 修复并交回 PR，等待人工确认。

## 在本机打开

需要 Node.js 22.12 或更高版本：

```sh
npm ci
npm run dev
```

打开终端显示的本机地址。页面只有前端，不需要服务器密码、模型密钥、数据库或其他账号。任务状态只在当前页面内变化，刷新会恢复示例数据。

## 检查

```sh
npm test
npm run build
npm run reproduce
```

- `npm test` 验证搜索、组合筛选和单项状态修改，初始版本 3/3 通过。
- `npm run build` 生成可部署的静态页面。
- `npm run reproduce` 单独复现“只看待处理”仍出现已完成事项，初始版本应失败；修复后应通过。它不替代修复时补充的回归测试。

## 来源与许可

固定上游提交：`e16c87f213a5ba5e45964e9b67c792105ec74d26`。

- `src/components/ui/` 的 Table、Button、Badge、Checkbox、Avatar 原样来自该版本。
- `src/theme.css` 原样复用该版本的中性色主题和 Tailwind 映射。
- `src/main.jsx` 沿用原 Tasks 的标题、工具条、任务表格和侧栏结构，仅做单页与中文场景适配。
- 为这个示例移除了登录、路由、多页面、删除和导入操作，任务列表只展示事项、状态、截止时间和优先级。侧栏中的林舟为模拟人物。未预先添加发布清单功能。
- 原始相关文件与完整许可保留于 `sources/shadcn-admin/`，逐文件校验值及改动范围见 `docs/上游来源锁定.json`。

Copyright (c) 2024 Sat Naing。完整条款见 `LICENSE`。
