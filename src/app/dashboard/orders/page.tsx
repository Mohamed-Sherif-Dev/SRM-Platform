"use client"

import { useState }  from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart, Plus, Search, Eye,
  Check, X, Loader2, Clock, Package
} from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { formatPrice, formatDate, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const STATUS_CONFIG = {
  DRAFT:     { label: "Draft",     color: "text-gray-400",   bg: "bg-gray-500/15",   dot: "bg-gray-400"   },
  PENDING:   { label: "Pending",   color: "text-yellow-500", bg: "bg-yellow-500/15", dot: "bg-yellow-500" },
  APPROVED:  { label: "Approved",  color: "text-blue-500",   bg: "bg-blue-500/15",   dot: "bg-blue-500"   },
  ORDERED:   { label: "Ordered",   color: "text-purple-500", bg: "bg-purple-500/15", dot: "bg-purple-500" },
  RECEIVED:  { label: "Received",  color: "text-green-500",  bg: "bg-green-500/15",  dot: "bg-green-500"  },
  CANCELLED: { label: "Cancelled", color: "text-red-500",    bg: "bg-red-500/15",    dot: "bg-red-500"    },
}

const PRIORITY_CONFIG = {
  LOW:    { label: "Low",    color: "text-green-500"  },
  MEDIUM: { label: "Medium", color: "text-blue-500"   },
  HIGH:   { label: "High",   color: "text-orange-500" },
  URGENT: { label: "Urgent", color: "text-red-500"    },
}

const MOCK_ORDERS = [
  {
    id: "1", number: "PO-2025-001", supplier: "TechCore Solutions",
    title: "Software Licenses Q2", status: "RECEIVED", priority: "HIGH",
    totalAmount: 16500, currency: "USD",
    orderDate: "2025-03-01", expectedDate: "2025-03-15",
    items: 2,
  },
  {
    id: "2", number: "PO-2025-002", supplier: "Global Supplies Co.",
    title: "Office Supplies Bulk Order", status: "APPROVED", priority: "MEDIUM",
    totalAmount: 9350, currency: "USD",
    orderDate: "2025-04-01", expectedDate: "2025-04-20",
    items: 2,
  },
  {
    id: "3", number: "PO-2025-003", supplier: "FastLog Logistics",
    title: "Express Shipping Services", status: "PENDING", priority: "URGENT",
    totalAmount: 3200, currency: "USD",
    orderDate: "2025-04-04", expectedDate: "2025-04-10",
    items: 2,
  },
  {
    id: "4", number: "PO-2025-004", supplier: "ServicePro Inc.",
    title: "IT Consulting Services", status: "DRAFT", priority: "LOW",
    totalAmount: 27500, currency: "USD",
    orderDate: "2025-04-05", expectedDate: "2025-05-05",
    items: 2,
  },
]

export default function OrdersPage() {
  const [orders,    setOrders]    = useState(MOCK_ORDERS)
  const [search,    setSearch]    = useState("")
  const [status,    setStatus]    = useState("ALL")
  const [selected,  setSelected]  = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [form,      setForm]      = useState({
    title: "", supplier: "", priority: "MEDIUM", expectedDate: ""
  })

  const filtered = orders.filter(o => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
                        o.number.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === "ALL" || o.status === status
    return matchSearch && matchStatus
  })

  const selectedOrder = orders.find(o => o.id === selected)

  function updateStatus(id: string, newStatus: string) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
    toast.success(`Order status updated to ${newStatus}`)
  }

  async function handleCreate() {
    if (!form.title || !form.supplier) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const num = `PO-2025-00${orders.length + 1}`
    setOrders(prev => [{
      id: String(prev.length + 1), number: num,
      supplier: form.supplier, title: form.title,
      status: "DRAFT", priority: form.priority,
      totalAmount: 0, currency: "USD",
      orderDate: new Date().toISOString().split("T")[0],
      expectedDate: form.expectedDate,
      items: 0,
    }, ...prev])
    toast.success("Purchase Order created!")
    setShowModal(false)
    setForm({ title: "", supplier: "", priority: "MEDIUM", expectedDate: "" })
    setLoading(false)
  }

  const counts = {
    ALL: orders.length,
    PENDING:  orders.filter(o => o.status === "PENDING").length,
    APPROVED: orders.filter(o => o.status === "APPROVED").length,
    RECEIVED: orders.filter(o => o.status === "RECEIVED").length,
    DRAFT:    orders.filter(o => o.status === "DRAFT").length,
  }

  return (
    <DashboardLayout>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Orders",  value: orders.length,                                               color: "text-primary-500", bg: "bg-primary-500/15" },
          { label: "Pending",       value: orders.filter(o => o.status === "PENDING").length,           color: "text-yellow-500",  bg: "bg-yellow-500/15"  },
          { label: "Total Value",   value: formatPrice(orders.reduce((s, o) => s + o.totalAmount, 0)),  color: "text-green-500",   bg: "bg-green-500/15"   },
          { label: "Received",      value: orders.filter(o => o.status === "RECEIVED").length,          color: "text-blue-500",    bg: "bg-blue-500/15"    },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="card p-4">
            <p className="text-2xl font-bold text-[var(--text)]">{s.value}</p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..." className="input pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(counts).map(([s, count]) => (
            <button key={s} onClick={() => setStatus(s)}
              className={cn("px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                status === s
                  ? "border-primary-500 bg-primary-500/15 text-primary-500"
                  : "border-[var(--border)] text-[var(--text-muted)]"
              )}>
              {s} ({count})
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          New Order
        </button>
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 min-w-0 card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Order #","Title","Supplier","Amount","Priority","Status",""].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-[var(--text-muted)]
                    uppercase tracking-wider px-4 py-3 first:pl-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map((order, i) => {
                const sc = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                const pc = PRIORITY_CONFIG[order.priority as keyof typeof PRIORITY_CONFIG]
                return (
                  <motion.tr key={order.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(order.id === selected ? null : order.id)}
                    className={cn(
                      "hover:bg-black/3 dark:hover:bg-white/3 transition-colors cursor-pointer",
                      selected === order.id && "bg-primary-500/5"
                    )}>
                    <td className="px-4 py-3.5 pl-5">
                      <span className="text-sm font-mono font-semibold text-primary-500">{order.number}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-[var(--text)]">{order.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">{order.items} items</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-[var(--text-muted)]">{order.supplier}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-[var(--text)]">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-xs font-semibold", pc.color)}>{pc.label}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("badge text-xs", sc.bg, sc.color)}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 pr-5">
                      <button className="btn-ghost p-1.5">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Order Detail */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-64 shrink-0 card p-5 h-fit sticky top-20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--text)]">Order Details</h3>
                <button onClick={() => setSelected(null)} className="btn-ghost p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-4 text-sm">
                {[
                  { label: "Order #",   value: selectedOrder.number,           mono: true  },
                  { label: "Supplier",  value: selectedOrder.supplier,         mono: false },
                  { label: "Amount",    value: formatPrice(selectedOrder.totalAmount), mono: false },
                  { label: "Date",      value: formatDate(selectedOrder.orderDate), mono: false   },
                  { label: "Expected",  value: formatDate(selectedOrder.expectedDate), mono: false },
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-[var(--text-muted)]">{item.label}</span>
                    <span className={cn("font-medium text-[var(--text)]", item.mono && "font-mono text-primary-500")}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Actions */}
              {!["RECEIVED","CANCELLED"].includes(selectedOrder.status) && (
                <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Update Status
                  </p>
                  <div className="space-y-2">
                    {(["PENDING","APPROVED","ORDERED","RECEIVED","CANCELLED"] as const)
                      .filter(s => s !== selectedOrder.status)
                      .map(s => {
                        const sc = STATUS_CONFIG[s]
                        return (
                          <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                            className={cn("w-full py-2 rounded-xl text-xs font-semibold border-0 transition-all", sc.bg, sc.color, "hover:opacity-80")}>
                            → {sc.label}
                          </button>
                        )
                      })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg text-[var(--text)]">New Purchase Order</h2>
                <button onClick={() => setShowModal(false)} className="btn-ghost p-1.5">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { key: "title",    label: "Order Title *",  type: "text"   },
                  { key: "supplier", label: "Supplier *",     type: "text"   },
                  { key: "expectedDate", label: "Expected Date", type: "date" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input type={f.type} value={(form as any)[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="input" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="input">
                    {["LOW","MEDIUM","HIGH","URGENT"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button onClick={handleCreate} disabled={!form.title || !form.supplier || loading} className="flex-1 btn-primary">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" />Create</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}