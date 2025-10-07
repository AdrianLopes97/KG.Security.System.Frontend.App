import logoCollapsed from "@/assets/menu-icon-2.png";
import logo from "@/assets/menu-icon.png";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Activity, EyeIcon, House, ShieldAlert } from "lucide-react";
import * as React from "react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      name: "Dashboard",
      url: "/home",
      icon: House,
    },
    {
      name: "Vulnerabilidades",
      url: "/vulnerabilities",
      icon: ShieldAlert,
    },
    {
      name: "Monitoramento",
      url: "/monitoring",
      icon: EyeIcon,
    },
    {
      name: "Observabilidade",
      url: "/observability",
      icon: Activity,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center py-4">
        <LogoSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function LogoSwitcher() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  return (
    <div className="flex items-center justify-center">
      {collapsed ? (
        <img
          src={logoCollapsed}
          alt="KG SECSYSTEM compacto"
          className="h-8 w-auto transition-all duration-200 ease-linear"
        />
      ) : (
        <img src={logo} alt="KG SECSYSTEM" className="h-14 w-auto transition-all duration-200 ease-linear" />
      )}
    </div>
  );
}
