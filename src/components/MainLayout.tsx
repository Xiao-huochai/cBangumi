import { NavLink, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store";
import { GlobalBackButton } from "./GlobalBackButton";
import styles from "./MainLayout.module.scss";

const commonNavItems = [
  { label: "排行", to: "/ranking" },
  { label: "条目", to: "/subjects/8" },
];

export function MainLayout() {
  const { isAuthenticated } = useAuthStore();
  const navItems = [
    ...commonNavItems,
    isAuthenticated
      ? { label: "个人", to: "/profile" }
      : { label: "登录", to: "/login" },
  ];

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <GlobalBackButton></GlobalBackButton>
        <Outlet />
      </div>

      <nav className={styles.nav} aria-label="底部导航">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.item} ${styles.active}` : styles.item
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
