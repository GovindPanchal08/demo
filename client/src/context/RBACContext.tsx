// import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { apiCall } from "../hooks/useAPI";
// import { normalizeMenus } from "../services/utils";
// import { useAuth } from "./AuthContext";
// import type {
//   RBACContextValue,
//   RBACMap,
//   MenuItem,
//   NormalizedMenuResult,
// } from "../types/rbac";

// const RBACContext = createContext<RBACContextValue | null>(null);

// interface RBACProviderProps {
//   children: React.ReactNode;
// }

// const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
//   const { user } = useAuth();

//   const [rbac, setRBAC] = useState<RBACMap>({});
//   const [menus, setMenus] = useState<MenuItem[]>([]);
//   const [rbacLoading, setRBACLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (user?.roleId) {
//       fetchRoleMenus(user.roleId);
//     } else {
//       setRBAC({});
//       setMenus([]);
//       setRBACLoading(false);
//     }
//   }, [user]);

//   const fetchRoleMenus = async (roleId: number) => {
//     try {
//       setRBACLoading(true);

//       const data = await apiCall<{ menus: any[] }>(`/role/rolemenu/${roleId}`);

//       const structured: NormalizedMenuResult = normalizeMenus(data.menus);

//       setRBAC(structured.rbac);
//       setMenus(structured.menus);
//     } catch (err) {
//       console.error("RBAC fetch error:", err);
//       setRBAC({});
//       setMenus([]);
//     } finally {
//       setRBACLoading(false);
//     }
//   };

//   const can = (menuSlug: string, action: string | string[]): boolean => {
//     const permission = rbac[menuSlug];
//     if (!permission) return false;

//     if (Array.isArray(action)) {
//       return action.some((a) => permission.actions.includes(a));
//     }

//     return permission.actions.includes(action);
//   };

//   const canViewMenu = (menuSlug: string): boolean => {
//     return Boolean(rbac[menuSlug]);
//   };

//   const value = useMemo<RBACContextValue>(
//     () => ({
//       menus,
//       rbac,
//       rbacLoading,
//       can,
//       canViewMenu,
//     }),
//     [menus, rbac, rbacLoading]
//   );

//   return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
// };

// export default RBACProvider;

// export const useRBAC = (): RBACContextValue => {
//   const context = useContext(RBACContext);

//   if (!context) {
//     throw new Error("useRBAC must be used within RBACProvider");
//   }

//   return context;
// };
