// hooks/useUsers.js
import axios from "@config/axios";
import { useEffect, useState } from "react";

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/users/");
            setUsers(res.data); 
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (id, isActive) => {
        await axios.patch(`/users/${id}/status`, { isActive });
        fetchUsers(); // Refresh
    };

    const deleteUser = async (id) => {
        await axios.delete(`/users/${id}`);
        fetchUsers();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, toggleUserStatus, deleteUser };
}
