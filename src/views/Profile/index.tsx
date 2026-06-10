import { useAuthStore } from "@/store";
import { UserCard } from "./components/UserCard";
import styles from "./index.module.scss";

function ProfileView() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <main className={styles.page}>
      <UserCard name={user.name} avatarId={user.avatarId} />
    </main>
  );
}

export default ProfileView;
