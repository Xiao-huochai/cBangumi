import { X } from "lucide-react";
import { useEffect, useId, type MouseEvent } from "react";

import { StarIcon } from "@/components/StarIcon";

import styles from "./SubjectCollectionModal.module.scss";

interface SubjectCollectionModalProps {
  commentContent: string;
  isOpen: boolean;
  ratingScore: number | null;
  subjectTitle: string;
  onClose: () => void;
  onCommentChange: (value: string) => void;
  onRatingChange: (score: number) => void;
}

function getStarState(score: number | null, index: number) {
  if (!score) {
    return 0;
  }

  const starValue = index * 2;

  if (score >= starValue) {
    return 2;
  }

  if (score === starValue - 1) {
    return 1;
  }

  return 0;
}

function getNextScore(event: MouseEvent<HTMLButtonElement>, starIndex: number) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const clickedLeftHalf = event.clientX - bounds.left <= bounds.width / 2;

  return clickedLeftHalf ? starIndex * 2 - 1 : starIndex * 2;
}

function SubjectCollectionModal({
  commentContent,
  isOpen,
  ratingScore,
  subjectTitle,
  onClose,
  onCommentChange,
  onRatingChange,
}: SubjectCollectionModalProps) {
  const modalTitleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          type="button"
          aria-label="关闭弹窗"
          onClick={onClose}
        >
          <X size={20} strokeWidth={2.25} />
        </button>

        <div className={styles.header}>
          <h2 id={modalTitleId}>{subjectTitle}</h2>
        </div>

        <div className={styles.ratingEditor}>
          {Array.from({ length: 5 }, (_, index) => {
            const starIndex = index + 1;

            return (
              <button
                key={starIndex}
                className={styles.starButton}
                type="button"
                aria-label={`评分 ${starIndex * 2 - 1} 到 ${starIndex * 2} 分`}
                onClick={(event) =>
                  onRatingChange(getNextScore(event, starIndex))
                }
              >
                <StarIcon
                  className={styles.starIcon}
                  state={getStarState(ratingScore, starIndex)}
                  size={34}
                  clipId={`subject-detail-star-${starIndex}`}
                />
              </button>
            );
          })}
        </div>

        <div className={styles.ratingMeta}>
          <strong>{ratingScore ? `${ratingScore} 分` : "未评分"}</strong>
        </div>

        <label className={styles.commentField}>
          <span>评论</span>
          <textarea
            value={commentContent}
            placeholder="写点自己的感受，保存后再接接口。"
            maxLength={800}
            rows={6}
            onChange={(event) => onCommentChange(event.target.value)}
          />
        </label>

        <button className={styles.submitButton} type="button">
          保存收藏
        </button>
      </section>
    </div>
  );
}

export default SubjectCollectionModal;
