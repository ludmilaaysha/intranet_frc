import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignInSide from './pages/SignInSide';
import MainLayout from './pages/MainLayout';
import Catalog from './pages/Catalog';
// import Channel from './pages/Channel';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignInSide />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin/*" element={<Admin />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<Catalog />} />
              {/* <Route path="/channel/:id" element={<Channel />} /> */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}