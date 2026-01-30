import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../../hooks/useAPI"; // adjust path
import type { Role } from "../../types/role";
import { useAuth } from "../../context/AuthContext";

interface UseRolesResult {
  roles: Role[];
  loading: boolean;
  fetchRoles: () => Promise<void>;
  createRole: (data: Partial<Role>) => Promise<Role>;
  updateRole: (id: number, data: Partial<Role>) => Promise<Role>;
  deleteRole: (id: number) => Promise<void>;
}

export const useRoles = (): UseRolesResult => {
  const { token } = useAuth();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await apiRequest<Role[]>("/role", { token });
      console.log(data)
      setRoles(data.roles);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createRole = useCallback(
    (data: Partial<Role>) => {
      if (!token) throw new Error("No auth token");
      return apiRequest<Role>("/role", {
        method: "POST",
        token,
        body: data,
      });
    },
    [token]
  );

  const updateRole = useCallback(
    (id: number, data: Partial<Role>) => {
      if (!token) throw new Error("No auth token");
      return apiRequest<Role>(`/role/${id}`, {
        method: "PATCH",
        token,
        body: data,
      });
    },
    [token]
  );

  const deleteRole = useCallback(
    (id: number) => {
      if (!token) throw new Error("No auth token");
      return apiRequest<void>(`/role/${id}`, {
        method: "DELETE",
        token,
      });
    },
    [token]
  );

  useEffect(() => {
    if (token) fetchRoles();
  }, [token, fetchRoles]);

  return {
    roles,
    loading,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
};
