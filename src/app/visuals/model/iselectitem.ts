export interface ISelectItem {
  checked?: boolean;
  disabled?: boolean;
  value: string | string[];
  label: string;
  invalid?: boolean;
  [key: string]: any;
}
