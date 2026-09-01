import { MemoryRouter } from "react-router-dom";
import { expect, test, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RegisterForm } from "@/views/Register/components/RegisterForm";
import { resetAuth } from "./test-utils";

beforeEach(() => {
  resetAuth();
});

test("注册表单会阻止无联系方式、弱密码与不一致密码", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>,
  );

  await user.click(screen.getByRole("button", { name: "注册并登录" }));
  expect(screen.getByText("请填写昵称")).toBeVisible();

  await user.type(screen.getByPlaceholderText("请输入昵称"), "新用户");
  await user.click(screen.getByRole("button", { name: "注册并登录" }));
  expect(screen.getByText("请至少填写手机号或邮箱")).toBeVisible();

  await user.type(screen.getByPlaceholderText("请输入邮箱"), "user@example.com");
  await user.type(screen.getByPlaceholderText("至少 6 位"), "password123");
  await user.type(screen.getByPlaceholderText("再次输入密码"), "different123");
  await user.click(screen.getByRole("button", { name: "注册并登录" }));
  expect(screen.getByText("两次输入的密码不一致")).toBeVisible();
});
