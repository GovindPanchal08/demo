import { useCallback, useEffect, useState } from "react";
import { facilityService } from "../../services/facility.service";
import { useAuth } from "../../context/AuthContext";

export interface Department {
  id: number;
  name: string;
}

export interface GetDepartmentsResponse {
  departments: Department[];
}

export interface DepartmentResponse {
  department: Department;
}

export function useFacility() {
  const { token } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const fetchDepartments = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res: GetDepartmentsResponse =
        await facilityService.getAll(token);
      console.log(res)
      setDepartments(res.departments);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const addDepartment = async (name: string) => {
    if (!name.trim() || !token) return;

    setLoading(true);
    try {
      const res: DepartmentResponse =
        await facilityService.create(name.trim(), token);

      setDepartments((prev) => [...prev, res.department]);
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (id: number, name: string) => {
    if (!token) return;

    setLoading(true);
    try {
      const res: DepartmentResponse =
        await facilityService.update(id, name, token);

      setDepartments((prev) =>
        prev.map((d) => (d.id === id ? res.department : d))
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: number) => {
    if (!token) return;

    setLoading(true);
    try {
      await facilityService.remove(id, token);

      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setLoading(false);
    }
  };

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };
}

