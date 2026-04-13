"use client"

import { useState }  from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star, Plus, X, Check, Loader2,
  TrendingUp, Award, MessageSquare
} from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const MOCK_RATINGS = [
  {
    id: "1", supplier: "TechCore Solutions", user: "Mohammed Sherif",
    overall: 4.8, quality: 4.9, delivery: 4.7, communication: 4.8, pricing: 4.6,
    comment: "Excellent service and product quality! Always delivers on time.",
    createdAt: "2025-03-15",
  },
  {
    id: "2", supplier: "ServicePro Inc.", user: "Ahmed Hassan",
    overall: 4.6, quality: 4.7, delivery: 4.5, communication: 4.8, pricing: 4.4,
    comment: "Very professional team. Communication is top-notch.",
    createdAt: "2025-03-20",
  },
  {
    id: "3", supplier: "Global Supplies Co.", user: "Mohammed Sherif",
    overall: 4.5, quality: 4.4, delivery: 4.6, communication: 4.3, pricing: 4.7,
    comment: "Good value for money. Delivery could be slightly faster.",
    createdAt: "2025-04-01",
  },
  {
    id: "4", supplier: "FastLog Logistics", user: "Ahmed Hassan",
    overall: 4.2, quality: 4.1, delivery: 4.4, communication: 4.0, pricing: 4.3,
    comment: "Decent service. Some delays in communication.",
    createdAt: "2025-04-02",
  },
]

const CRITERIA = ["quality","delivery","communication","pricing"] as const

function StarRating({ value, onChange, size = "sm" }: {
  value: number, onChange?: (v: number) => void, size?: "sm" | "lg"
}) {
  const [hover, setHover] = useState(0)
  const w = size === "lg" ? "w-7 h-7" : "w-4 h-4"
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={cn("transition-colors", !onChange && "cursor-default")}>
          <Star className={cn(w, "transition-colors",
            star <= (hover || value)
              ? "text-yellow-400 fill-yellow-400"
              : "text-[var(--border)]"
          )} />
        </button>
      ))}
    </div>
  )
}

export default function RatingsPage() {
  const [ratings,    setRatings]    = useState(MOCK_RATINGS)
  const [showModal,  setShowModal]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [filterSup,  setFilterSup]  = useState("ALL")
  const [form,       setForm]       = useState({
    supplier: "", overall: 0, quality: 0, delivery: 0, communication: 0, pricing: 0, comment: ""
  })

  const suppliers = ["ALL", ...Array.from(new Set(ratings.map(r => r.supplier)))]

  const filtered = filterSup === "ALL"
    ? ratings
    : ratings.filter(r => r.supplier === filterSup)

  const avgBySupplier = suppliers.filter(s => s !== "ALL").map(sup => {
    const supRatings = ratings.filter(r => r.supplier === sup)
    const avg = supRatings.reduce((a, r) => a + r.overall, 0) / supRatings.length
    return { supplier: sup, avg: avg.toFixed(1), count: supRatings.length }
  }).sort((a, b) => Number(b.avg) - Number(a.avg))

  async function handleSubmit() {
    if (!form.supplier || form.overall === 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setRatings(prev => [{
      id:            String(prev.length + 1),
      supplier:      form.supplier,
      user:          "Mohammed Sherif",
      overall:       form.overall,
      quality:       form.quality || form.overall,
      delivery:      form.delivery || form.overall,
      communication: form.communication || form.overall,
      pricing:       form.pricing || form.overall,
      comment:       form.comment,
      createdAt:     new Date().toISOString().split("T")[0],
    }, ...prev])
    toast.success("Rating submitted!")
    setShowModal(false)
    setForm({ supplier: "", overall: 0, quality: 0, delivery: 0, communication: 0, pricing: 0, comment: "" })
    setLoading(false)
  }

  return (
    <DashboardLayout>

      {/* Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {avgBySupplier.slice(0, 3).map((sup, i) => (
          <motion.div key={sup.supplier} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn("card p-5", i === 0 && "border-yellow-500/30")}>
            <div className="flex items-center justify-between mb-3">
              <span className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold",
                i === 0 ? "bg-yellow-500/20 text-yellow-500" :
                i === 1 ? "bg-gray-400/20 text-gray-400" :
                          "bg-orange-500/20 text-orange-500"
              )}>
                #{i + 1}
              </span>
              {i === 0 && <Award className="w-5 h-5 text-yellow-500" />}
            </div>
            <p className="font-bold text-[var(--text)] mb-1">{sup.supplier}</p>
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(Number(sup.avg))} />
              <span className="text-lg font-bold text-primary-500">{sup.avg}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">{sup.count} reviews</p>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2 flex-wrap">
          {suppliers.map(s => (
            <button key={s} onClick={() => setFilterSup(s)}
              className={cn("px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                filterSup === s
                  ? "border-primary-500 bg-primary-500/15 text-primary-500"
                  : "border-[var(--border)] text-[var(--text-muted)]"
              )}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Rating
        </button>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        {filtered.map((rating, i) => (
          <motion.div key={rating.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-[var(--text)]">{rating.supplier}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  by {rating.user} · {rating.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StarRating value={Math.round(rating.overall)} />
                <span className="text-lg font-bold text-primary-500">{rating.overall}</span>
              </div>
            </div>

            {/* Criteria */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {CRITERIA.map(c => (
                <div key={c} className="p-2.5 rounded-xl text-center"
                  style={{ background: "var(--bg-secondary)" }}>
                  <p className="text-sm font-bold text-[var(--text)]">
                    {(rating as any)[c]}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] capitalize mt-0.5">{c}</p>
                  <div className="flex justify-center mt-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={cn("w-2.5 h-2.5",
                        star <= Math.round((rating as any)[c])
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-[var(--border)]"
                      )} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {rating.comment && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl"
                style={{ background: "var(--bg-secondary)" }}>
                <MessageSquare className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--text-muted)] italic">"{rating.comment}"</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add Rating Modal */}
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
                <h2 className="font-bold text-lg text-[var(--text)]">Rate Supplier</h2>
                <button onClick={() => setShowModal(false)} className="btn-ghost p-1.5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Supplier *</label>
                  <select value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} className="input">
                    <option value="">Select supplier...</option>
                    {suppliers.filter(s => s !== "ALL").map(s => <option key={s} value={s}>{s}</option>)}
                    <option value="RawMat Industries">RawMat Industries</option>
                    <option value="FastLog Logistics">FastLog Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Overall Rating *</label>
                  <StarRating value={form.overall} onChange={v => setForm({ ...form, overall: v })} size="lg" />
                </div>

                {CRITERIA.map(c => (
                  <div key={c}>
                    <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 capitalize">
                      {c}
                    </label>
                    <StarRating value={(form as any)[c]} onChange={v => setForm({ ...form, [c]: v })} size="lg" />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Comment</label>
                  <textarea rows={3} value={form.comment}
                    onChange={e => setForm({ ...form, comment: e.target.value })}
                    placeholder="Share your experience with this supplier..."
                    className="input resize-none" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button onClick={handleSubmit} disabled={!form.supplier || form.overall === 0 || loading}
                  className="flex-1 btn-primary">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" />Submit</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}