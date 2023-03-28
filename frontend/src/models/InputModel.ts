export interface InputModel {
  name: string;
  placeholder?: string;
  value: any;
  onChangeHandler: (e: any) => void;
  required: boolean;
}
