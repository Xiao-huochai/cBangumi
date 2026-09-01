import { act, renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";

import { useSubjectSearch } from "@/views/Search/hooks/useSubjectSearch";
import { server } from "../mocks/server";
import { createTestWrapper } from "./test-utils";

test("搜索会忽略首尾空白并带上默认分类和模式", async () => {
  const requestedUrls: URL[] = [];
  server.use(
    http.get("http://localhost/api/search/subjects", ({ request }) => {
      requestedUrls.push(new URL(request.url));
      return HttpResponse.json({
        code: 200,
        message: "ok",
        data: {
          records: [{
            id: 7,
            type: "GAME",
            name: "Test Subject",
            nameCn: "测试条目",
            score: 8.6,
            rank: 12,
            date: "2026-01-01",
            summary: "用于单测的条目。",
            coverUrl: "",
          }],
          total: 1,
          page: 1,
          size: 20,
          pages: 1,
          hasPrevious: false,
          hasNext: false,
        },
      });
    }),
  );
  const { TestWrapper } = createTestWrapper();
  const { result } = renderHook(() => useSubjectSearch(), { wrapper: TestWrapper });

  act(() => {
    result.current.setKeywordInput("  测试  ");
  });
  act(() => {
    result.current.submitSearch();
  });

  await waitFor(() => expect(result.current.query.data?.pages[0].records).toHaveLength(1));
  expect(result.current.submittedSearch).toEqual({
    keyword: "测试",
    type: "GAME",
    mode: "FUZZY",
  });
  expect(requestedUrls).toHaveLength(1);
  const requestedUrl = requestedUrls[0];
  expect(requestedUrl.searchParams.get("keyword")).toBe("测试");
  expect(requestedUrl.searchParams.get("type")).toBe("GAME");
  expect(requestedUrl.searchParams.get("mode")).toBe("FUZZY");
  expect(requestedUrl.searchParams.get("page")).toBe("1");
});
