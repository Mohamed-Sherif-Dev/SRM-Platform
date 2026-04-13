// "use client"

// import { useState }  from "react"
// import { signIn }    from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { motion }    from "framer-motion"
// import Link          from "next/link"
// import { Package, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
// import { FcGoogle } from "react-icons/fc"
// import toast from "react-hot-toast"

// export default function LoginPage() {
//   const router = useRouter()
//   const [form,     setForm]     = useState({ email: "", password: "" })
//   const [showPass, setShowPass] = useState(false)
//   const [loading,  setLoading]  = useState(false)

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       const res = await signIn("credentials", { ...form, redirect: false })
//       if (res?.error) toast.error("Invalid email or password")
//       else { toast.success("Welcome back!"); router.push("/dashboard") }
//     } finally { setLoading(false) }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4"
//       style={{ backgroundColor: "var(--bg)" }}>
//       <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-orange-600
//             rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-500/25">
//             <Package className="w-7 h-7 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-[var(--text)]">SupplyChain Pro</h1>
//           <p className="text-sm text-[var(--text-muted)] mt-1">Sign in to your account</p>
//         </div>

//         <div className="card p-8">
//           {/* Google */}
//           <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
//             className="btn-secondary w-full mb-5">
//             <FcGoogle className="w-4 h-4 text-blue-400" />
//             Continue with Google
//           </button>

//           <div className="flex items-center gap-3 mb-5">
//             <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
//             <span className="text-xs text-[var(--text-muted)]">or</span>
//             <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
//                 <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
//                   placeholder="admin@srm.com" required className="input pl-10" />
//               </div>
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
//                 <input type={showPass ? "text" : "password"} value={form.password}
//                   onChange={e => setForm({ ...form, password: e.target.value })}
//                   placeholder="••••••••" required className="input pl-10 pr-10" />
//                 <button type="button" onClick={() => setShowPass(!showPass)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
//                   {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>
//             <button type="submit" disabled={loading} className="btn-primary w-full">
//               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
//             </button>
//           </form>

//           <p className="text-center text-sm text-[var(--text-muted)] mt-5">
//             Don't have an account?{" "}
//             <Link href="/register" className="text-primary-500 hover:text-primary-400 font-semibold">Sign up</Link>
//           </p>
//         </div>

//         <div className="mt-4 card p-4">
//           <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Demo Accounts</p>
//           <div className="space-y-1 text-xs text-[var(--text-muted)]">
//             <p>👑 Admin:   admin@srm.com   / Admin@1234</p>
//             <p>👔 Manager: manager@srm.com / Admin@1234</p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Package, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import toast from "react-hot-toast"

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    })

    if (res?.error) {
      toast.error("Invalid email or password")
      setLoading(false)
      return
    }

    toast.success("Welcome back!")

    // ✅ سيب NextAuth يعمل redirect بنفسه
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg)" }}>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-orange-600
            rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-500/25">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)]">SupplyChain Pro</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Sign in to your account</p>
        </div>

        <div className="card p-8">

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="btn-secondary w-full mb-5"
          >
            <FcGoogle className="w-4 h-4 text-blue-400" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs text-[var(--text-muted)]">or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@srm.com"
                  required
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-5">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary-500 hover:text-primary-400 font-semibold">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo */}
        <div className="mt-4 card p-4">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Demo Accounts
          </p>
          <div className="space-y-1 text-xs text-[var(--text-muted)]">
            <p>👑 Admin: admin@srm.com / Admin@1234</p>
            <p>👔 Manager: manager@srm.com / Admin@1234</p>
          </div>
        </div>

      </motion.div>
    </div>
  )
}