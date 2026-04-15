import {
  BarChart3, TrendingUp, Map, CloudRain, Globe, Brain, Coffee, LogOut, Sprout,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Predictions", url: "/dashboard", icon: BarChart3 },
  { title: "Price Forecast", url: "/auctions", icon: TrendingUp },
  { title: "Production Forecast", url: "/production", icon: Coffee },
  { title: "Kenya Map", url: "/map", icon: Map },
  { title: "Weather Forecast", url: "/weather", icon: CloudRain },
  { title: "Market Forecast", url: "/market", icon: Globe },
  { title: "AI Predictions", url: "/insights", icon: Brain },
  { title: "Community Harvest", url: "/community-harvest", icon: Sprout },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isFarmer = profile?.role === "farmer";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Coffee className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-foreground">DCIP</span>
              <span className="text-[10px] text-muted-foreground">Coffee Predictions</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Forecasting
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isFarmer && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
              Farmer
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/harvest"
                      end
                      className="text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <Sprout className="mr-2 h-4 w-4" />
                      {!collapsed && <span>My Harvest</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-3">
        {!collapsed && user && (
          <div className="mb-2">
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            {profile && <p className="truncate text-[10px] capitalize text-primary">{profile.role}</p>}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
          {!collapsed && "Logout"}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
