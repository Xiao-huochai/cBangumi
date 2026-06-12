import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getMySubjectState,
  updateMySubjectState,
  type CollectionStatus,
} from "@/api";
import { useAuthStore } from "@/store";

interface UseSubjectCollectionStateParams {
  invalidSubjectId: boolean;
  subjectId: number;
}

interface UseSubjectCollectionStateResult {
  draftCommentContent: string;
  draftRatingScore: number | null;
  isCollected: boolean;
  isCollectionModalOpen: boolean;
  isSubjectStateLoading: boolean;
  isSaving: boolean;
  savedRatingScore: number | null;
  savedUpdatedAt: string;
  triggerVariant: "idle" | "collected" | "rated";
  closeCollectionModal: () => void;
  openCollectionModal: () => void;
  saveCollection: () => void;
  setDraftCommentContent: (value: string) => void;
  setDraftRatingScore: (score: number | null) => void;
}

function formatCollectionDate(value?: string) {
  if (!value) {
    return "";
  }

  const [datePart] = value.split("T");

  return datePart ?? "";
}

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export default function useSubjectCollectionState({
  invalidSubjectId,
  subjectId,
}: UseSubjectCollectionStateParams): UseSubjectCollectionStateResult {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { initialized, isAuthenticated, user } = useAuthStore();
  const [isCollectionModalOpen, setCollectionModalOpen] = useState(false);
  const [savedRatingScore, setSavedRatingScore] = useState<number | null>(null);
  const [savedCommentContent, setSavedCommentContent] = useState("");
  const [savedCollectionStatus, setSavedCollectionStatus] =
    useState<CollectionStatus | null>(null);
  const [savedUpdatedAt, setSavedUpdatedAt] = useState("");
  const [draftRatingScore, setDraftRatingScore] = useState<number | null>(null);
  const [draftCommentContent, setDraftCommentContent] = useState("");
  const isCollected = Boolean(savedCollectionStatus);
  const triggerVariant = !isCollected
    ? "idle"
    : savedRatingScore
      ? "rated"
      : "collected";

  const { data: subjectState, isLoading: isSubjectStateLoading } = useQuery({
    queryKey: ["subject-state", user?.id, subjectId],
    queryFn: () => getMySubjectState(subjectId),
    enabled: !invalidSubjectId && initialized && isAuthenticated,
  });

  const saveSubjectStateMutation = useMutation({
    mutationFn: () =>
      updateMySubjectState(subjectId, {
        collectionStatus: savedCollectionStatus ?? "DONE",
        ratingScore: draftRatingScore,
        commentContent: draftCommentContent.trim() || null,
      }),
    onSuccess: (nextState) => {
      const nextUpdatedAt =
        formatCollectionDate(nextState.updatedAt) ||
        (nextState.collectionStatus ? getTodayDateString() : "");

      queryClient.setQueryData(
        ["subject-state", user?.id, subjectId],
        nextState,
      );
      setSavedCollectionStatus(nextState.collectionStatus);
      setSavedRatingScore(nextState.ratingScore);
      setSavedCommentContent(nextState.commentContent ?? "");
      setSavedUpdatedAt(nextUpdatedAt);
      setDraftRatingScore(nextState.ratingScore);
      setDraftCommentContent(nextState.commentContent ?? "");
      setCollectionModalOpen(false);
    },
  });

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!isAuthenticated) {
      setSavedCollectionStatus(null);
      setSavedRatingScore(null);
      setSavedCommentContent("");
      setSavedUpdatedAt("");
      setDraftRatingScore(null);
      setDraftCommentContent("");
    }
  }, [initialized, isAuthenticated]);

  useEffect(() => {
    if (!subjectState) {
      return;
    }

    const nextUpdatedAt =
      formatCollectionDate(subjectState.updatedAt) ||
      (subjectState.collectionStatus ? getTodayDateString() : "");

    setSavedCollectionStatus(subjectState.collectionStatus);
    setSavedRatingScore(subjectState.ratingScore);
    setSavedCommentContent(subjectState.commentContent ?? "");
    setSavedUpdatedAt(nextUpdatedAt);
    setDraftRatingScore(subjectState.ratingScore);
    setDraftCommentContent(subjectState.commentContent ?? "");
  }, [subjectState]);

  function openCollectionModal() {
    if (!initialized) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location },
      });
      return;
    }

    setDraftRatingScore(savedRatingScore);
    setDraftCommentContent(savedCommentContent);
    setCollectionModalOpen(true);
  }

  return {
    draftCommentContent,
    draftRatingScore,
    isCollected,
    isCollectionModalOpen,
    isSaving: saveSubjectStateMutation.isPending,
    isSubjectStateLoading,
    savedRatingScore,
    savedUpdatedAt,
    triggerVariant,
    closeCollectionModal: () => setCollectionModalOpen(false),
    openCollectionModal,
    saveCollection: () => saveSubjectStateMutation.mutate(),
    setDraftCommentContent,
    setDraftRatingScore,
  };
}
