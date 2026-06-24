import { useEffect, useMemo, useState } from "react";
import { Check, Link2, Plus, X } from "lucide-react";

import { SUBJECT_TYPE_OPTIONS } from "@/constants/subjects";
import type { CollectionStatus, UserCollectionItem } from "@/api/profile";
import type { SubjectType } from "@/api/request";
import { useArticleSubjectCollections } from "../hooks/useArticleSubjectCollections";
import styles from "./ArticleSubjectPicker.module.scss";

export interface ArticleSubjectSelection {
  subjectId: number;
  subjectTitle: string;
  coverUrl: string;
}

interface ArticleSubjectPickerProps {
  selectedSubject: ArticleSubjectSelection | null;
  onSelect: (subject: ArticleSubjectSelection) => void;
  onClear: () => void;
}

const statusLabelMap: Record<CollectionStatus, string> = {
  WISH: "想看",
  DOING: "在看",
  DONE: "看过",
  ON_HOLD: "搁置",
  DROPPED: "抛弃",
};

function toSubjectSelection(item: UserCollectionItem): ArticleSubjectSelection {
  return {
    subjectId: item.subjectId,
    subjectTitle: item.subjectTitle,
    coverUrl: item.coverUrl,
  };
}

export function ArticleSubjectPicker({
  selectedSubject,
  onSelect,
  onClear,
}: ArticleSubjectPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subjectType, setSubjectType] = useState<SubjectType>("ANIME");
  const collectionsQuery = useArticleSubjectCollections(subjectType, isOpen);
  const collections = useMemo(
    () => collectionsQuery.data?.pages.flatMap((page) => page.records) ?? [],
    [collectionsQuery.data],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(item: UserCollectionItem) {
    onSelect(toSubjectSelection(item));
    setIsOpen(false);
  }

  return (
    <section className={styles.section} aria-label="关联条目">
      <div className={styles.sectionHeader}>
        <span>关联条目</span>
        {selectedSubject && (
          <button type="button" className={styles.clearButton} onClick={onClear}>
            <X size={15} aria-hidden="true" />
            <span>移除</span>
          </button>
        )}
      </div>

      {selectedSubject ? (
        <div className={styles.selectedSubject}>
          <img src={selectedSubject.coverUrl} alt={selectedSubject.subjectTitle} />
          <div>
            <span>已关联</span>
            <strong>{selectedSubject.subjectTitle}</strong>
          </div>
          <button type="button" className={styles.changeButton} onClick={() => setIsOpen(true)}>
            更换
          </button>
        </div>
      ) : (
        <button type="button" className={styles.emptyButton} onClick={() => setIsOpen(true)}>
          <Link2 size={18} aria-hidden="true" />
          <span>从收藏选择条目</span>
          <Plus size={17} aria-hidden="true" />
        </button>
      )}

      {isOpen && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={() => setIsOpen(false)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="选择关联条目"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2>选择关联条目</h2>
                <p>从你的收藏中选择一项作为文章关联条目</p>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="关闭"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.typeTabs} role="tablist" aria-label="收藏分类">
              {SUBJECT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={
                    option.value === subjectType ? styles.typeTabActive : styles.typeTab
                  }
                  role="tab"
                  aria-selected={option.value === subjectType}
                  onClick={() => setSubjectType(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {collectionsQuery.isLoading && (
              <div className={styles.state}>收藏加载中...</div>
            )}
            {collectionsQuery.error && (
              <div className={styles.state}>{collectionsQuery.error.message}</div>
            )}
            {!collectionsQuery.isLoading &&
              !collectionsQuery.error &&
              collections.length === 0 && (
                <div className={styles.state}>当前分类还没有收藏条目</div>
              )}

            <div className={styles.collectionList}>
              {collections.map((item) => {
                const isSelected = selectedSubject?.subjectId === item.subjectId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={isSelected ? styles.collectionItemSelected : styles.collectionItem}
                    onClick={() => handleSelect(item)}
                  >
                    <img src={item.coverUrl} alt={item.subjectTitle} />
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitleRow}>
                        <strong>{item.subjectTitle}</strong>
                        <span>{statusLabelMap[item.status]}</span>
                      </div>
                      <div className={styles.itemMeta}>
                        {typeof item.ratingScore === "number" ? (
                          <span>评分 {item.ratingScore.toFixed(1)}</span>
                        ) : (
                          <span>未评分</span>
                        )}
                        {item.commentContent && <span>{item.commentContent}</span>}
                      </div>
                    </div>
                    {isSelected && <Check size={18} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>

            {collectionsQuery.hasNextPage && (
              <button
                type="button"
                className={styles.loadMoreButton}
                disabled={collectionsQuery.isFetchingNextPage}
                onClick={() => {
                  void collectionsQuery.fetchNextPage();
                }}
              >
                {collectionsQuery.isFetchingNextPage ? "加载中..." : "加载更多"}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
