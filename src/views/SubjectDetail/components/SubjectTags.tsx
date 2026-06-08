import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { SubjectTag } from "@/api/request";
import styles from "./SubjectTags.module.scss";

interface SubjectTagsProps {
  className?: string;
  tags: SubjectTag[] | string | null;
}

const COLLAPSED_TAG_COUNT = 12;

function normalizeTags(tags: SubjectTagsProps["tags"]): SubjectTag[] {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags;
  }

  try {
    const parsed = JSON.parse(tags);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (tag): tag is SubjectTag =>
        typeof tag === "object" &&
        tag !== null &&
        typeof tag.name === "string" &&
        typeof tag.count === "number",
    );
  } catch {
    return [];
  }
}

function SubjectTags({ className, tags }: SubjectTagsProps) {
  const [expandedTags, setExpandedTags] =
    useState<SubjectTagsProps["tags"]>(null);
  const normalizedTags = normalizeTags(tags);
  const isExpanded = expandedTags === tags;
  const visibleTags = isExpanded
    ? normalizedTags
    : normalizedTags.slice(0, COLLAPSED_TAG_COUNT);
  const canExpand = normalizedTags.length > COLLAPSED_TAG_COUNT;

  if (normalizedTags.length === 0) {
    return null;
  }

  return (
    <section className={className}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <h2>标签</h2>
          <div className={styles.headerActions}>
            <span className={styles.count}>{normalizedTags.length} 个</span>
            {canExpand && (
              <button
                className={styles.expandButton}
                type="button"
                aria-label={isExpanded ? "收起标签" : "展开标签"}
                onClick={() => {
                  setExpandedTags((current) => (current === tags ? null : tags));
                }}
              >
                {isExpanded ? (
                  <ChevronUp size={16} strokeWidth={2.25} />
                ) : (
                  <ChevronDown size={16} strokeWidth={2.25} />
                )}
              </button>
            )}
          </div>
        </div>
        <div className={styles.list}>
          {visibleTags.map((tag) => (
            <span className={styles.tag} key={`${tag.name}-${tag.count}`}>
              <span className={styles.name}>{tag.name}</span>
              <span className={styles.value}>{tag.count}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SubjectTags;
