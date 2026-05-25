import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employees", href: "/employees", icon: Users },
];

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function SidebarContent({
  collapsed,
  setCollapsed,
  location,
  user,
  onLogout,
  onNavigate,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  location: { pathname: string };
  user: any;
  onLogout: () => void;
  onNavigate: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "18px 0" : "16px 16px 16px 18px",
          borderBottom: "1px solid #f0f4f8",
          minHeight: 68,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11, overflow: "hidden" }}>
          {/* Logo icon */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: "linear-gradient(135deg,#1a7fd4,#0f5fa8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(26,127,212,0.28)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 38 38" fill="none">
              <circle cx="12" cy="12" r="4" fill="white" opacity="0.9" />
              <circle cx="26" cy="12" r="4" fill="white" opacity="0.9" />
              <circle cx="12" cy="26" r="4" fill="white" opacity="0.9" />
              <circle cx="26" cy="26" r="4" fill="white" opacity="0.9" />
              <path d="M12 12L26 26M26 12L12 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>

          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 700, fontSize: "0.97rem", color: "#1e293b", whiteSpace: "nowrap" }}>
                Salary Manager
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", whiteSpace: "nowrap" }}>
                Admin Panel
              </div>
            </div>
          )}
        </div>

        {/* Collapse button */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b",
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={15} />
          </button>
        )}

        {/* Expand pill on edge when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            style={{
              position: "absolute",
              right: -13,
              top: 20,
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "50%",
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b",
              boxShadow: "0 2px 6px rgba(0,0,0,0.09)",
              zIndex: 10,
            }}
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav
        style={{
          flex: 1,
          padding: "14px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              title={collapsed ? item.name : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: collapsed ? "11px 0" : "10px 13px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: isActive ? 600 : 400,
                fontSize: "0.9rem",
                color: isActive ? "#fff" : "#475569",
                background: isActive
                  ? "linear-gradient(135deg,#1a7fd4,#0f5fa8)"
                  : "transparent",
                boxShadow: isActive ? "0 3px 10px rgba(26,127,212,0.25)" : "none",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "#f1f5f9";
                  (e.currentTarget as HTMLElement).style.color = "#1e293b";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#475569";
                }
              }}
            >
              <item.icon size={18} />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid #f0f4f8" }}>
        <button
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: collapsed ? "11px 0" : "10px 13px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: 12,
            border: "none",
            background: "#fef2f2",
            color: "#ef4444",
            fontWeight: 500,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#fee2e2";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#fef2f2";
          }}
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 1024;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  const { pathname } = location;
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname primitive is the only dep needed
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const sidebarWidth = collapsed ? 72 : 240;

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Desktop Sidebar ── */}
      {isDesktop && (
        <aside
          style={{
            position: "fixed",
            top: 0, left: 0, bottom: 0,
            width: sidebarWidth,
            background: "#fff",
            borderRight: "1px solid #e8edf3",
            boxShadow: "2px 0 16px rgba(0,0,0,0.04)",
            transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
            zIndex: 50,
            overflow: "visible",
          }}
        >
          <SidebarContent
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            location={location}
            user={user}
            onLogout={handleLogout}
            onNavigate={() => {}}
          />
        </aside>
      )}

      {/* ── Mobile: overlay + drawer ── */}
      {!isDesktop && (
        <>
          {mobileOpen && (
            <div
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 49,
                backdropFilter: "blur(2px)",
              }}
            />
          )}
          <aside
            style={{
              position: "fixed",
              top: 0, left: 0, bottom: 0,
              width: 240,
              background: "#fff",
              borderRight: "1px solid #e8edf3",
              boxShadow: "2px 0 20px rgba(0,0,0,0.1)",
              zIndex: 50,
              transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.22s cubic-bezier(.4,0,.2,1)",
            }}
          >
            <SidebarContent
              collapsed={false}
              setCollapsed={() => {}}
              location={location}
              user={user}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}

      {/* ── Mobile top bar ── */}
      {!isDesktop && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0,
            height: 56,
            background: "#fff",
            borderBottom: "1px solid #e8edf3",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 14,
            zIndex: 40,
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          }}
        >
          <button
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              background: "none", border: "none",
              cursor: "pointer", color: "#475569",
              display: "flex", alignItems: "center",
              padding: 6, borderRadius: 8,
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 9,
                background: "linear-gradient(135deg,#1a7fd4,#0f5fa8)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 38 38" fill="none">
                <circle cx="12" cy="12" r="4" fill="white" opacity="0.9" />
                <circle cx="26" cy="12" r="4" fill="white" opacity="0.9" />
                <circle cx="12" cy="26" r="4" fill="white" opacity="0.9" />
                <circle cx="26" cy="26" r="4" fill="white" opacity="0.9" />
                <path d="M12 12L26 26M26 12L12 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#1e293b" }}>Salary Manager</div>
              <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Admin Panel</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main
        style={{
          marginLeft: isDesktop ? sidebarWidth : 0,
          paddingTop: isDesktop ? 0 : 56,
          transition: "margin-left 0.22s cubic-bezier(.4,0,.2,1)",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}