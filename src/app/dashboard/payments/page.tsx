"use client"

import { useState }  from "react"
import { motion }    from "framer-motion"
import {
  CreditCard, Search, Download,
  AlertCircle, Clock, CheckCircle,
  TrendingUp, Filter
} from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { formatPrice, formatDate, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const STATUS_CONFIG = {
  PENDING:    { label: "Pending",    color: "text-yellow-500", bg: "bg-yellow-500/15", dot: "bg-yellow-500" },
  PROCESSING: { label: "Processing", color: "text-blue-500",   bg: "bg-blue-500/15",   dot: "bg-blue-500"   },
  PAID:       { label: "Paid",       color: "text-green-500",  bg: "bg-green-500/15",  dot: "bg-green-500"  },
  FAILED:     { label: "Failed",     color: "text-red-500",    bg: "bg-red-500/15",    dot: "bg-red-500"    },
  OVERDUE:    { label: "Overdue",    color: "text-red-500",    bg: "bg-red-500/15",    dot: "bg-red-500"    },
  REFUNDED:   { label: "Refunded",   color: "text-purple-500", bg: "bg-purple-500/15", dot: "bg-purple-500" },
}

const METHOD_CONFIG = {
  BANK_TRANSFER: { label: "Bank Transfer", icon: "🏦" },
  CREDIT_CARD:   { label: "Credit Card",   icon: "💳" },
  CASH:          { label: "Cash",          icon: "💵" },
  CHECK:         { label: "Check",         icon: "📝" },
  ONLINE:        { label: "Online",        icon: "🌐" },
}

const MOCK_PAYMENTS = [
  {
    id: "1", reference: "PAY-2025-001", supplier: "TechCore Solutions",
    status: "PAID", method: "BANK_TRANSFER",
    amount: 16500, currency: "USD",
    dueDate: "2025-03-30", paidAt: "2025-03-28",
    invoiceNumber: "INV-TC-2025-042",
  },
  {
    id: "2", reference: "PAY-2025-002", supplier: "Global Supplies Co.",
    status: "PENDING", method: "BANK_TRANSFER",
    amount: 9350, currency: "USD",
    dueDate: "2025-05-01", paidAt: null,
    invoiceNumber: "INV-GS-2025-018",
  },
  {
    id: "3", reference: "PAY-2025-003", supplier: "ServicePro Inc.",
    status: "OVERDUE", method: "CREDIT_CARD",
    amount: 5000, currency: "USD",
    dueDate: "2025-03-15", paidAt: null,
    invoiceNumber: "INV-SP-2025-007",
  },
  {
    id: "4", reference: "PAY-2025-004", supplier: "TechCore Solutions",
    status: "PROCESSING", method: "BANK_TRANSFER",
    amount: 8000, currency: "USD",
    dueDate: "2025-04-30", paidAt: null,
    invoiceNumber: "INV-TC-2025-055",
  },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS)
  const [search,   setSearch]   = useState("")
  const [status,   setStatus]   = useState("ALL")

  const filtered = payments.filter(p => {
    const matchSearch = p.supplier.toLowerCase().includes(search.toLowerCase()) ||
                        p.reference.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === "ALL" || p.status === status
    return matchSearch && matchStatus
  })

  const totalPaid    = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0)
  const totalPending = payments.filter(p => ["PENDING","PROCESSING"].includes(p.status)).reduce((s, p) => s + p.amount, 0)
  const totalOverdue = payments.filter(p => p.status === "OVERDUE").reduce((s, p) => s + p.amount, 0)

  function markAsPaid(id: string) {
    setPayments(prev => prev.map(p => p.id === id
      ? { ...p, status: "PAID", paidAt: new Date().toISOString().split("T")[0] }
      : p
    ))
    toast.success("Payment marked as paid!")
  }

  return (
    <DashboardLayout>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Paid",    value: formatPrice(totalPaid),    color: "text-green-500",   bg: "bg-green-500/15",   icon: CheckCircle  },
          { label: "Pending",       value: formatPrice(totalPending), color: "text-yellow-500",  bg: "bg-yellow-500/15",  icon: Clock        },
          { label: "Overdue",       value: formatPrice(totalOverdue), color: "text-red-500",     bg: "bg-red-500/15",     icon: AlertCircle  },
          { label: "Total Payments",value: payments.length,           color: "text-primary-500", bg: "bg-primary-500/15", icon: CreditCard   },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="card p-4">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.bg)}>
              <s.icon className={cn("w-4 h-4", s.color)} />
            </div>
            <p className="text-xl font-bold text-[var(--text)]">{s.value}</p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Overdue Alert */}
      {totalOverdue > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-4 rounded-xl mb-5 border border-red-500/20"
          style={{ background: "rgba(239,68,68,0.05)" }}>
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-[var(--text)]">
            You have <span className="font-bold text-red-500">{formatPrice(totalOverdue)}</span> in overdue payments.
            Please review and process them immediately.
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search payments..." className="input pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL","PENDING","PROCESSING","PAID","OVERDUE"].map(s => (
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
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Reference","Supplier","Invoice","Method","Amount","Due Date","Status",""].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-[var(--text-muted)]
                  uppercase tracking-wider px-4 py-3 first:pl-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {filtered.map((payment, i) => {
              const sc = STATUS_CONFIG[payment.status as keyof typeof STATUS_CONFIG]
              const mc = METHOD_CONFIG[payment.method as keyof typeof METHOD_CONFIG]
              return (
                <motion.tr key={payment.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-black/3 dark:hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3.5 pl-5">
                    <span className="text-sm font-mono font-semibold text-primary-500">{payment.reference}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-[var(--text)]">{payment.supplier}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-[var(--text-muted)]">{payment.invoiceNumber}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-[var(--text-muted)]">
                      {mc.icon} {mc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-bold text-[var(--text)]">{formatPrice(payment.amount)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("text-xs",
                      payment.status === "OVERDUE" ? "text-red-500 font-semibold" : "text-[var(--text-muted)]"
                    )}>
                      {formatDate(payment.dueDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("badge text-xs", sc.bg, sc.color)}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 pr-5">
                    <div className="flex gap-1.5">
                      {["PENDING","OVERDUE","PROCESSING"].includes(payment.status) && (
                        <button onClick={() => markAsPaid(payment.id)}
                          className="text-xs px-2.5 py-1.5 bg-green-500/15 text-green-500 rounded-lg
                            hover:bg-green-500/25 transition-colors font-medium">
                          Mark Paid
                        </button>
                      )}
                      <button className="btn-ghost p-1.5" onClick={() => toast.success("Downloading...")}>
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}