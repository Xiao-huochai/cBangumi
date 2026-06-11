import { useQuery } from "@tanstack/react-query";

import { getMyCollections } from "@/api";
import { useAuthStore } from "@/store";
import { CollectionCard } from "./components/CollectionCard";
import { UserCard } from "./components/UserCard";
import styles from "./index.module.scss";

function ProfileView() {
  const { user } = useAuthStore();
  const {
    data: collections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-collections", user?.id, "GAME"],
    queryFn: async () => {
      const data = await getMyCollections({
        page: 1,
        size: 20,
        type: "GAME",
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
