"use client"

import { useState }  from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText, Plus, Search, Calendar,
  AlertCircle, Check, X, Loader2,
  RefreshCw, Clock, DollarSign
} from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { formatPrice, formatDate, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const STATUS_CONFIG = {
  DRAFT:      { label: "Draft",      color: "text-gray-400",   bg: "bg-gray-500/15"   },
  ACTIVE:     { label: "Active",     color: "text-green-500",  bg: "bg-green-500/15"  },
  EXPIRED:    { label: "Expired",    color: "text-red-500",    bg: "bg-red-500/15"    },
  TERMINATED: { label: "Terminated", color: "text-red-500",    bg: "bg-red-500/15"    },
  RENEWED:    { label: "Renewed",    color: "text-blue-500",   bg: "bg-blue-500/15"   },
}

const MOCK_CONTRACTS = [
  {
    id: "1", number: "CON-2025-001", supplier: "TechCore Solutions",
    title: "Annual Software License Agreement",
    status: "ACTIVE", value: 60000, currency: "USD",
    startDate: "2025-01-01", endDate: "2025-12-31",
    autoRenew: true, paymentTerms: "Net 30",
    daysLeft: 270,
  },
  {
    id: "2", number: "CON-2025-002", supplier: "ServicePro Inc.",
    title: "IT Consulting Services Contract",
    status: "ACTIVE", value: 120000, currency: "USD",
    startDate: "2025-01-01", endDate: "2025-12-31",
    autoRenew: false, paymentTerms: "Net 60",
    daysLeft: 270,
  },
  {
    id: "3", number: "CON-2024-003", supplier: "Global Supplies Co.",
    title: "Supply Agreement 2024",
    status: "EXPIRED", value: 45000, currency: "USD",
    startDate: "2024-01-01", endDate: "2024-12-31",
    autoRenew: false, paymentTerms: "Net 30",
    daysLeft: -90,
  },
]

export default function ContractsPage() {
  const [contracts,  setContracts]  = useState(MOCK_CONTRACTS)
  const [search,     setSearch]     = useState("")
  const [status,     setStatus]     = useState("ALL")
  const [showModal,  setShowModal]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [form,       setForm]       = useState({
    title: "", supplier: "", value: "", startDate: "", endDate: "", paymentTerms: "Net 30", autoRenew: false
  })

  const filtered = contracts.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.supplier.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === "ALL" || c.status === status
    return matchSearch && matchStatus
  })

  async function handleCreate() {
    if (!form.title || !form.supplier || !form.startDate || !form.endDate) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const num = `CON-2025-00${contracts.length + 1}`
    setContracts(prev => [...prev, {
      id:           String(prev.length + 1),
      number:       num,
      supplier:     form.supplier,
      title:        form.title,
      status:       "DRAFT",
      value:        Number(form.value) || 0,
      currency:     "USD",
      startDate:    form.startDate,
      endDate:      form.endDate,
      autoRenew:    form.autoRenew,
      paymentTerms: form.paymentTerms,
      daysLeft:     90,
    }])
    toast.success("Contract created!")
    setShowModal(false)
    setLoading(false)
  }

  const totalValue   = contracts.filter(c => c.status === "ACTIVE").reduce((s, c) => s + c.value, 0)
  const expiringSOon = contracts.filter(c => c.daysLeft > 0 && c.daysLeft <= 90).length

  return (
    <DashboardLayout>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Contracts", value: contracts.length,                                        color: "text-primary-500", bg: "bg-primary-500/15" },
          { label: "Active",          value: contracts.filter(c => c.status === "ACTIVE").length,     color: "text-green-500",   bg: "bg-green-500/15"   },
          { label: "Expiring Soon",   value: expiringSOon,                                            color: "text-yellow-500",  bg: "bg-yellow-500/15"  },
          { label: "Total Value",     value: formatPrice(totalValue),                                 color: "text-blue-500",    bg: "bg-blue-500/15"    },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="card p-4">
            <p className="text-xl font-bold text-[var(--text)]">{s.value}</p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search contracts..." className="input pl-10" />
        </div>
        <div className="flex gap-2">
          {["ALL","ACTIVE","DRAFT","EXPIRED"].map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={cn("px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                status === s
                  ? "border-primary-500 bg-primary-500/15 text-primary-500"
                  : "border-[var(--border)] text-[var(--text-muted)]"
              )}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          New Contract
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((contract, i) => {
          const sc = STATUS_CONFIG[contract.status as keyof typeof STATUS_CONFIG]
          const isExpiringSoon = contract.daysLeft > 0 && contract.daysLeft <= 90
          return (
            <motion.div key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary-500">{contract.number}</span>
                    <span className={cn("badge text-xs", sc.bg, sc.color)}>{sc.label}</span>
                    {contract.autoRenew && (
                      <span className="badge bg-blue-500/15 text-blue-500 text-[10px]">
                        <RefreshCw className="w-3 h-3" />
                        Auto-renew
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[var(--text)]">{contract.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{contract.supplier}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-500">{formatPrice(contract.value)}</p>
                  <p className="text-xs text-[var(--text-muted)]">{contract.paymentTerms}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(contract.startDate)}
                </div>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(contract.endDate)}
                </div>
              </div>

              {/* Days Left */}
              {contract.daysLeft > 0 ? (
                <div className={cn(
                  "flex items-center gap-2 p-2.5 rounded-xl text-xs",
                  isExpiringSoon
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-green-500/10 text-green-500"
                )}>
                  {isExpiringSoon
                    ? <AlertCircle className="w-3.5 h-3.5" />
                    : <Clock className="w-3.5 h-3.5" />
                  }
                  {contract.daysLeft} days remaining
                  {isExpiringSoon && " — Expiring Soon!"}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2.5 rounded-xl text-xs bg-red-500/10 text-red-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Expired {Math.abs(contract.daysLeft)} days ago
                </div>
              )}
            </motion.div>
          )
        })}
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
              className="card p-6 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg text-[var(--text)]">New Contract</h2>
                <button onClick={() => setShowModal(false)} className="btn-ghost p-1.5">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "title",    label: "Contract Title *", col: "col-span-2", type: "text" },
                  { key: "supplier", label: "Supplier *",       col: "",           type: "text" },
                  { key: "value",    label: "Value (USD)",      col: "",           type: "number" },
                  { key: "startDate",label: "Start Date *",     col: "",           type: "date" },
                  { key: "endDate",  label: "End Date *",       col: "",           type: "date" },
                ].map(f => (
                  <div key={f.key} className={f.col}>
                    <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input type={f.type} value={(form as any)[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="input" />
                  </div>
                ))}
                <div className="col-span-2 flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "var(--bg-secondary)" }}>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">Auto Renewal</p>
                    <p className="text-xs text-[var(--text-muted)]">Automatically renew before expiry</p>
                  </div>
                  <button onClick={() => setForm({ ...form, autoRenew: !form.autoRenew })}
                    className={cn("w-11 h-6 rounded-full transition-all relative",
                      form.autoRenew ? "bg-primary-600" : "bg-[var(--border)]")}>
                    <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                      form.autoRenew ? "left-6" : "left-1")} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button onClick={handleCreate}
                  disabled={!form.title || !form.supplier || !form.startDate || !form.endDate || loading}
                  className="flex-1 btn-primary">
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