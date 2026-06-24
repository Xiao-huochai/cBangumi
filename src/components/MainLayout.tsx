import { NavLink, Outlet, useLocation } from "react-router-dom";

import styles from "./MainLayout.module.scss";

const navItems = [
  { label: "文章", to: "/articles" },
  { label: "排行", to: "/ranking" },
  { label: "个人", to: "/profile" },
];

export function MainLayout() {
  const { pathname } = useLocation();
  const showBottomNav = navItems.some((item) => item.to === pathname);

  return (
    <div className={styles.layout}>
      <div
        className={
          showBottomNav
            ? `${styles.content} ${styles.withBottomNav}`
            : styles.content
        }
      >
        <Outlet />
      </div>

      {showBottomNav ? (
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
      ) : null}
    </div>
  );
}
