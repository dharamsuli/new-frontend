import { useAuth } from "./useAuth";

export function useAdminGuard() {
  const { user } = useAuth();

  return {
    loading: false,
    isAdmin: user?.role === "vendor" || user?.role === "admin"
  };
}
