export interface RBACActionMap {
    actions: string[];
}

export interface RBACMap {
    [menuSlug: string]: RBACActionMap;
}

export interface MenuItem {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    children?: MenuItem[];
}

export interface NormalizedMenuResult {
    rbac: RBACMap;
    menus: MenuItem[];
}

export interface RBACContextValue {
    menus: MenuItem[];
    rbac: RBACMap;
    rbacLoading: boolean;
    can: (menuSlug: string, action: string | string[]) => boolean;
    canViewMenu: (menuSlug: string) => boolean;
}
