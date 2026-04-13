"use client"

import { useState }  from "react"
import { useRouter } from "next/navigation"
import { signIn }    from "next-auth/react"
import { motion }    from "framer-motion"
import Link          from "next/link"
import { Package, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [form,     setForm]     = useState({ name: "", email: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res  = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.message); return }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false })
      toast.success("Account created! 🎉")
      router.push("/dashboard")
    } catch { toast.error("Something went wrong") }
    finally  { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "var(--bg)" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-orange-600
            rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-500/25">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Create Account</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Start managing your suppliers</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name",     label: "Full Name", type: "text",     icon: User, placeholder: "Mohammed Sherif"    },
              { key: "email",    label: "Email",     type: "email",    icon: Mail, placeholder: "you@example.com"    },
              { key: "password", label: "Password",  type: "password", icon: Lock, placeholder: "Min 8 characters"  },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  {f.label}
                </label>
                <div className="relative">
                  <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type={f.key === "password" ? (showPass ? "text" : "password") : f.type}
                    value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    required
                    className={`input pl-10 ${f.key === "password" ? "pr-10" : ""}`}
                  />
                  {f.key === "password" && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          <p className="text-center text-sm text-[var(--text-muted)] mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-500 hover:text-primary-400 font-semibold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}