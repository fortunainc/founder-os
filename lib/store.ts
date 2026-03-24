import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// UI Store
interface UIState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'ui-storage',
    }
  )
)

// Task Store
interface TaskState {
  tasks: Array<{
    id: string
    type: 'content' | 'build' | 'revenue'
    title: string
    description: string | null
    completed: boolean
    dueDate: string
  }>
  setTasks: (tasks: TaskState['tasks']) => void
  addTask: (task: Omit<TaskState['tasks'][0], 'id'>) => void
  toggleTask: (id: string) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              completed: false,
            },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
    }),
    {
      name: 'task-storage',
    }
  )
)

// Quick Capture Store
interface QuickCaptureState {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useQuickCaptureStore = create<QuickCaptureState>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

// Toast Store
interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: crypto.randomUUID(),
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

// Voice Profile Store
interface VoiceProfileState {
  voiceProfile: {
    intensity_level: string
    preferred_cta_style: string
  }
  setVoiceProfile: (profile: Partial<VoiceProfileState['voiceProfile']>) => void
}

export const useVoiceProfileStore = create<VoiceProfileState>()(
  persist(
    (set) => ({
      voiceProfile: {
        intensity_level: 'medium',
        preferred_cta_style: 'curiosity',
      },
      setVoiceProfile: (profile) =>
        set((state) => ({
          voiceProfile: { ...state.voiceProfile, ...profile },
        })),
    }),
    {
      name: 'voice-profile-storage',
    }
  )
)