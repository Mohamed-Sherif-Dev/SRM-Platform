"use client"

import { useState }    from "react"
import Link            from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Building2, ShoppingCart,
  FileText, CreditCard, BarChart3, Settings,
  ChevronLeft, ChevronRight, Package,
  LogOut, Star, Bell
} from "lucide-react"
import { useUIStore }   from "@/store/uiStore"
import { signOut }      from "next-auth/react"
import { useSession }   from "next-auth/react"
import { cn, getInitials } from "@/lib/utils"

const NAV = [
  { group: "Main", items: [
    { label: "Dashboard",       href: "/dashboard",           icon: LayoutDashboard },
    { label: "Suppliers",       href: "/dashboard/suppliers", icon: Building2       },
    { label: "Purchase Orders", href: "/dashboard/orders",    icon: ShoppingCart    },
    { label: "Contracts",       href: "/dashboard/contracts", icon: FileText        },
    { label: "Payments",        href: "/dashboard/payments",  icon: CreditCard      },
  ]},
  { group: "Insights", items: [
    { label: "Analytics",       href: "/dashboard/analytics", icon: BarChart3       },
    { label: "Ratings",         href: "/dashboard/ratings",   icon: Star            },
  ]},
  { group: "System", items: [
    { label: "Settings",        href: "/dashboard/settings",  icon: Settings        },
  ]},
]

export default function Sidebar() {
  const pathname   = usePathname()
  const { sidebarCollapsed, collapseSidebar } = useUIStore()
  const { data: session } = useSession()

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--card)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-orange-600
          rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/25">
          <Package className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-bold text-sm text-[var(--text)]">SupplyChain Pro</p>
              <p className="text-[10px] text-[var(--text-muted)]">SRM Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map(group => (
          <div key={group.group}>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold uppercase tracking-wider px-3 mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href)
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative cursor-pointer",
                      isActive
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                        : "text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text)]"
                    )}>
                      <item.icon className="w-4 h-4 shrink-0" />
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm font-medium whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-dark-900
                          text-white text-xs rounded-lg opacity-0 group-hover:opacity-100
                          transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50
                          border border-dark-700">
                          {item.label}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl
          hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">
              {getInitials(session?.user?.name)}
            </span>
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text)] truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {(session?.user as any)?.role || "VIEWER"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="opacity-0 group-hover:opacity-100 transition-opacity">
                <LogOut className="w-4 h-4 text-red-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Button */}
      <button onClick={collapseSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary-600 text-white
          rounded-full flex items-center justify-center shadow-lg hover:bg-primary-500 transition-colors z-10">
        {sidebarCollapsed
          ? <ChevronRight className="w-3.5 h-3.5" />
          : <ChevronLeft  className="w-3.5 h-3.5" />
        }
      </button>
    </motion.aside>
  )
}