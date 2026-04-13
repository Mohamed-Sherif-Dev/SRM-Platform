import { create }  from "zustand"
import { persist } from "zustand/middleware"

interface UIStore {
  sidebarCollapsed: boolean
  collapseSidebar:  () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      collapseSidebar:  () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
    }),
    { name: "srm-ui" }
  )
)