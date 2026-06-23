import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { GlobalBackButton } from "./GlobalBackButton";
import type {
  GlobalBackButtonConfig,
  MainLayoutOutletContext,
} from "./GlobalBackButtonContext";
import styles from "./MainLayout.module.scss";

const navItems = [
  { label: "文章", to: "/articles" },
  { label: "排行", to: "/ranking" },
  { label: "个人", to: "/profile" },
];

export function MainLayout() {
  const [globalBackButton, setGlobalBackButton] =
    useState<GlobalBackButtonConfig>({});

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <GlobalBackButton {...globalBackButton} />
        <Outlet
          context={
            { setGlobalBackButton } satisfies MainLayoutOutletContext
          }
        />
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
