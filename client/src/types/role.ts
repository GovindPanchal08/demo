// types/role.ts
export type RoleType = "admin" | "host" | "receptionist";

export interface Role {
  id: number;
  title: string;
  type: RoleType;
  description?: string;
}

export interface Role {
  id: number;
  title: string;
  type: RoleType;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface Menu {
  id: number;
  name: string;
  parentId: number | null;
  children: Menu[];
}

export type PermissionsMap = Record<number, number[]>;

export interface RoleMenuResponse {
  id: number;
  parentId: number | null;
  menu?: Menu;
}
