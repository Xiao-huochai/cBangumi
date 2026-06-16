import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

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

function RankingView() {
  const [subjectType, setSubjectType] = useState<SubjectType>("ANIME");

  const {
    data: list = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ranking", subjectType, 1, 20],
    queryFn: async () => {
      const data = await getRankList({
        page: 1,
        size: 20,
        type: subjectType,
      });

      return data.records;
    },
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 15,
  });

  return (
    <main className={styles.page}>
      <h1>排行榜</h1>
      <div
        className={styles.categoryTabs}
        role="tablist"
        aria-label="排行榜分类"
      >
        {SUBJECT_TYPE_OPTIONS.map((option) => {
          const isActive = option.value === subjectType;

          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={isActive ? styles.categoryTabActive : styles.categoryTab}
              onClick={() => setSubjectType(option.value)}
            >
              {option.label}
            </button>
          );
        })}
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
