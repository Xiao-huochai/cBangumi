import { useState } from "react";
import type { ImgHTMLAttributes, SyntheticEvent } from "react";

const DEFAULT_FALLBACK_SRC = "/image-fallback.svg";

export interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function Img({
  src,
  alt = "",
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  onError,
  ...props
}: ImgProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const hasError = Boolean(src && failedSrc === src);

  function handleError(event: SyntheticEvent<HTMLImageElement, Event>) {
    if (src && failedSrc !== src) {
      setFailedSrc(src);
    }

    onError?.(event);
  }

  return (
    <img
      {...props}
      src={!src || hasError ? fallbackSrc : src}
      alt={alt}
      onError={handleError}
    />
  );
}
