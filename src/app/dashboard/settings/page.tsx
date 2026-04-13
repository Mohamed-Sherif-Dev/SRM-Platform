"use client"

import { useState }  from "react"
import { motion }    from "framer-motion"
import { User, Bell, Palette, Shield, Save, Camera, Eye, EyeOff, Check, Loader2, Sun, Moon } from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useSession }  from "next-auth/react"
import { useTheme }    from "next-themes"
import { getInitials, cn } from "@/lib/utils"
import toast from "react-hot-toast"

const TABS = [
  { id: "profile",    label: "Profile",    icon: User    },
  { id: "security",   label: "Security",   icon: Shield  },
  { id: "notifs",     label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
]

export default function SettingsPage() {
  const { data: session }   = useSession()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("profile")
  const [loading,   setLoading]   = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [showPass,  setShowPass]  = useState(false)
  const [profile, setProfile] = useState({
    name:     session?.user?.name || "",
    email:    session?.user?.email || "",
    phone:    "", company: "", jobTitle: "", timezone: "UTC",
  })
  const [notifs, setNotifs] = useState({
    newOrder:    true, orderApproved: true,
    paymentDue:  true, contractExpiry: true,
    supplierRating: false, weeklyReport: false,
  })

  async function handleSave() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaved(true)
    setLoading(false)
    toast.success("Settings saved!")
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-5">

          <div className="w-full md:w-52 shrink-0">
            <div className="card p-2 space-y-1">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                      : "text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text)]"
                  )}>
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">

            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="font-bold text-lg text-[var(--text)] mb-5">Profile Settings</h2>
                <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="relative">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{getInitials(session?.user?.name)}</span>
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-lg
                      flex items-center justify-center hover:bg-primary-500 transition-colors">
                      <Camera className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text)]">{session?.user?.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{(session?.user as any)?.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "name",     label: "Full Name", type: "text"  },
                    { key: "email",    label: "Email",     type: "email" },
                    { key: "phone",    label: "Phone",     type: "tel"   },
                    { key: "company",  label: "Company",   type: "text"  },
                    { key: "jobTitle", label: "Job Title", type: "text"  },
                    { key: "timezone", label: "Timezone",  type: "text"  },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{f.label}</label>
                      <input type={f.type} value={(profile as any)[f.key]}
                        onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                        className="input" />
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} disabled={loading}
                  className={cn("btn-primary mt-5", saved && "bg-green-600 hover:bg-green-500")}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
                   saved   ? <><Check className="w-4 h-4" />Saved!</> :
                             <><Save  className="w-4 h-4" />Save Changes</>}
                </button>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="font-bold text-lg text-[var(--text)] mb-5">Security</h2>
                <div className="space-y-4 mb-6">
                  {["Current Password","New Password","Confirm Password"].map(label => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1.5">{label}</label>
                      <div className="relative">
                        <input type={showPass ? "text" : "password"} placeholder="••••••••" className="input pr-10" />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} disabled={loading}
                  className={cn("btn-primary", saved && "bg-green-600 hover:bg-green-500")}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
                   saved   ? <><Check className="w-4 h-4" />Saved!</> :
                             <><Save  className="w-4 h-4" />Update Password</>}
                </button>
              </motion.div>
            )}

            {activeTab === "notifs" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="font-bold text-lg text-[var(--text)] mb-5">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { key: "newOrder",      label: "New Purchase Order",    desc: "When a new order is created"       },
                    { key: "orderApproved", label: "Order Approved",        desc: "When your order gets approved"     },
                    { key: "paymentDue",    label: "Payment Due",           desc: "Reminder before payment due date"  },
                    { key: "contractExpiry",label: "Contract Expiry Alert", desc: "When contract is about to expire"  },
                    { key: "supplierRating",label: "New Supplier Ratings",  desc: "When a supplier is rated"          },
                    { key: "weeklyReport",  label: "Weekly Report",         desc: "Weekly procurement summary email"  },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3"
                      style={{ borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <p className="text-sm font-medium text-[var(--text)]">{item.label}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))}
                        className={cn("w-11 h-6 rounded-full transition-all relative shrink-0",
                          (notifs as any)[item.key] ? "bg-primary-600" : "bg-[var(--border)]")}>
                        <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                          (notifs as any)[item.key] ? "left-6" : "left-1")} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="font-bold text-lg text-[var(--text)] mb-5">Appearance</h2>
                <p className="text-sm font-medium text-[var(--text)] mb-3">Theme</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Dark",  icon: Moon, value: "dark"  },
                    { label: "Light", icon: Sun,  value: "light" },
                  ].map(t => (
                    <button key={t.label} onClick={() => setTheme(t.value)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                        theme === t.value
                          ? "border-primary-500 bg-primary-500/10"
                          : "border-[var(--border)] hover:border-primary-500/50"
                      )}>
                      <t.icon className={cn("w-5 h-5",
                        theme === t.value ? "text-primary-500" : "text-[var(--text-muted)]")} />
                      <span className={cn("text-sm font-medium",
                        theme === t.value ? "text-primary-500" : "text-[var(--text-muted)]")}>
                        {t.label} Mode
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}