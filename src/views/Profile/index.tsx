import { useEffect, useState } from "react";

import { getMyCollections } from "@/api";
import type { UserCollectionItem } from "@/api/profile";
import { useAuthStore } from "@/store";
import { CollectionCard } from "./components/CollectionCard";
import { UserCard } from "./components/UserCard";
import styles from "./index.module.scss";

function ProfileView() {
  const { user } = useAuthStore();
  const [collections, setCollections] = useState<UserCollectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    async function fetchCollections() {
      setLoading(true);
      setError("");

      try {
        const data = await getMyCollections({
          page: 1,
          size: 20,
        });

        if (cancelled) {
          return;
        }

        setCollections(data.records);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setError(
          requestError instanceof Error ? requestError.message : "请求失败",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchCollections();

    return () => {
      cancelled = true;
    };
  }, [user]);

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

        {loading ? <div className={styles.state}>加载中...</div> : null}
        {error ? <div className={styles.state}>{error}</div> : null}
        {!loading && !error && collections.length === 0 ? (
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
