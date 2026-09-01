import { http, HttpResponse } from "msw";
import { useLocation } from "react-router-dom";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { currentUserQueryKey } from "@/hooks";
import { LoginForm } from "@/views/Login/components/LoginForm";
import { server } from "../mocks/server";
import { createTestWrapper, testUser } from "./test-utils";

function LocationDisplay() {
  const location = useLocation();

  return <output data-testid="location">{location.pathname}</output>;
}

test("登录表单在缺少账号或密码时显示本地校验错误", async () => {
  const user = userEvent.setup();
  const { TestWrapper } = createTestWrapper();

  render(<LoginForm />, { wrapper: TestWrapper });

  await user.click(screen.getByRole("button", { name: "登录" }));
  expect(screen.getByText("请填写手机号或邮箱")).toBeVisible();

  await user.type(screen.getByPlaceholderText("请输入邮箱或手机号"), "user@example.com");
  await user.click(screen.getByRole("button", { name: "登录" }));
  expect(screen.getByText("请输入密码")).toBeVisible();
});

test("登录成功后更新认证态并回到原始页面", async () => {
  const user = userEvent.setup();
  let receivedBody: unknown;
  server.use(
    http.post("http://localhost/api/auth/login", async ({ request }) => {
      receivedBody = await request.json();
      return HttpResponse.json({
        code: 200,
        message: "ok",
        data: { tokenName: "cbangumi-token", user: testUser },
      });
    }),
  );

  const { queryClient, TestWrapper } = createTestWrapper([
    {
      pathname: "/login",
      state: { from: { pathname: "/settings" } },
    },
  ]);

  render(
    <>
      <LoginForm />
      <LocationDisplay />
    </>,
    { wrapper: TestWrapper },
  );

  await user.type(screen.getByPlaceholderText("请输入邮箱或手机号"), "user@example.com");
  await user.type(screen.getByPlaceholderText("请输入密码"), "password123");
  await user.click(screen.getByRole("button", { name: "登录" }));

  await expect.poll(() => screen.getByTestId("location").textContent).toBe("/settings");
  expect(receivedBody).toEqual({ account: "user@example.com", password: "password123" });
  expect(queryClient.getQueryData(currentUserQueryKey)).toEqual(testUser);
});
