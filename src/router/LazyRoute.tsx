import { Suspense, type PropsWithChildren } from "react";

export function LazyRoute({ children }: PropsWithChildren) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
