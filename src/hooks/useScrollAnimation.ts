import { useInView } from "framer-motion";
import { useRef } from "react";

export const useScrollAnimation = (options?: {
  once?: boolean;
  margin?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: (options?.margin as any) ?? "-100px",
  });

  return { ref, isInView };
};
