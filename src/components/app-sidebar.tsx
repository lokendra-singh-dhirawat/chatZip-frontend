import { Link } from "react-router";
import {
  Home,
  Settings,
  PlusCircle,
  LogIn,
  LogOut,
  Lock,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/authContext";

const appItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create Game",
    url: "/create-game",
    icon: PlusCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ className }: { className?: string }) {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <Sidebar className={`${className || ""}`}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {appItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            <SidebarGroupLabel>Authentication</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {!isAuthenticated ? ( // If NOT authenticated, show Login
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        {/* Directly link to login page */}
                        <Link to="/login">
                          <LogIn /> {/* Use the specific icon for Login */}
                          <span>Login</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/register">
                          <PlusCircle />{" "}
                          {/* Using PlusCircle for register icon example */}
                          <span>Register</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                ) : (
                  // If authenticated, show Logout and Change Password
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={handleLogout}>
                        {" "}
                        {/* Use onClick for Logout */}
                        <LogOut />
                        <span>Logout</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        {/* Link to Change Password page */}
                        <Link to="/change-password">
                          <Lock />
                          <span>Change Password</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* Add other authenticated auth links if any, e.g., Profile Settings */}
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* --- Sheet (Mobile Sidebar) - Apply same logic here --- */}
      <Sheet>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar>
            <SidebarContent>
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </SheetTrigger>
              </div>
              <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {appItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup className="mt-6">
                <SidebarGroupLabel>Authentication</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {!isAuthenticated ? ( // If NOT authenticated, show Login
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/login">
                            <LogIn />
                            <span>Login</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ) : (
                      // If authenticated, show Logout and Change Password
                      <>
                        <SidebarMenuItem>
                          <SidebarMenuButton onClick={handleLogout}>
                            <LogOut />
                            <span>Logout</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link to="/change-password">
                              <Lock />
                              <span>Change Password</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SheetContent>
      </Sheet>
    </>
  );
}
