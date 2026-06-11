import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMyCollections } from "@/api";
import type { SubjectType } from "@/api/request";
import { useAuthStore } from "@/store";
import { CollectionCard } from "./components/CollectionCard";
import { UserCard } from "./components/UserCard";
import styles from "./index.module.scss";

type CollectionTypeFilter = "ALL" | SubjectType;

const collectionTypeOptions: Array<{
  value: CollectionTypeFilter;
  label: string;
}> = [
  { value: "ALL", label: "全部" },
  { value: "ANIME", label: "动画" },
  { value: "BOOK", label: "书籍" },
  { value: "MUSIC", label: "音乐" },
  { value: "GAME", label: "游戏" },
  { value: "REAL", label: "三次元" },
];

function ProfileView() {
  const { user } = useAuthStore();
  const [activeType, setActiveType] = useState<CollectionTypeFilter>("ANIME");
  const {
    data: collections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-collections", user?.id, activeType],
    queryFn: async () => {
      const data = await getMyCollections({
        page: 1,
        size: 20,
        type: activeType === "ALL" ? undefined : activeType,
      });

      return data.records;
    },
    enabled: Boolean(user),
  });

  if (!user) {
    return null;
  }

  return (
    <main className={styles.page}>
      <UserCard name={user.name} avatarId={user.avatarId} />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>收藏预览</h2>
          <span className={styles.sectionMeta}>{collections.length} 项</span>
        </div>

        <div className={styles.typeTabs} role="tablist" aria-label="收藏条目类型">
          {collectionTypeOptions.map((option) => {
            const isActive = option.value === activeType;

            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={isActive ? styles.typeTabActive : styles.typeTab}
                onClick={() => setActiveType(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {isLoading ? <div className={styles.state}>加载中...</div> : null}
        {error ? <div className={styles.state}>{error.message}</div> : null}
        {!isLoading && !error && collections.length === 0 ? (
          <div className={styles.state}>还没有收藏记录</div>
        ) : null}

        <div className={styles.list}>
          {collections.map((item) => (
            <CollectionCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default ProfileView;
