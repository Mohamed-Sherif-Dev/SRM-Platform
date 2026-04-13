"use client"

import { useState }  from "react"
import { motion }    from "framer-motion"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { formatPrice, cn } from "@/lib/utils"

const MONTHLY_SPEND = [
  { month: "Jan", spend: 28000, orders: 8  },
  { month: "Feb", spend: 35000, orders: 12 },
  { month: "Mar", spend: 42000, orders: 15 },
  { month: "Apr", spend: 31000, orders: 10 },
  { month: "May", spend: 48000, orders: 18 },
  { month: "Jun", spend: 52000, orders: 20 },
  { month: "Jul", spend: 45000, orders: 16 },
  { month: "Aug", spend: 61000, orders: 22 },
  { month: "Sep", spend: 57000, orders: 19 },
  { month: "Oct", spend: 73000, orders: 26 },
  { month: "Nov", spend: 68000, orders: 24 },
  { month: "Dec", spend: 85000, orders: 30 },
]

const CATEGORY_SPEND = [
  { name: "Technology",    value: 125000, color: "#3b82f6" },
  { name: "Services",      value: 78000,  color: "#f97316" },
  { name: "Goods",         value: 89000,  color: "#10b981" },
  { name: "Logistics",     value: 45000,  color: "#8b5cf6" },
  { name: "Raw Materials", value: 32000,  color: "#f59e0b" },
]

const SUPPLIER_PERF = [
  { supplier: "TechCore",    rating: 4.8, delivery: 96, quality: 4.7 },
  { supplier: "ServicePro",  rating: 4.6, delivery: 94, quality: 4.5 },
  { supplier: "GlobalSup",   rating: 4.5, delivery: 91, quality: 4.4 },
  { supplier: "FastLog",     rating: 4.2, delivery: 88, quality: 4.1 },
  { supplier: "RawMat",      rating: 3.8, delivery: 78, quality: 3.9 },
]

const RADAR_DATA = [
  { metric: "Quality",      score: 87 },
  { metric: "Delivery",     score: 92 },
  { metric: "Pricing",      score: 78 },
  { metric: "Communication",score: 85 },
  { metric: "Reliability",  score: 90 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-3 shadow-2xl text-sm">
      <p className="text-[var(--text-muted)] text-xs mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold" style={{ color: p.color }}>
          {p.name === "spend" ? formatPrice(p.value) : p.value} {p.name !== "spend" && p.name}
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("12M")
  const data = period === "3M" ? MONTHLY_SPEND.slice(-3) : period === "6M" ? MONTHLY_SPEND.slice(-6) : MONTHLY_SPEND

  return (
    <DashboardLayout>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Annual Spend",    value: "$625K",  change: "+12.4%", positive: true  },
          { label: "Total Orders",    value: "200",    change: "+18.2%", positive: true  },
          { label: "Avg Order Value", value: "$3,125", change: "+4.1%",  positive: true  },
          { label: "Savings Rate",    value: "8.3%",   change: "+1.2%",  positive: true  },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="card p-4">
            <p className="text-xs text-[var(--text-muted)] mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-[var(--text)]">{kpi.value}</p>
            <span className={cn("text-xs font-semibold mt-1 inline-block",
              kpi.positive ? "text-green-500" : "text-red-500")}>
              {kpi.change} vs last year
            </span>
          </motion.div>
        ))}
      </div>

      {/* Spend Chart */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[var(--text)]">Procurement Spend</h2>
        <div className="flex gap-1 p-1 rounded-xl border"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
          {["3M","6M","12M"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                period === p ? "bg-primary-600 text-white" : "text-[var(--text-muted)]")}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }} className="card p-5 mb-5">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
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
            <Area type="monotone" dataKey="spend" stroke="#f97316" strokeWidth={2.5}
              fill="url(#spendGrad)" dot={false} activeDot={{ r: 5, fill: "#f97316" }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Orders Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }} className="card p-5">
          <h3 className="font-bold text-[var(--text)] mb-4">Orders per Month</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Spend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }} className="card p-5">
          <h3 className="font-bold text-[var(--text)] mb-4">Spend by Category</h3>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={CATEGORY_SPEND} cx="50%" cy="50%"
                innerRadius={35} outerRadius={55}
                paddingAngle={3} dataKey="value">
                {CATEGORY_SPEND.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [formatPrice(v)]}
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CATEGORY_SPEND.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-[var(--text-muted)]">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-[var(--text)]">{formatPrice(item.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Supplier Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }} className="card p-5">
          <h3 className="font-bold text-[var(--text)] mb-4">Overall Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
              <Radar dataKey="score" stroke="#f97316" fill="#f97316" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Supplier Performance Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }} className="card overflow-hidden mt-5">
        <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="font-bold text-[var(--text)]">Supplier Performance Comparison</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Rank","Supplier","Rating","On-Time Delivery","Quality Score","Performance"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-[var(--text-muted)]
                  uppercase tracking-wider px-4 py-3 first:pl-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {SUPPLIER_PERF.map((sup, i) => (
              <tr key={sup.supplier} className="hover:bg-black/3 dark:hover:bg-white/3 transition-colors">
                <td className="px-4 py-3.5 pl-5">
                  <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold",
                    i === 0 ? "bg-yellow-500/20 text-yellow-500" :
                    i === 1 ? "bg-gray-400/20 text-gray-400"    :
                    i === 2 ? "bg-orange-500/20 text-orange-500" : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                  )}>
                    {i + 1}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-[var(--text)]">{sup.supplier}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-bold text-[var(--text)]">{sup.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-[var(--border)] rounded-full h-1.5">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${sup.delivery}%` }} />
                    </div>
                    <span className="text-sm text-[var(--text)]">{sup.delivery}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-[var(--text)]">{sup.quality}/5</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(star => (
                      <div key={star} className={cn("w-2 h-2 rounded-full",
                        star <= Math.round(sup.rating) ? "bg-primary-500" : "bg-[var(--border)]"
                      )} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </DashboardLayout>
  )
}