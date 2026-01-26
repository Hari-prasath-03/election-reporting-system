"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import UsersTable from "./users-table";
import UserForm from "./user-form";
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { User } from "@/types";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/ui/form-select";

type ManageUsersClientProps = {
  initialUsers: User[];
  initialTotal: number;
  currentUser: User;
};

export default function ManageUsersClient({
  initialUsers,
  initialTotal,
  currentUser,
}: ManageUsersClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialTotal);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const observerTarget = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const filterOptions = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "informer", label: "Informer" },
  ];

  const fetchUsers = useCallback(
    async (pageNum: number, isNewFilter: boolean = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "20",
          query: searchQuery,
          role: selectedRole,
        });

        const response = await fetch(`/api/users?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          if (isNewFilter) {
            setUsers(result.data);
            setPage(1);
          } else {
            setUsers((prev) => {
              const newUsers = result.data.filter(
                (newU: User) => !prev.some((p) => p.id === newU.id),
              );
              return [...prev, ...newUsers];
            });
            setPage(pageNum);
          }
          setTotal(result.total);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
      setLoading(false);
    },
    [searchQuery, selectedRole],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => fetchUsers(1, true), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedRole, fetchUsers]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && users.length < total)
          fetchUsers(page + 1);
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [loading, total, users.length, page, fetchUsers]);

  const handleCreateUser = () => {
    setFormMode("create");
    setSelectedUser(undefined);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setFormMode("edit");
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedUser(undefined);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedUser(undefined);
    fetchUsers(1, true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search officers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-45">
            <FormSelect
              value={selectedRole}
              onValueChange={setSelectedRole}
              placeholder="Filter by Role"
              options={filterOptions}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-sm text-muted-foreground whitespace-nowrap hidden md:block">
            Total: <span className="font-semibold">{total}</span>
          </div>
          <Button onClick={handleCreateUser} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Register Officer
          </Button>
        </div>
      </div>

      <UsersTable
        users={users}
        currentUser={currentUser}
        onEdit={handleEditUser}
        loading={loading}
        observerTarget={observerTarget as React.RefObject<HTMLDivElement>}
      />

      {showForm && (
        <UserForm
          mode={formMode}
          user={selectedUser}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
}
