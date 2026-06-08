import { NavLink, Outlet, useLocation } from "react-router-dom";

import { GlobalBackButton } from "@/components/GlobalBackButton";
import styles from "./MainLayout.module.scss";

const navItems = [
  { label: "排行", to: "/ranking" },
  { label: "条目", to: "/subjects/8" },
  { label: "个人", to: "/profile" },
  { label: "登录", to: "/login" },
];

const rootPaths = new Set(navItems.map((item) => item.to));

export function MainLayout() {
  const location = useLocation();
  const showBackButton = !rootPaths.has(location.pathname);

  return (
    <div className={styles.layout}>
      <GlobalBackButton />

      <div
        className={
          showBackButton
            ? `${styles.content} ${styles.contentWithBackButton}`
            : styles.content
        }
      >
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
