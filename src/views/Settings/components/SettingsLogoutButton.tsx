import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store";
import styles from "./SettingsLogoutButton.module.scss";

export function SettingsLogoutButton() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const signOut = useAuthStore((state) => state.signOut);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut();
      queryClient.clear();
      navigate("/login", { replace: true });
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => void handleSignOut()}
      disabled={signingOut}
    >
      <span className={styles.iconBox}>
        <LogOut aria-hidden="true" />
      </span>
      <span>{signingOut ? "退出中..." : "退出登录"}</span>
    </button>
  );
}
