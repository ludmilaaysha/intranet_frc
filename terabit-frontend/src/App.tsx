import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInSide from './pages/SignInSide';
import MainLayout from './pages/MainLayout';
import Catalog from './pages/Catalog';
// import Channel from './pages/Channel';
// import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInSide />} />

        <Route element={<MainLayout />}>
          <Route path="/catalog" element={<Catalog />} />
          {/* <Route path="/channel/:id" element={<Channel />} />
          <Route path="/admin" element={<Admin />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}