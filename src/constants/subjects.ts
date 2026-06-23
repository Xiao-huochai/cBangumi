import type { SubjectType } from "@/api/request";

export const SUBJECT_TYPE_OPTIONS: Array<{ label: string; value: SubjectType }> = [
  { label: "动画", value: "ANIME" },
  { label: "书籍", value: "BOOK" },
  { label: "音乐", value: "MUSIC" },
  { label: "游戏", value: "GAME" },
  { label: "三次元", value: "REAL" },
];
