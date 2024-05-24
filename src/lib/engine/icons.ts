export type Icon =
  | { name: string; color?: string | number }
  | { name: string; path: string }
  | { name: string; component: string; props: { [key: string]: any } }
  | string
  | number
  | boolean;
