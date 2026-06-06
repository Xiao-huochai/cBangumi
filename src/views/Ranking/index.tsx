import { useEffect, useState } from "react";

import { getRankList } from "@/api";
import type { RankItem } from "@/api/request";
import { RankingCard } from "./components/RankingCard";
import styles from "./index.module.scss";

function RankingView() {
  const [list, setList] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRankList() {
      setLoading(true);
      setError("");

      try {
        const data = await getRankList({
          type: "ANIME",
        });

        setList(data.records);
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : "请求失败",
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchRankList();
  }, []);

  return (
    <main className={styles.page}>
      <h1>排行榜</h1>
      {loading && <div>加载中...</div>}
      {error && <div>{error}</div>}
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
