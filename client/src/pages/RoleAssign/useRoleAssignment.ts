import { useState, useCallback } from "react";
import { apiRequest } from "../../hooks/useAPI";
import type { Menu, PermissionsMap, RoleMenuResponse } from "../../types/role";
import { useAuth } from "../../context/AuthContext";

interface UseRoleAssignmentResult {
  permissions: PermissionsMap;
  fetchRoleMenus: (roleId: number) => Promise<void>;
  toggleAction: (parentId: number, actionId: number) => void;
  toggleMenu: (menu: Menu) => void;
  saveAssignments: (roleId: number) => Promise<void>;
}

export const useRoleAssignment = (): UseRoleAssignmentResult => {
  const { token } = useAuth();
  const [permissions, setPermissions] = useState<PermissionsMap>({});

  const fetchRoleMenus = useCallback(async (roleId: number) => {
    const data = await apiRequest<RoleMenuResponse[]>(
      `/role/rolemenu/${roleId}`,
      { token }
    );
    console.log(data)

    const perms: PermissionsMap = {};

    data.menus.forEach((item) => {
      const menu = item.menu ?? item;
      if (!menu?.id) return;

      // Child action
      if (menu.parentId !== null) {
        perms[menu.parentId] ??= [];
        perms[menu.parentId].push(menu.id);
      }

      // Parent menu
      if (menu.parentId === null) {
        perms[menu.id] = [menu.id];
      }
    });

    setPermissions(perms);
  }, [token]);

  const toggleAction = useCallback((parentId: number, actionId: number) => {
    setPermissions((prev) => {
      const selected = prev[parentId] ?? [];
      return {
        ...prev,
        [parentId]: selected.includes(actionId)
          ? selected.filter((id) => id !== actionId)
          : [...selected, actionId],
      };
    });
  }, []);

  const toggleMenu = useCallback((menu: Menu) => {
    setPermissions((prev) => {
      const hasActions = menu.children.length > 0;

      if (!hasActions) {
        return {
          ...prev,
          [menu.id]: prev[menu.id]?.length ? [] : [menu.id],
        };
      }

      const allActionIds = menu.children.map((c) => c.id);
      const selected = prev[menu.id] ?? [];
      const allSelected = selected.length === allActionIds.length;

      return {
        ...prev,
        [menu.id]: allSelected ? [] : allActionIds,
      };
    });
  }, []);

  const saveAssignments = useCallback(
    async (roleId: number) => {
      const menuIds = Object.values(permissions).flat();

      await apiRequest<void>("/role/rolemenu/assign-role", {
        method: "POST",
        body: {
          roleId,
          menuIds,
          token,
        },
      });
    },
    [permissions,token]
  );

  return {
    permissions,
    fetchRoleMenus,
    toggleAction,
    toggleMenu,
    saveAssignments,
  };
};
