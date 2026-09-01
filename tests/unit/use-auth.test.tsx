import { act, renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";

import {
  currentUserQueryKey,
  useAuth,
  useSignOutMutation,
} from "@/hooks";
import { server } from "../mocks/server";
import { createTestWrapper, testUser } from "./test-utils";

test("当前用户接口返回 401 时解析为匿名状态", async () => {
  server.use(
    http.get("http://localhost/api/auth/me", () =>
      HttpResponse.json({
        code: 401,
        message: "未登录",
        data: null,
      }),
    ),
  );
  const { TestWrapper } = createTestWrapper();
  const { result } = renderHook(() => useAuth(), { wrapper: TestWrapper });

  await waitFor(() => expect(result.current.initialized).toBe(true));

  expect(result.current.user).toBeNull();
  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.error).toBeNull();
});

test("退出登录后清除业务缓存并保留匿名认证状态", async () => {
  server.use(
    http.post("http://localhost/api/auth/logout", () =>
      HttpResponse.json({
        code: 200,
        message: "ok",
        data: null,
      }),
    ),
  );
  const { queryClient, TestWrapper } = createTestWrapper(["/settings"], testUser);
  queryClient.setQueryData(["my-collections", testUser.id], ["cached"]);
  const { result } = renderHook(() => useSignOutMutation(), {
    wrapper: TestWrapper,
  });

  await act(async () => {
    await result.current.mutateAsync();
  });

  expect(queryClient.getQueryData(currentUserQueryKey)).toBeNull();
  expect(queryClient.getQueryData(["my-collections", testUser.id])).toBeUndefined();
});
