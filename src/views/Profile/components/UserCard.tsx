import { Img } from "@/components/Img";
import styles from "./UserCard.module.scss";

interface UserCardProps {
  name: string;
  avatarId: string;
}

function resolveAvatarSrc(avatarId: string) {
  if (/^https?:\/\//.test(avatarId) || avatarId.startsWith("/")) {
    return avatarId;
  }

  return "";
}

function getDisplayInitial(name: string) {
  const value = name.trim();

  return value ? value.slice(0, 1).toUpperCase() : "?";
}

export function UserCard({ name, avatarId }: UserCardProps) {
  const avatarSrc = resolveAvatarSrc(avatarId);

  return (
    <section className={styles.card} aria-label="用户卡片">
      <div className={styles.avatar}>
        {avatarSrc ? (
          <Img src={avatarSrc} alt={`${name} 的头像`} />
        ) : (
          <span>{getDisplayInitial(name)}</span>
        )}
      </div>

      <h1 className={styles.name}>{name}</h1>
    </section>
  );
}
