import { useQuery } from "@tanstack/react-query";

import { getRankList } from "@/api";
import { RankingCard } from "./components/RankingCard";
import styles from "./index.module.scss";

function RankingView() {
  const {
    data: list = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ranking", "ANIME", 1, 20],
    queryFn: async () => {
      const data = await getRankList({
        page: 1,
        size: 20,
        type: "ANIME",
      });

      return data.records;
    },
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 15,
  });

  return (
    <main className={styles.page}>
      <h1>排行榜</h1>
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
