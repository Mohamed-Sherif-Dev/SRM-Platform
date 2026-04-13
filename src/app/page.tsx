import Link    from "next/link"
import { Package, ArrowRight, Check } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-2xl text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-orange-600
          rounded-2xl flex items-center justify-center mx-auto mb-6
          shadow-2xl shadow-primary-500/25">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-[var(--text)] mb-4">
          SupplyChain <span className="text-primary-500">Pro</span>
        </h1>
        <p className="text-xl text-[var(--text-muted)] mb-8">
          Complete Supplier Relationship Management Platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/login"
            className="inline-flex items-center justify-center gap-2 bg-primary-600
              hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-xl
              transition-all hover:shadow-lg hover:shadow-primary-500/25 text-sm">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/register"
            className="inline-flex items-center justify-center gap-2 border text-sm
              font-semibold px-8 py-4 rounded-xl transition-all"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            Create Account
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 justify-center text-sm text-[var(--text-muted)]">
          {["Supplier Management","Purchase Orders","Contracts","Payments","Analytics","Ratings"].map(f => (
            <div key={f} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary-500" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}