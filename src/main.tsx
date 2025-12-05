import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from './stores/auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3, // 3 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// Auto-refresh accessToken dan fetch profile jika ada refreshToken saat app load
const authStore = useAuthStore.getState()
if (authStore.refreshToken && !authStore.accessToken) {
  // Refresh accessToken di background
  authStore.refreshAccessToken()
    .then((newToken) => {
      // Jika refresh berhasil, fetch profile
      if (newToken && !authStore.user) {
        authStore.fetchProfile().catch(() => {
          console.warn('Failed to fetch profile on app load')
        })
      }
    })
    .catch(() => {
      // Refresh gagal, akan di-handle oleh logout
      console.warn('Failed to refresh token on app load')
    })
} else if (authStore.accessToken && !authStore.user) {
  // Jika sudah ada accessToken, langsung fetch profile
  authStore.fetchProfile().catch(() => {
    console.warn('Failed to fetch profile on app load')
  })
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
