"use client"

import { useState }  from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2, Plus, Search, Star, MapPin,
  Phone, Mail, Globe, MoreVertical,
  Filter, X, Check, Loader2, TrendingUp,
  Package, DollarSign, Award
} from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { formatPrice, getInitials, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const SUPPLIERS = [
  {
    id: "1", name: "TechCore Solutions", code: "SUP-001",
    category: "TECHNOLOGY", status: "ACTIVE",
    email: "contact@techcore.com", phone: "+1 555-0101",
    country: "USA", city: "New York", contactPerson: "John Smith",
    avgRating: 4.8, totalOrders: 24, totalSpent: 125000,
    onTimeDelivery: 96, qualityScore: 4.7, isPreferred: true,
    tags: ["technology", "preferred"],
  },
  {
    id: "2", name: "Global Supplies Co.", code: "SUP-002",
    category: "GOODS", status: "ACTIVE",
    email: "info@globalsupplies.com", phone: "+44 20-7946-0958",
    country: "UK", city: "London", contactPerson: "Sarah Johnson",
    avgRating: 4.5, totalOrders: 38, totalSpent: 89000,
    onTimeDelivery: 91, qualityScore: 4.4, isPreferred: false,
    tags: ["goods", "bulk"],
  },
  {
    id: "3", name: "FastLog Logistics", code: "SUP-003",
    category: "LOGISTICS", status: "ACTIVE",
    email: "ops@fastlog.com", phone: "+49 30-1234-5678",
    country: "Germany", city: "Berlin", contactPerson: "Hans Mueller",
    avgRating: 4.2, totalOrders: 15, totalSpent: 45000,
    onTimeDelivery: 88, qualityScore: 4.1, isPreferred: false,
    tags: ["logistics"],
  },
  {
    id: "4", name: "RawMat Industries", code: "SUP-004",
    category: "RAW_MATERIALS", status: "INACTIVE",
    email: "sales@rawmat.com", phone: "+86 10-8888-8888",
    country: "China", city: "Shanghai", contactPerson: "Li Wei",
    avgRating: 3.8, totalOrders: 8, totalSpent: 32000,
    onTimeDelivery: 78, qualityScore: 3.9, isPreferred: false,
    tags: ["raw-materials"],
  },
  {
    id: "5", name: "ServicePro Inc.", code: "SUP-005",
    category: "SERVICES", status: "ACTIVE",
    email: "hello@servicepro.com", phone: "+971 4-555-0101",
    country: "UAE", city: "Dubai", contactPerson: "Omar Al-Rashid",
    avgRating: 4.6, totalOrders: 20, totalSpent: 78000,
    onTimeDelivery: 94, qualityScore: 4.5, isPreferred: true,
    tags: ["services", "preferred"],
  },
]

const STATUS_CONFIG = {
  ACTIVE:      { label: "Active",      color: "text-green-500",  bg: "bg-green-500/15",  dot: "bg-green-500"  },
  INACTIVE:    { label: "Inactive",    color: "text-gray-400",   bg: "bg-gray-500/15",   dot: "bg-gray-400"   },
  BLACKLISTED: { label: "Blacklisted", color: "text-red-500",    bg: "bg-red-500/15",    dot: "bg-red-500"    },
  PENDING:     { label: "Pending",     color: "text-yellow-500", bg: "bg-yellow-500/15", dot: "bg-yellow-500" },
}

const CATEGORY_COLORS: Record<string, string> = {
  TECHNOLOGY:    "text-blue-500 bg-blue-500/10",
  GOODS:         "text-green-500 bg-green-500/10",
  LOGISTICS:     "text-purple-500 bg-purple-500/10",
  RAW_MATERIALS: "text-orange-500 bg-orange-500/10",
  SERVICES:      "text-cyan-500 bg-cyan-500/10",
  OTHER:         "text-gray-400 bg-gray-500/10",
}

export default function SuppliersPage() {
  const [suppliers,   setSuppliers]   = useState(SUPPLIERS)
  const [search,      setSearch]      = useState("")
  const [statusFilter,setStatusFilter]= useState("ALL")
  const [view,        setView]        = useState<"grid" | "table">("grid")
  const [selected,    setSelected]    = useState<string | null>(null)
  const [showModal,   setShowModal]   = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [form,        setForm]        = useState({
    name: "", category: "GOODS", email: "", phone: "", country: "", city: "", contactPerson: ""
  })

  const filtered = suppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.code.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const selectedSupplier = suppliers.find(s => s.id === selected)

  async function handleCreate() {
    if (!form.name) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const code = `SUP-00${suppliers.length + 1}`
    setSuppliers(prev => [...prev, {
      id: String(prev.length + 1), code, status: "PENDING",
      avgRating: 0, totalOrders: 0, totalSpent: 0,
      onTimeDelivery: 0, qualityScore: 0, isPreferred: false,
      tags: [], website: "", ...form
    } as any])
    toast.success("Supplier added!")
    setShowModal(false)
    setForm({ name: "", category: "GOODS", email: "", phone: "", country: "", city: "", contactPerson: "" })
    setLoading(false)
  }

  return (
    <DashboardLayout>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",      value: suppliers.length,                                         color: "text-primary-500", bg: "bg-primary-500/15" },
          { label: "Active",     value: suppliers.filter(s => s.status === "ACTIVE").length,      color: "text-green-500",   bg: "bg-green-500/15"   },
          { label: "Preferred",  value: suppliers.filter(s => s.isPreferred).length,              color: "text-yellow-500",  bg: "bg-yellow-500/15"  },
          { label: "Avg Rating", value: (suppliers.reduce((a, s) => a + s.avgRating, 0) / suppliers.length).toFixed(1), color: "text-blue-500", bg: "bg-blue-500/15" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="card p-4">
            <p className="text-2xl font-bold text-[var(--text)]">{s.value}</p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{s.label} Suppliers</p>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search suppliers..." className="input pl-10" />
        </div>
        <div className="flex gap-2">
          {["ALL","ACTIVE","INACTIVE","PENDING"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                statusFilter === s
                  ? "border-primary-500 bg-primary-500/15 text-primary-500"
                  : "border-[var(--border)] text-[var(--text-muted)]"
              )}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      <div className="flex gap-5">
        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((sup, i) => {
              const sc = STATUS_CONFIG[sup.status as keyof typeof STATUS_CONFIG]
              const cc = CATEGORY_COLORS[sup.category] || CATEGORY_COLORS.OTHER
              return (
                <motion.div key={sup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelected(sup.id === selected ? null : sup.id)}
                  className={cn(
                    "card p-5 cursor-pointer hover:shadow-lg transition-all group",
                    selected === sup.id && "ring-2 ring-primary-500/50"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-primary-500/15 rounded-2xl flex items-center justify-center text-sm font-bold text-primary-500">
                        {getInitials(sup.name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-sm text-[var(--text)] group-hover:text-primary-500 transition-colors">
                            {sup.name}
                          </p>
                          {sup.isPreferred && (
                            <Award className="w-3.5 h-3.5 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">{sup.code}</p>
                      </div>
                    </div>
                    <span className={cn("badge text-[10px]", sc.bg, sc.color)}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                      {sc.label}
                    </span>
                  </div>

                  {/* Category + Location */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("badge text-[10px]", cc)}>
                      {sup.category.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <MapPin className="w-3 h-3" />
                      {sup.city}, {sup.country}
                    </div>
                  </div>

                  {/* Rating + Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                      <div className="flex items-center justify-center gap-0.5 mb-0.5">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-[var(--text)]">{sup.avgRating}</span>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)]">Rating</p>
                    </div>
                    <div className="text-center p-2 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                      <p className="text-sm font-bold text-[var(--text)]">{sup.totalOrders}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Orders</p>
                    </div>
                    <div className="text-center p-2 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                      <p className="text-sm font-bold text-[var(--text)]">{sup.onTimeDelivery}%</p>
                      <p className="text-[10px] text-[var(--text-muted)]">On Time</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid var(--border)" }}>
                    <span className="text-xs font-bold text-primary-500">
                      {formatPrice(sup.totalSpent)}
                    </span>
                    <div className="flex gap-2 text-xs text-[var(--text-muted)]">
                      {sup.tags.slice(0, 2).map(t => (
                        <span key={t} className="badge bg-[var(--bg-secondary)] text-[var(--text-muted)] text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedSupplier && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-72 shrink-0 card p-5 h-fit sticky top-20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--text)]">Details</h3>
                <button onClick={() => setSelected(null)} className="btn-ghost p-1.5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center mb-5">
                <div className="w-16 h-16 bg-primary-500/15 rounded-2xl flex items-center justify-center text-xl font-bold text-primary-500 mx-auto mb-3">
                  {getInitials(selectedSupplier.name)}
                </div>
                <p className="font-bold text-[var(--text)]">{selectedSupplier.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{selectedSupplier.code}</p>
                {selectedSupplier.isPreferred && (
                  <span className="badge bg-yellow-500/15 text-yellow-500 text-xs mt-2">
                    <Award className="w-3 h-3" />
                    Preferred Supplier
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                {[
                  { icon: Mail,   label: selectedSupplier.email    },
                  { icon: Phone,  label: selectedSupplier.phone    },
                  { icon: MapPin, label: `${selectedSupplier.city}, ${selectedSupplier.country}` },
                ].map(item => item.label && (
                  <div key={item.label} className="flex items-center gap-2.5 text-xs text-[var(--text-muted)]">
                    <item.icon className="w-4 h-4 shrink-0 text-primary-500" />
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "Rating",     value: selectedSupplier.avgRating, suffix: "/5"  },
                  { label: "Orders",     value: selectedSupplier.totalOrders, suffix: ""  },
                  { label: "On Time",    value: `${selectedSupplier.onTimeDelivery}%`, suffix: "" },
                  { label: "Quality",    value: selectedSupplier.qualityScore, suffix: "/5" },
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-xl text-center"
                    style={{ background: "var(--bg-secondary)" }}>
                    <p className="text-sm font-bold text-[var(--text)]">{item.value}{item.suffix}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-xs text-[var(--text-muted)] mb-1">Total Spent</p>
                <p className="text-lg font-bold text-primary-500">
                  {formatPrice(selectedSupplier.totalSpent)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Supplier Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg text-[var(--text)]">Add New Supplier</h2>
                <button onClick={() => setShowModal(false)} className="btn-ghost p-1.5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "name",          label: "Company Name *",   col: "col-span-2" },
                  { key: "contactPerson", label: "Contact Person",   col: ""           },
                  { key: "email",         label: "Email",            col: ""           },
                  { key: "phone",         label: "Phone",            col: ""           },
                  { key: "country",       label: "Country",          col: ""           },
                  { key: "city",          label: "City",             col: ""           },
                ].map(f => (
                  <div key={f.key} className={f.col}>
                    <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                      {f.label}
                    </label>
                    <input type="text" value={(form as any)[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="input" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="input">
                    {["GOODS","SERVICES","RAW_MATERIALS","TECHNOLOGY","LOGISTICS","OTHER"].map(c => (
                      <option key={c} value={c}>{c.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button onClick={handleCreate} disabled={!form.name || loading} className="flex-1 btn-primary">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" />Add Supplier</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}