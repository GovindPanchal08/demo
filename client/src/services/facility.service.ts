import { apiRequest } from "../hooks/useAPI";

export interface Department {
    id: number;
    name: string;
}

export interface DepartmentListResponse {
    departments: Department[];
}

export const facilityService = {
    getAll: (token: string) =>
        apiRequest<DepartmentListResponse>(
            "/department",
            { method: "GET", token },
            "Failed to fetch departments"
        ),

    create: (name: string, token: string) =>
        apiRequest<{ department: Department }>(
            "/department",
            {
                method: "POST",
                token,
                body: { name },
            },
            "Failed to create department"
        ),

    update: (id: number, name: string, token: string) =>
        apiRequest<{ department: Department }>(
            `/department/${id}`,
            {
                method: "PUT",
                token,
                body: { name },
            },
            "Failed to update department"
        ),

    remove: (id: number, token: string) =>
        apiRequest<void>(
            `/department/${id}`,
            { method: "DELETE", token },
            "Failed to delete department"
        ),
};
