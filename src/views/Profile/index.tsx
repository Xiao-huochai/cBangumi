import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMyCollections } from "@/api";
import { PageNavBar } from "@/components/PageNavBar";
import type { SubjectType } from "@/api/request";
import { SUBJECT_TYPE_OPTIONS } from "@/constants/subjects";
import { useAuthStore } from "@/store";
import { CollectionCard } from "./components/CollectionCard";
import { ProfileSettingsLink } from "./components/ProfileSettingsLink";
import { UserCard } from "./components/UserCard";
import styles from "./index.module.scss";

function ProfileView() {
  const { user } = useAuthStore();
  const [subjectType, setSubjectType] = useState<SubjectType>("GAME");
  const subjectTypeLabel =
    SUBJECT_TYPE_OPTIONS.find((option) => option.value === subjectType)
      ?.label ?? "收藏";
  const {
    data: collections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-collections", user?.id, subjectType],
    queryFn: async () => {
      const data = await getMyCollections({
        page: 1,
        size: 20,
        type: subjectType,
      });

      return data.records;
    },
    enabled: Boolean(user),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  });

  if (!user) {
    return null;
  }

  return (
    <main className={styles.page}>
      <PageNavBar title="个人中心" right={<ProfileSettingsLink />} />

      <UserCard name={user.name} avatarId={user.avatarId} />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{subjectTypeLabel}收藏</h2>
          <span className={styles.sectionMeta}>{collections.length} 项</span>
        </div>

        <div
          className={styles.categoryTabs}
          role="tablist"
          aria-label="收藏分类"
        >
          {SUBJECT_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                option.value === subjectType
                  ? styles.categoryTabActive
                  : styles.categoryTab
              }
              role="tab"
              aria-selected={option.value === subjectType}
              onClick={() => setSubjectType(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {isLoading ? <div className={styles.state}>加载中...</div> : null}
        {error ? <div className={styles.state}>{error.message}</div> : null}
        {!isLoading && !error && collections.length === 0 ? (
          <div className={styles.state}>还没有{subjectTypeLabel}收藏记录</div>
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
