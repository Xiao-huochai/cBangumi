import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ChevronDown, Flame, Search } from "lucide-react";

import { getRankList } from "@/api";
import { PageNavBar } from "@/components/PageNavBar";
import { SUBJECT_TYPE_OPTIONS } from "@/constants/subjects";
import type { SubjectSort, SubjectType } from "@/api/request";
import { RankingCard } from "./components/RankingCard";
import { RankingPagination } from "./components/RankingPagination";
import styles from "./index.module.scss";

const PAGE_SIZE = 15;

const META_TAG_OPTIONS: Record<SubjectType, string[]> = {
  ANIME: ["TV", "WEB", "OVA", "剧场版"],
  BOOK: ["小说", "漫画", "画集"],
  MUSIC: [],
  GAME: ["Galgame", "ACT", "RPG", "SLG", "ADV", "STG"],
  REAL: [],
};

type OpenMenu = "category" | "metaTag" | null;
type RankingSort = Extract<SubjectSort, "SITE_RANK" | "FAVORITE_TOTAL">;

function getRankingQueryKey(
  subjectType: SubjectType,
  metaTag: string | undefined,
  sort: RankingSort,
  page: number,
) {
  return [
    "ranking",
    subjectType,
    metaTag ?? "all",
    sort,
    page,
    PAGE_SIZE,
  ] as const;
}

function getRankingQueryFn(
  subjectType: SubjectType,
  metaTag: string | undefined,
  sort: RankingSort,
  page: number,
) {
  return () =>
    getRankList({
      page,
      size: PAGE_SIZE,
      type: subjectType,
      metaTag,
      sort,
      order: "DESC",
    });
}

function RankingView() {
  const queryClient = useQueryClient();
  const [subjectType, setSubjectType] = useState<SubjectType>("GAME");
  const [metaTag, setMetaTag] = useState<string | undefined>("Galgame");
  const [sort, setSort] = useState<RankingSort>("SITE_RANK");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const subjectTypeLabel =
    SUBJECT_TYPE_OPTIONS.find((option) => option.value === subjectType)
      ?.label ?? "分类";
  const metaTagOptions = META_TAG_OPTIONS[subjectType];
  const metaTagLabel = metaTag ?? "全部类型";

  function handleSubjectTypeChange(nextSubjectType: SubjectType) {
    setSubjectType(nextSubjectType);
    setMetaTag(undefined);
    setPage(1);
    setOpenMenu(null);
  }

  function handleMetaTagChange(nextMetaTag?: string) {
    setMetaTag(nextMetaTag);
    setPage(1);
    setOpenMenu(null);
  }

  function handleHotSortClick() {
    setSort((current) =>
      current === "FAVORITE_TOTAL" ? "SITE_RANK" : "FAVORITE_TOTAL",
    );
    setPage(1);
    setOpenMenu(null);
  }

  const { data, isLoading, error } = useQuery({
    queryKey: getRankingQueryKey(subjectType, metaTag, sort, page),
    queryFn: getRankingQueryFn(subjectType, metaTag, sort, page),
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 15,
  });
  const list = data?.records ?? [];
  const hasPrevious = data?.hasPrevious ?? page > 1;
  const hasNext = data?.hasNext ?? false;

  useEffect(() => {
    if (!data?.hasNext) {
      return;
    }

    const maxPrefetchPage =
      data.pages > 0 ? Math.min(page + 2, data.pages) : page + 2;

    for (let nextPage = page + 1; nextPage <= maxPrefetchPage; nextPage += 1) {
      queryClient.prefetchQuery({
        queryKey: getRankingQueryKey(subjectType, metaTag, sort, nextPage),
        queryFn: getRankingQueryFn(subjectType, metaTag, sort, nextPage),
        staleTime: 1000 * 60 * 15,
      });
    }
  }, [
    data?.hasNext,
    data?.pages,
    metaTag,
    page,
    queryClient,
    sort,
    subjectType,
  ]);

  return (
    <main className={styles.page}>
      <PageNavBar
        className={styles.navBar}
        title="排行榜"
        right={
          <Link
            className={styles.searchLink}
            to="/search"
            aria-label="搜索条目"
          >
            <Search size={20} aria-hidden="true" />
          </Link>
        }
      />

      <div className={styles.filters}>
        <div className={styles.filterMenu}>
          <button
            type="button"
            className={styles.filterButton}
            aria-expanded={openMenu === "category"}
            onClick={() =>
              setOpenMenu((current) =>
                current === "category" ? null : "category",
              )
            }
          >
            <span>{subjectTypeLabel}</span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
          {openMenu === "category" && (
            <div className={styles.menuList} role="menu" aria-label="大分类">
              {SUBJECT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={
                    option.value === subjectType
                      ? styles.menuItemActive
                      : styles.menuItem
                  }
                  role="menuitemradio"
                  aria-checked={option.value === subjectType}
                  onClick={() => handleSubjectTypeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.filterMenu}>
          <button
            type="button"
            className={styles.filterButton}
            aria-expanded={openMenu === "metaTag"}
            onClick={() =>
              setOpenMenu((current) =>
                current === "metaTag" ? null : "metaTag",
              )
            }
          >
            <span>{metaTagLabel}</span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
          {openMenu === "metaTag" && (
            <div className={styles.menuList} role="menu" aria-label="类型">
              <button
                type="button"
                className={!metaTag ? styles.menuItemActive : styles.menuItem}
                role="menuitemradio"
                aria-checked={!metaTag}
                onClick={() => handleMetaTagChange()}
              >
                全部类型
              </button>
              {metaTagOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={
                    option === metaTag ? styles.menuItemActive : styles.menuItem
                  }
                  role="menuitemradio"
                  aria-checked={option === metaTag}
                  onClick={() => handleMetaTagChange(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className={
            sort === "FAVORITE_TOTAL"
              ? styles.sortButtonActive
              : styles.sortButton
          }
          aria-pressed={sort === "FAVORITE_TOTAL"}
          onClick={handleHotSortClick}
        >
          <Flame size={16} aria-hidden="true" />
          <span>热度排序</span>
        </button>
      </div>

      {isLoading && <div>加载中...</div>}
      {error && <div>{error.message}</div>}
      <div className={styles.grid}>
        {list.map((item) => (
          <RankingCard
            key={item.id}
            subjectId={item.id}
            title={item.title || item.nameCn || item.name || String(item.id)}
            coverUrl={item.coverUrl}
            score={item.siteScore}
            rank={item.siteRank ?? item.rank ?? 0}
          />
        ))}
      </div>
      <RankingPagination
        page={page}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
        onNext={() => setPage((current) => current + 1)}
      />
    </main>
  );
}

export default RankingView;
