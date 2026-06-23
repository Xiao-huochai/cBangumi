import { useEffect } from "react";
import type {
  DependencyList,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";
import { useOutletContext } from "react-router-dom";

export type GlobalBackButtonConfig = {
  title?: ReactNode;
  right?: ReactNode;
  hidden?: boolean;
};

export type MainLayoutOutletContext = {
  setGlobalBackButton: Dispatch<SetStateAction<GlobalBackButtonConfig>>;
};

export function useGlobalBackButton(
  config: GlobalBackButtonConfig,
  dependencies: DependencyList = [],
) {
  const { setGlobalBackButton } = useOutletContext<MainLayoutOutletContext>();

  useEffect(() => {
    setGlobalBackButton(config);

    return () => {
      setGlobalBackButton({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setGlobalBackButton, ...dependencies]);
}
