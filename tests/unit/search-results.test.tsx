import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";

import type { SubjectSearchItem } from "@/api";
import { SearchResults } from "@/views/Search/components/SearchResults";

const virtualizerMocks = vi.hoisted(() => ({
  measureElement: vi.fn(),
  useWindowVirtualizer: vi.fn(),
}));

vi.mock("@tanstack/react-virtual", () => ({
  useWindowVirtualizer: virtualizerMocks.useWindowVirtualizer,
}));

function createRecords(count: number): SubjectSearchItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    type: "GAME",
    nameCn: `条目 ${index}`,
    coverUrl: `/covers/${index}.jpg`,
  }));
}

beforeEach(() => {
  virtualizerMocks.useWindowVirtualizer.mockImplementation((options) => ({
    getTotalSize: () => 8_090,
    getVirtualItems: () => [
      { index: 0, key: 1, size: 152, start: options.scrollMargin },
      { index: 20, key: 21, size: 152, start: options.scrollMargin + 3_240 },
    ],
    measureElement: virtualizerMocks.measureElement,
    options,
  }));
});

test("搜索结果只渲染虚拟窗口中的条目", () => {
  const records = createRecords(50);

  render(
    <MemoryRouter>
      <SearchResults
        records={records}
        total={50}
        isLoading={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        hasSubmittedSearch
        onLoadMore={vi.fn()}
      />
    </MemoryRouter>,
  );

  expect(virtualizerMocks.useWindowVirtualizer).toHaveBeenCalledWith(
    expect.objectContaining({
      count: 50,
      enabled: true,
      gap: 10,
      overscan: 6,
    }),
  );
  expect(screen.getByRole("list", { name: "搜索结果" })).toHaveStyle({
    height: "8090px",
  });
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
  expect(screen.getByText("条目 0")).toBeVisible();
  expect(screen.getByText("条目 20")).toBeVisible();
  expect(screen.queryByText("条目 10")).not.toBeInTheDocument();
  expect(screen.getByRole("img", { name: "条目 0" })).toHaveAttribute(
    "loading",
    "lazy",
  );
});
