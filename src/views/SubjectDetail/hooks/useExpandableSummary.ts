import { useEffect, useState } from "react";

interface UseExpandableSummaryResult {
  summaryRef: (element: HTMLParagraphElement | null) => void;
  isExpanded: boolean;
  canExpand: boolean;
  toggleExpanded: () => void;
}

function useExpandableSummary(
  summary: string | null | undefined,
  collapsedClassName: string,
): UseExpandableSummaryResult {
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null);
  const [canExpandState, setCanExpandState] = useState(false);
  const [summaryElement, setSummaryElement] =
    useState<HTMLParagraphElement | null>(null);
  const isExpanded = Boolean(summary) && expandedSummary === summary;

  useEffect(() => {
    if (!summaryElement || !summary) {
      return;
    }

    const updateOverflowState = () => {
      const classList = summaryElement.classList;

      if (isExpanded) {
        classList.add(collapsedClassName);
      }

      setCanExpandState(summaryElement.scrollHeight > summaryElement.clientHeight + 1);

      if (isExpanded) {
        classList.remove(collapsedClassName);
      }
    };

    const frameId = window.requestAnimationFrame(updateOverflowState);
    const observer = new ResizeObserver(updateOverflowState);
    observer.observe(summaryElement);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [collapsedClassName, isExpanded, summary, summaryElement]);

  return {
    summaryRef: setSummaryElement,
    isExpanded,
    canExpand: Boolean(summary) && canExpandState,
    toggleExpanded: () => {
      setExpandedSummary((current) => (current === summary ? null : summary ?? null));
    },
  };
}

export default useExpandableSummary;
