// types/menu.ts
export interface Menu {
  id: number;
  title: string;
  slug: string;
  order?: number;
  parentId?: number | null;
  children?: Menu[];
  createdAt?: string;
  updatedAt?: string;
}
