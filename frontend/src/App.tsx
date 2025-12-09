import { useEffect } from 'react'
import PageHeader from './components/PageHeader'
import ProtectedRoute from './components/ProtectedRoute'
import './styles/style.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { SubmitComponent } from './pages/SubmitComponent'
import { ProfilePage } from './pages/ProfilePage.tsx'
import { Login2 } from './components/login-form'
import { Signup2 } from './components/signup-form'
import { ListSubmissions } from './pages/ListSubmissions.tsx'
import { SubmissionDetail } from './pages/SubmissionDetails.tsx'
import { HackathonResults } from './pages/HackathonResults.tsx'
import { LandingPage } from './pages/LandingPage/LandingPage.tsx'
import CreateHackathonPage from './pages/CreateHackathonPage.tsx'
import { useAuthStore } from './stores/authStore.ts'
import { useHackatonStore } from './stores/hackatonStore.ts'
import { useSubmissionStore } from './stores/submissionStore.ts'

function App() {
  const { user, logout, restoreLogin } = useAuthStore()
  const fetchHackatons = useHackatonStore((state) => state.fetchHackatons)
  const fetchSubmissions = useSubmissionStore((state) => state.fetchSubmissions)

  useEffect(() => {
    restoreLogin()
    fetchHackatons()
    fetchSubmissions()
  }, [fetchHackatons, fetchSubmissions, restoreLogin])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PageHeader user={user} logout={logout} />
      <h1>Pequeño test para la demo</h1>

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login2 />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup2 />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage user={user!} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-hackathon"
          element={
            <ProtectedRoute user={user}>
              <CreateHackathonPage user={user!} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hackaton/:id/submit"
          element={
            <ProtectedRoute user={user}>
              <SubmitComponent />
            </ProtectedRoute>
          }
        />

        <Route path="/hackaton/:id/results" element={<HackathonResults />} />

        <Route path="/hackaton/:id" element={<ListSubmissions />} />
        <Route path="/hackaton/:id/submission/:submissionId" element={<SubmissionDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
