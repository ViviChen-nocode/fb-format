export interface SymbolItem {
  char: string;
  name: string;
}

export interface SymbolCategory {
  id: string;
  label: string;
  items: SymbolItem[];
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}