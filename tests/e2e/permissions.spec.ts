import { expect, test } from "@playwright/test";

import { adminUser, mockApi, regularUser } from "./fixtures";

test("普通用户不能进入文章管理", async ({ page }) => {
  await mockApi(page, { authenticatedUser: regularUser });

  await page.goto("/articles/manage");

  await expect(page).toHaveURL(/\/articles$/);
  await expect(page.getByRole("heading", { name: "文章" })).toBeVisible();
  await expect(page.getByLabel("文章管理")).toHaveCount(0);
});

test("管理员可以访问文章管理并创建文章", async ({ page }) => {
  await mockApi(page, { authenticatedUser: adminUser });

  await page.goto("/articles/manage");

  await expect(page).toHaveURL(/\/articles\/manage$/);
  await expect(page.getByRole("heading", { name: "文章管理" })).toBeVisible();
  await expect(page.getByRole("link", { name: "新建" })).toHaveAttribute(
    "href",
    "/articles/new",
  );
});
