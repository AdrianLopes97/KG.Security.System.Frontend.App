import { useAuth } from "@/contexts/auth-context";
import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  readonly redirectTo?: string;
}

// Renders children (via <Outlet />) if authenticated; otherwise navigates to login
export function ProtectedRoute({ redirectTo = "/login" }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
}

// Public route that should redirect away when already authenticated (e.g., login page)
interface PublicOnlyRouteProps {
  readonly whenAuthenticatedRedirectTo?: string;
}
export function PublicOnlyRoute({ whenAuthenticatedRedirectTo = "/home" }: PublicOnlyRouteProps) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to={whenAuthenticatedRedirectTo} replace />;
  return <Outlet />;
}
