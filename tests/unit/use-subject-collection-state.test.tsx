import { act, renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";

import useSubjectCollectionState from "@/views/SubjectDetail/hooks/useSubjectCollectionState";
import { server } from "../mocks/server";
import { createTestWrapper, testUser } from "./test-utils";

test("收藏状态保存评分与短评后更新本地状态", async () => {
  let receivedBody: unknown;
  server.use(
    http.get("http://localhost/api/subjects/7/state/me", () =>
      HttpResponse.json({
        code: 200,
        message: "ok",
        data: {
          collectionStatus: null,
          ratingScore: null,
          commentContent: null,
          updatedAt: "2026-01-01T00:00:00",
        },
      }),
    ),
    http.put("http://localhost/api/subjects/7/state", async ({ request }) => {
      receivedBody = await request.json();
      return HttpResponse.json({
        code: 200,
        message: "ok",
        data: {
          collectionStatus: "DONE",
          ratingScore: 7,
          commentContent: "值得反复体验。",
          updatedAt: "2026-01-02T00:00:00",
        },
      });
    }),
  );
  const { TestWrapper } = createTestWrapper(["/subjects/7"], testUser);
  const { result } = renderHook(
    () => useSubjectCollectionState({ invalidSubjectId: false, subjectId: 7 }),
    { wrapper: TestWrapper },
  );

  await waitFor(() => expect(result.current.isSubjectStateLoading).toBe(false));
  act(() => {
    result.current.openCollectionModal();
    result.current.setDraftRatingScore(7);
    result.current.setDraftCommentContent(" 值得反复体验。 ");
  });
  expect(result.current.isCollectionModalOpen).toBe(true);

  act(() => {
    result.current.saveCollection();
  });

  await waitFor(() => expect(result.current.isCollectionModalOpen).toBe(false));
  expect(receivedBody).toEqual({
    collectionStatus: "DONE",
    ratingScore: 7,
    commentContent: "值得反复体验。",
  });
  expect(result.current.savedRatingScore).toBe(7);
  expect(result.current.isCollected).toBe(true);
});
