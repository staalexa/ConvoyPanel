import LoginContainer from '@/components/auth/LoginContainer'
import { NotFound } from '@/components/elements/ScreenBlock'
import { Route, Routes, useNavigate } from 'react-router-dom'

const AuthenticationRouter = () => {
  const navigate = useNavigate()
  return (
    <Routes>
      <Route path={'/login'} element={<LoginContainer />} />
      <Route path={'/*'} element={<NotFound full onBack={() => navigate('/auth/login')} />} />
    </Routes>
  )
}

export default AuthenticationRouter