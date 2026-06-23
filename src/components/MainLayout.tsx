import { NavLink, Outlet } from "react-router-dom";

import styles from "./MainLayout.module.scss";

const navItems = [
  { label: "文章", to: "/articles" },
  { label: "排行", to: "/ranking" },
  { label: "个人", to: "/profile" },
];

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
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
