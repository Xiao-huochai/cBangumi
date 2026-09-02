import type { Page, Route } from "@playwright/test";

type AuthUser = {
  id: number;
  name: string;
  avatarId: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

type SubjectState = {
  collectionStatus: "DONE" | null;
  ratingScore: number | null;
  commentContent: string | null;
  updatedAt: string;
};

type MockApiOptions = {
  authenticatedUser?: AuthUser | null;
  searchResultCount?: number;
};

export const regularUser: AuthUser = {
  id: 101,
  name: "测试用户",
  avatarId: "",
  isAdmin: false,
  createdAt: "2026-01-01T00:00:00",
  updatedAt: "2026-01-01T00:00:00",
};

export const adminUser: AuthUser = {
  ...regularUser,
  id: 102,
  name: "测试管理员",
  isAdmin: true,
};

export type MockApi = {
  loginPayloads: Array<{ account: string; password: string }>;
  registerPayloads: Array<Record<string, unknown>>;
  stateUpdates: Array<Record<string, unknown>>;
  searchRequests: URL[];
};

const page = <T>(records: T[]) => ({
  records,
  total: records.length,
  page: 1,
  size: 20,
  pages: 1,
  hasPrevious: false,
  hasNext: false,
});

function result<T>(data: T, code = 200, message = "ok") {
  return { code, message, data };
}

async function respond(route: Route, data: unknown, code?: number, message?: string) {
  await route.fulfill({ json: result(data, code, message) });
}

async function readBody(route: Route) {
  return (route.request().postDataJSON() ?? {}) as Record<string, unknown>;
}

export async function mockApi(
  browserPage: Page,
  {
    authenticatedUser = null,
    searchResultCount = 1,
  }: MockApiOptions = {},
): Promise<MockApi> {
  let currentUser = authenticatedUser;
  const searchResults = Array.from({ length: searchResultCount }, (_, index) => ({
    id: index === 0 ? 7 : 1_000 + index,
    type: "GAME",
    name: index === 0 ? "Test Subject" : `Test Subject ${index + 1}`,
    nameCn: index === 0 ? "测试条目" : `测试条目 ${index + 1}`,
    score: 8.6,
    rank: 12 + index,
    date: "2026-01-01",
    summary: `用于端到端测试的条目 ${index + 1}。`,
    coverUrl: "",
  }));
  let subjectState: SubjectState = {
    collectionStatus: null,
    ratingScore: null,
    commentContent: null,
    updatedAt: "2026-01-01T00:00:00",
  };
  const mock: MockApi = {
    loginPayloads: [],
    registerPayloads: [],
    stateUpdates: [],
    searchRequests: [],
  };

  await browserPage.route((url) => url.pathname.startsWith("/api/"), async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname } = url;
    const method = request.method();

    if (method === "GET" && pathname === "/api/auth/me") {
      if (!currentUser) {
        await respond(route, null, 401, "未登录");
        return;
      }
      await respond(route, currentUser);
      return;
    }

    if (method === "POST" && pathname === "/api/auth/login") {
      const body = await readBody(route);
      mock.loginPayloads.push({
        account: String(body.account ?? ""),
        password: String(body.password ?? ""),
      });
      currentUser = { ...regularUser };
      await respond(route, { tokenName: "cbangumi-token", user: currentUser });
      return;
    }

    if (method === "POST" && pathname === "/api/auth/logout") {
      currentUser = null;
      await respond(route, null);
      return;
    }

    if (method === "POST" && pathname === "/api/users") {
      const body = await readBody(route);
      mock.registerPayloads.push(body);
      await respond(route, { ...regularUser, name: body.name ?? regularUser.name });
      return;
    }

    if (method === "GET" && pathname === "/api/articles") {
      await respond(route, page([]));
      return;
    }

    if (method === "GET" && pathname === "/api/search/subjects") {
      mock.searchRequests.push(url);
      const currentPage = Number(url.searchParams.get("page") ?? 1);
      const pageSize = Number(url.searchParams.get("size") ?? 20);
      const start = (currentPage - 1) * pageSize;
      const records = searchResults.slice(start, start + pageSize);
      const pages = Math.ceil(searchResults.length / pageSize);

      await respond(route, {
        records,
        total: searchResults.length,
        page: currentPage,
        size: pageSize,
        pages,
        hasPrevious: currentPage > 1,
        hasNext: currentPage < pages,
      });
      return;
    }

    if (method === "GET" && pathname === "/api/subjects/7") {
      await respond(route, {
        id: 7,
        type: "GAME",
        name: "Test Subject",
        nameCn: "测试条目",
        summary: "用于端到端测试的条目。",
        score: 8.6,
        rank: 12,
        date: "2026-01-01",
        siteScore: 8.6,
        siteScoreCount: 1,
        siteRankScore: 12,
        coverUrl: "",
        tags: [],
      });
      return;
    }

    if (method === "GET" && pathname === "/api/subjects/7/state/me") {
      await respond(route, subjectState);
      return;
    }

    if (method === "PUT" && pathname === "/api/subjects/7/state") {
      const body = await readBody(route);
      mock.stateUpdates.push(body);
      subjectState = {
        collectionStatus: (body.collectionStatus as SubjectState["collectionStatus"]) ?? "DONE",
        ratingScore: (body.ratingScore as number | null) ?? null,
        commentContent: (body.commentContent as string | null) ?? null,
        updatedAt: "2026-01-02T00:00:00",
      };
      await respond(route, subjectState);
      return;
    }

    if (method === "GET" && pathname === "/api/subjects/7/comments") {
      await respond(route, page([]));
      return;
    }

    if (method === "GET" && pathname === "/api/users/101/collections") {
      await respond(route, page([]));
      return;
    }

    if (method === "GET" && pathname === "/api/me/articles") {
      await respond(route, page([]));
      return;
    }

    await respond(route, null, 404, `未处理的测试接口：${method} ${pathname}`);
  });

  return mock;
}
