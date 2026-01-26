import ManageUsersClient from "@/components/user/manage-users-client";
import { getUserClaims } from "@/services/self-user-service";
import { getUsers } from "@/services/user-service";

export default async function ManageUsersPage() {
  const [usersResult, currUser] = await Promise.all([
    getUsers({ page: 1, limit: 20 }),
    getUserClaims(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Officer Management</h1>
        <p className="text-muted-foreground">
          Manage access for field officers and administrators
        </p>
      </div>

      <ManageUsersClient
        initialUsers={usersResult.data}
        initialTotal={usersResult.total}
        currentUser={currUser!}
      />
    </main>
  );
}
