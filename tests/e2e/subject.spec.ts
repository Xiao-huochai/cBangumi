import { expect, test } from "@playwright/test";

import { mockApi, regularUser } from "./fixtures";

test("用户可搜索条目并进入详情页", async ({ page }) => {
  const api = await mockApi(page);

  await page.goto("/search");
  await page.getByRole("searchbox", { name: "搜索条目" }).fill("测试");
  await page.getByRole("button", { name: "搜索", exact: true }).click();

  await expect(page.getByText("找到 1 个结果")).toBeVisible();
  await page.getByRole("link", { name: /测试条目/ }).click();

  await expect(page).toHaveURL(/\/subjects\/7$/);
  await expect(page.getByRole("heading", { name: "测试条目" })).toBeVisible();
  await expect(api.searchRequests[0]?.searchParams.get("keyword")).toBe("测试");
  await expect(api.searchRequests[0]?.searchParams.get("type")).toBe("GAME");
});

test("登录用户可收藏、评分并写短评", async ({ page }) => {
  const api = await mockApi(page, { authenticatedUser: regularUser });

  await page.goto("/subjects/7");
  await page.getByRole("button", { name: "未收藏" }).click();
  await expect(page.getByRole("dialog", { name: "测试条目" })).toBeVisible();
  await page.getByRole("button", { name: "评分 7 到 8 分" }).click();
  await page.getByPlaceholder("写点自己的感受").fill("值得反复体验。");
  await page.getByRole("button", { name: "保存收藏" }).click();

  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(api.stateUpdates).toEqual([
    {
      collectionStatus: "DONE",
      ratingScore: 7,
      commentContent: "值得反复体验。",
    },
  ]);
});
