# 前端测试

## 命令

```bash
pnpm test:e2e
pnpm test:e2e:ui
pnpm test:e2e:report
pnpm test:unit
pnpm test:unit:watch
```

首次运行 Playwright 前，请安装 Chromium：

```bash
pnpm exec playwright install chromium
```

默认测试会启动 Vite，并在浏览器层拦截 `/api/**` 请求，使用固定的响应数据。这样可重复验证前端的路由、表单、认证状态、权限与页面交互，且不会写入 MySQL、Redis 或生产环境。

## 单元与组件测试

`pnpm test:unit` 使用 Vitest、React Testing Library、jsdom 和 MSW。测试会在内存 DOM 中执行，通过 MSW 拦截 HTTP 请求，重点验证表单的本地校验、hooks 的请求参数与成功后的状态更新。它不启动 Vite，也不会连接真实后端。

## 当前覆盖

- 游客访问个人页时的登录跳转。
- 登录后的原地址回跳，以及注册后的自动登录。
- 条目搜索到详情页。
- 登录用户的收藏、评分和短评保存。
- 普通用户与管理员的文章管理权限。

## 边界

这些是前端 E2E 测试，不会验证真实 Cookie、CORS、Java API、MySQL 或 Redis。需要验证完整链路时，应另建由 `E2E_BASE_URL` 显式指向的隔离环境，并采用独立数据库、Redis、测试账户及可重置的种子数据；绝不能指向生产环境。
