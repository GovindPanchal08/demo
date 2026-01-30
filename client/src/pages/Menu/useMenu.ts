import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../../hooks/useAPI";
import type { Menu } from "../../types/menu";
import { useAuth } from "../../context/AuthContext";

interface UseMenusResult {
  menus: Menu[];
  loading: boolean;
  fetchMenus: () => Promise<void>;
  createMenu: (data: Partial<Menu>) => Promise<Menu>;
  updateMenu: (id: number, data: Partial<Menu>) => Promise<Menu>;
  deleteMenu: (id: number) => Promise<void>;
}

export const useMenus = (): UseMenusResult => {
  const { token } = useAuth();

  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMenus = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await apiRequest<Menu[]>("/menu/tree", { token });
      console.log(data)
      setMenus(data.menus);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createMenu = useCallback(
    (data: Partial<Menu>) => {
      if (!token) throw new Error("No auth token");
      return apiRequest<Menu>("/menu", {
        method: "POST",
        token,
        body: data,
      });
    },
    [token]
  );

  const updateMenu = useCallback(
    (id: number, data: Partial<Menu>) => {
      if (!token) throw new Error("No auth token");
      return apiRequest<Menu>(`/menu/${id}`, {
        method: "PATCH",
        token,
        body: data,
      });
    },
    [token]
  );

  const deleteMenu = useCallback(
    (id: number) => {
      if (!token) throw new Error("No auth token");
      return apiRequest<void>(`/menu/${id}`, {
        method: "DELETE",
        token,
      });
    },
    [token]
  );

  useEffect(() => {
    if (token) fetchMenus();
  }, [token, fetchMenus]);

  return {
    menus,
    loading,
    fetchMenus,
    createMenu,
    updateMenu,
    deleteMenu,
  };
};
