import { User } from "@/types";

type Role = keyof typeof ROLES;
type Permission = (typeof ROLES)[Role][number];

const ROLES = {
  admin: ["access:dashboard"],
  informer: ["update:vote_counts"],
} as const;

export default function hasPermission(
  user: User,
  requiredPermission: Permission,
) {
  const userRole = user.role as Role;
  return (ROLES[userRole] as readonly Permission[]).includes(
    requiredPermission,
  );
}
