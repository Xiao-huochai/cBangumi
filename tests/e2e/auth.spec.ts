import { expect, test } from "@playwright/test";

import { mockApi } from "./fixtures";

test("游客访问个人页会跳转至登录页", async ({ page }) => {
  await mockApi(page);

  await page.goto("/profile");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("button", { name: "登录" })).toBeVisible();
});

test("登录后回到原本请求的页面", async ({ page }) => {
  const api = await mockApi(page);

  await page.goto("/profile");
  await page.getByPlaceholder("请输入邮箱或手机号").fill("e2e@example.com");
  await page.getByPlaceholder("请输入密码").fill("password123");
  await page.getByRole("button", { name: "登录" }).click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole("heading", { name: "测试用户" })).toBeVisible();
  await expect(api.loginPayloads).toEqual([
    { account: "e2e@example.com", password: "password123" },
  ]);
});

test("注册成功后自动登录并进入个人页", async ({ page }) => {
  const api = await mockApi(page);

  await page.goto("/register");
  await page.getByPlaceholder("请输入昵称").fill("新用户");
  await page.getByPlaceholder("请输入手机号").fill("13800138000");
  await page.getByPlaceholder("至少 6 位").fill("password123");
  await page.getByPlaceholder("再次输入密码").fill("password123");
  await page.getByRole("button", { name: "注册并登录" }).click();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(api.registerPayloads).toHaveLength(1);
  await expect(api.loginPayloads).toEqual([
    { account: "13800138000", password: "password123" },
  ]);
});
