import { useQuery } from "@tanstack/react-query";

import { getSubjectDetail } from "@/api";

interface UseSubjectDetailResult {
  subject: Awaited<ReturnType<typeof getSubjectDetail>> | null;
  loading: boolean;
  error: string;
}

function useSubjectDetail(
  parsedSubjectId: number,
  invalidSubjectId: boolean,
): UseSubjectDetailResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subject-detail", parsedSubjectId],
    queryFn: () => getSubjectDetail(parsedSubjectId),
    enabled: !invalidSubjectId,
  });

  if (invalidSubjectId) {
    return {
      subject: null,
      loading: false,
      error: "",
    };
  }

  return {
    subject: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : "",
  };
}

export default useSubjectDetail;
