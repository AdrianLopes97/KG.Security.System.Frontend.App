import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/protected-route";
import { Navigate, Route, Routes } from "react-router";
import Sidebar from "./components/layout/sidebar-project";
import { CreateProject } from "./pages/Create-Project";
import { EditProject } from "./pages/Edit-Project";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Observability } from "./pages/Observability";
import { SetupObservability } from "./pages/Setup-Observability";
import { Vulnerability } from "./pages/Vulnerability";

export function Router() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<Sidebar />}>
          <Route path="/home" element={<Home />} />
          <Route path="/home/create-project" element={<CreateProject />} />
          <Route path="/home/projects/:id/edit" element={<EditProject />} />
          <Route path="/vulnerabilities" element={<Vulnerability />} />
          <Route path="/observability" element={<Observability />} />
          <Route path="/observability/:projectId/setup-observability" element={<SetupObservability />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
