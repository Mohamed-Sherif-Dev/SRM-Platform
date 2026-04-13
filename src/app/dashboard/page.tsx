"use client"

import { motion }      from "framer-motion"
import {
  Building2, ShoppingCart, FileText, CreditCard,
  TrendingUp, AlertCircle, Clock, CheckCircle,
  ArrowRight, Star, Package, DollarSign
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts"
import Link            from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import StatCard        from "@/components/ui/StatCard"
import { formatPrice, cn } from "@/lib/utils"

const STATS = [
  { title: "Total Suppliers",    value: "5",        change: 25,  icon: Building2,   color: "text-primary-500", bg: "bg-primary-500/15" },
  { title: "Active Orders",      value: "4",        change: 33,  icon: ShoppingCart, color: "text-blue-500",   bg: "bg-blue-500/15"    },
  { title: "Active Contracts",   value: "2",        change: 0,   icon: FileText,    color: "text-green-500",   bg: "bg-green-500/15"   },
  { title: "Total Spent",        value: "$369K",    change: 12,  icon: DollarSign,  color: "text-yellow-500",  bg: "bg-yellow-500/15"  },
]

const MONTHLY_SPEND = [
  { month: "Jan", amount: 28000 },
  { month: "Feb", amount: 35000 },
  { month: "Mar", amount: 42000 },
  { month: "Apr", amount: 31000 },
  { month: "May", amount: 48000 },
  { month: "Jun", amount: 52000 },
  { month: "Jul", amount: 45000 },
  { month: "Aug", amount: 61000 },
  { month: "Sep", amount: 57000 },
  { month: "Oct", amount: 73000 },
  { month: "Nov", amount: 68000 },
  { month: "Dec", amount: 85000 },
]

const TOP_SUPPLIERS = [
  { name: "TechCore Solutions", spent: 125000, rating: 4.8, orders: 24 },
  { name: "ServicePro Inc.",    spent: 78000,  rating: 4.6, orders: 20 },
  { name: "Global Supplies",    spent: 89000,  rating: 4.5, orders: 38 },
]

const RECENT_ORDERS = [
  { id: "PO-2025-001", supplier: "TechCore Solutions", amount: 16500, status: "RECEIVED", date: "Mar 14" },
  { id: "PO-2025-002", supplier: "Global Supplies",    amount: 9350,  status: "APPROVED", date: "Apr 1"  },
  { id: "PO-2025-003", supplier: "FastLog Logistics",  amount: 3200,  status: "PENDING",  date: "Apr 4"  },
  { id: "PO-2025-004", supplier: "ServicePro Inc.",    amount: 27500, status: "DRAFT",    date: "Apr 5"  },
]

const STATUS_CONFIG = {
  RECEIVED: { label: "Received", color: "text-green-500",  bg: "bg-green-500/15"  },
  APPROVED: { label: "Approved", color: "text-blue-500",   bg: "bg-blue-500/15"   },
  PENDING:  { label: "Pending",  color: "text-yellow-500", bg: "bg-yellow-500/15" },
  DRAFT:    { label: "Draft",    color: "text-gray-400",   bg: "bg-gray-500/15"   },
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-3 shadow-2xl text-sm">
      <p className="text-[var(--text-muted)] text-xs mb-1">{label}</p>
      <p className="font-bold text-primary-500">{formatPrice(payload[0].value)}</p>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s, i) => <StatCard key={s.title} {...s} index={i} />)}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {[
          { icon: AlertCircle, color: "text-red-500",    bg: "bg-red-500/10",    border: "border-red-500/20",    text: "1 overdue payment",            link: "/dashboard/payments"  },
          { icon: Clock,       color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "2 contracts expiring in 90 days",link: "/dashboard/contracts" },
          { icon: CheckCircle, color: "text-green-500",  bg: "bg-green-500/10",  border: "border-green-500/20",  text: "1 order ready to receive",      link: "/dashboard/orders"    },
        ].map((alert, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}>
            <Link href={alert.link}>
              <div className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer
                hover:scale-[1.01] transition-all ${alert.bg} ${alert.border}`}>
                <alert.icon className={`w-4 h-4 shrink-0 ${alert.color}`} />
                <span className="text-sm text-[var(--text)]">{alert.text}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-[var(--text-muted)]" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* Spend Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }} className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[var(--text)]">Monthly Spend</h3>
              <p className="text-xs text-[var(--text-muted)]">Total procurement spend per month</p>
            </div>
            <span className="badge bg-primary-500/15 text-primary-500">2025</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_SPEND}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2.5}
                fill="url(#spendGrad)" dot={false} activeDot={{ r: 5, fill: "#f97316" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Suppliers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--text)]">Top Suppliers</h3>
            <Link href="/dashboard/suppliers"
              className="text-xs text-primary-500 hover:text-primary-400 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {TOP_SUPPLIERS.map((sup, i) => {
              const maxSpent = TOP_SUPPLIERS[0].spent
              const pct = (sup.spent / maxSpent) * 100
              return (
                <div key={sup.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--text-muted)] w-4">#{i+1}</span>
                      <span className="text-sm font-medium text-[var(--text)] truncate max-w-28">{sup.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[var(--text-muted)]">{sup.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[var(--border)] rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                        className="h-full bg-primary-500 rounded-full"
                      />
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-muted)] shrink-0">
                      {formatPrice(sup.spent)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }} className="card overflow-hidden">
        <div className="flex items-center justify-between p-5"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="font-bold text-[var(--text)]">Recent Purchase Orders</h3>
          <Link href="/dashboard/orders"
            className="text-xs text-primary-500 hover:text-primary-400 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Order #", "Supplier", "Amount", "Status", "Date"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-[var(--text-muted)]
                  uppercase tracking-wider px-4 py-3 first:pl-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {RECENT_ORDERS.map((order, i) => {
              const sc = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
              return (
                <motion.tr key={order.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
                  className="hover:bg-black/3 dark:hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3.5 pl-5">
                    <span className="text-sm font-mono font-semibold text-primary-500">{order.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-[var(--text)]">{order.supplier}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-bold text-[var(--text)]">{formatPrice(order.amount)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("badge text-xs", sc.bg, sc.color)}>{sc.label}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-[var(--text-muted)]">{order.date}</span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>
    </DashboardLayout>
  )
}