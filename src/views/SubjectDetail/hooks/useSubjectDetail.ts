import { useEffect, useState } from "react";

import { getSubjectDetail } from "@/api";
import type { SubjectDetail } from "@/api/request";

interface SubjectDetailState {
  error: string;
  subject: SubjectDetail | null;
  subjectId: number | null;
}

interface UseSubjectDetailResult {
  subject: SubjectDetail | null;
  loading: boolean;
  error: string;
}

function useSubjectDetail(
  parsedSubjectId: number,
  invalidSubjectId: boolean,
): UseSubjectDetailResult {
  const [state, setState] = useState<SubjectDetailState>({
    error: "",
    subject: null,
    subjectId: null,
  });

  useEffect(() => {
    if (invalidSubjectId) {
      return;
    }

    let cancelled = false;

    void getSubjectDetail(parsedSubjectId)
      .then((data) => {
        if (cancelled) {
          return;
        }

        setState({
          error: "",
          subject: data,
          subjectId: parsedSubjectId,
        });
      })
      .catch((requestError) => {
        if (cancelled) {
          return;
        }

        setState({
          error:
            requestError instanceof Error ? requestError.message : "请求失败",
          subject: null,
          subjectId: parsedSubjectId,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [invalidSubjectId, parsedSubjectId]);

  if (invalidSubjectId) {
    return {
      subject: null,
      loading: false,
      error: "",
    };
  }

  if (state.subjectId !== parsedSubjectId) {
    return {
      subject: null,
      loading: true,
      error: "",
    };
  }

  return {
    subject: state.subject,
    loading: false,
    error: state.error,
  };
}

export default useSubjectDetail;
