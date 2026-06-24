import { Link } from "react-router-dom";

import type { ArticleStatus } from "@/api";
import { articleStatusTabs } from "../constants";
import styles from "./ArticleManageTabs.module.scss";

interface ArticleManageTabsProps {
  status: ArticleStatus;
}

export function ArticleManageTabs({ status }: ArticleManageTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="文章状态">
      {articleStatusTabs.map((tab) => (
        <Link
          key={tab.value}
          className={tab.value === status ? styles.tabActive : styles.tab}
          role="tab"
          aria-selected={tab.value === status}
          to={`/articles/manage?status=${tab.value}`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
