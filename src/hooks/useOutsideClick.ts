import { useEffect } from "react";

export function useOutsideClick(
  ref: React.RefObject<HTMLDivElement | null>,
  onClickOut: () => void,
) {
  useEffect(() => {
    const onClick = ({ target }: MouseEvent) =>
      !ref?.current?.contains(target as Node) && onClickOut?.();
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  });
}
