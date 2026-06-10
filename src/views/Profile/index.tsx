import { useAuthStore } from "@/store";
import { CollectionCard } from "./components/CollectionCard";
import { UserCard } from "./components/UserCard";
import styles from "./index.module.scss";

const mockCollections = [
  {
    id: 1,
    userId: 100000001,
    subjectId: 8,
    subjectTitle: "Code Geass 反叛的鲁路修R2",
    coverUrl: "/api/subjects/8/cover?type=small",
    status: "DONE" as const,
    ratingScore: 9,
    commentContent:
      "节奏很稳，结尾的情绪拉得很满，二刷还是会被打到。节奏很稳，结尾的情绪拉得很满，二刷还是会被打到。节奏很稳，结尾的情绪拉得很满，二刷还是会被打到。节奏很稳，结尾的情绪拉得很满，二刷还是会被打到。",
  },
  {
    id: 2,
    userId: 100000001,
    subjectId: 16,
    subjectTitle: "千与千寻",
    coverUrl: "/api/subjects/16/cover?type=small",
    status: "WISH" as const,
    ratingScore: null,
    commentContent: null,
  },
];

function ProfileView() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <main className={styles.page}>
      <UserCard name={user.name} avatarId={user.avatarId} />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>收藏预览</h2>
          <span className={styles.sectionMeta}>
            {mockCollections.length} 项
          </span>
        </div>

        <div className={styles.list}>
          {mockCollections.map((item) => (
            <CollectionCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default ProfileView;
