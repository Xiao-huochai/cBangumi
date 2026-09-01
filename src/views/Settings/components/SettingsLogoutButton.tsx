import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSignOutMutation } from "@/hooks";
import styles from "./SettingsLogoutButton.module.scss";

export function SettingsLogoutButton() {
  const navigate = useNavigate();
  const signOutMutation = useSignOutMutation();

  async function handleSignOut() {
    await signOutMutation.mutateAsync().catch(() => undefined);
    navigate("/login", { replace: true });
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => void handleSignOut()}
      disabled={signOutMutation.isPending}
    >
      <span className={styles.iconBox}>
        <LogOut aria-hidden="true" />
      </span>
      <span>{signOutMutation.isPending ? "退出中..." : "退出登录"}</span>
    </button>
  );
}
