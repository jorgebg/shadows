export type StatusBarUnit =
  | {
      label: string | { icon: string; color?: string };
      value: any;
    }
  | string;
