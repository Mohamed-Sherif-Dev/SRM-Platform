"use client"

import { usePathname } from "next/navigation"
import { motion }      from "framer-motion"
import { Bell, Search, Sun, Moon, Menu } from "lucide-react"
import { useTheme }    from "next-themes"
import { useUIStore }  from "@/store/uiStore"

const TITLES: Record<string, string> = {
  "/dashboard":           "Dashboard",
  "/dashboard/suppliers": "Suppliers",
  "/dashboard/orders":    "Purchase Orders",
  "/dashboard/contracts": "Contracts",
  "/dashboard/payments":  "Payments",
  "/dashboard/analytics": "Analytics",
  "/dashboard/ratings":   "Supplier Ratings",
  "/dashboard/settings":  "Settings",
}

export default function Topbar() {
  const pathname  = usePathname()
  const { theme, setTheme } = useTheme()
  const collapseSidebar     = useUIStore(s => s.collapseSidebar)
  const title = TITLES[pathname] || "Dashboard"

  return (
    <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors"
      style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}>

      <div className="flex items-center gap-4">
        <button onClick={collapseSidebar} className="btn-ghost lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[var(--text)]">{title}</h1>
          <p className="text-xs text-[var(--text-muted)] hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 border rounded-xl px-3 py-2 w-52"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
          <Search className="w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search..."
            className="bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none w-full" />
        </div>

        {/* Theme */}
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="btn-ghost p-2.5">
          <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
            {theme === "dark"
              ? <Sun  className="w-4 h-4 text-yellow-400" />
              : <Moon className="w-4 h-4" />
            }
          </motion.div>
        </button>

        {/* Notifications */}
        <button className="btn-ghost p-2.5 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}