import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import MainPage from './components/mainpage';

import WEBSITE from './components/website';
import SUPPORT from './components/support';
import DEALER from './components/Dealer/dealer';
import NEWS from './components/newsupdate';

import ScrollToTop from './components/ScrollToTop';
import DynamicProductView from './components/DynamicProductView';
import AdminLogin from './components/Admin/AdminLogin';
import AdminRegister from './components/Admin/AdminRegister';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-zinc-950">
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="website" element={<WEBSITE />} />
          <Route path="support-info" element={<SUPPORT />} />
          <Route path="dealer" element={<DEALER />} />
          <Route path="news" element={<NEWS />} />

          {/* Admin Routes */}
          <Route path="admin" element={<AdminLogin />} />
          <Route path="admin/register" element={<AdminRegister />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />

          {/* Dynamic Route for all products */}
          <Route path="product/:productName" element={<DynamicProductView />} />
          <Route path="/:brandName/:tileName" element={<DynamicProductView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
