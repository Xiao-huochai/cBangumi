import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

import { getRankList } from "@/api";
import type { SubjectType } from "@/api/request";
import { RankingCard } from "./components/RankingCard";
import styles from "./index.module.scss";

const SUBJECT_TYPE_OPTIONS: Array<{ label: string; value: SubjectType }> = [
  { label: "动画", value: "ANIME" },
  { label: "书籍", value: "BOOK" },
  { label: "音乐", value: "MUSIC" },
  { label: "游戏", value: "GAME" },
  { label: "三次元", value: "REAL" },
];

const META_TAG_OPTIONS: Record<SubjectType, string[]> = {
  ANIME: ["TV", "WEB", "OVA", "剧场版"],
  BOOK: ["小说", "漫画", "画集"],
  MUSIC: [],
  GAME: ["Galgame", "ACT", "RPG", "SLG", "ADV", "STG"],
  REAL: [],
};

type OpenMenu = "category" | "metaTag" | null;

function RankingView() {
  const [subjectType, setSubjectType] = useState<SubjectType>("ANIME");
  const [metaTag, setMetaTag] = useState<string>();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const subjectTypeLabel =
    SUBJECT_TYPE_OPTIONS.find((option) => option.value === subjectType)?.label ?? "分类";
  const metaTagOptions = META_TAG_OPTIONS[subjectType];
  const metaTagLabel = metaTag ?? "全部类型";

  function handleSubjectTypeChange(nextSubjectType: SubjectType) {
    setSubjectType(nextSubjectType);
    setMetaTag(undefined);
    setOpenMenu(null);
  }

  const {
    data: list = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ranking", subjectType, metaTag ?? "all", 1, 20],
    queryFn: async () => {
      const data = await getRankList({
        page: 1,
        size: 20,
        type: subjectType,
        metaTag,
      });

      return data.records;
    },
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 15,
  });

  return (
    <main className={styles.page}>
      <h1>排行榜</h1>
      <div className={styles.filters}>
        <div className={styles.filterMenu}>
          <button
            type="button"
            className={styles.filterButton}
            aria-expanded={openMenu === "category"}
            onClick={() =>
              setOpenMenu((current) => (current === "category" ? null : "category"))
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
                    option.value === subjectType ? styles.menuItemActive : styles.menuItem
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
              setOpenMenu((current) => (current === "metaTag" ? null : "metaTag"))
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
                onClick={() => {
                  setMetaTag(undefined);
                  setOpenMenu(null);
                }}
              >
                全部类型
              </button>
              {metaTagOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={option === metaTag ? styles.menuItemActive : styles.menuItem}
                  role="menuitemradio"
                  aria-checked={option === metaTag}
                  onClick={() => {
                    setMetaTag(option);
                    setOpenMenu(null);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
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
    </main>
  );
}

export default RankingView;
