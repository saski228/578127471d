import Image, { type ImageProps } from "next/image";

/** Фото из админки отдаются как есть, а встроенные оптимизируются Next. */
export function Img(props: ImageProps) {
  return <Image {...props} unoptimized={typeof props.src === "string" && props.src.startsWith("/api/")} />;
}
