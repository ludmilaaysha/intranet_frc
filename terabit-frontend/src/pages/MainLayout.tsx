import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';
import Divider from '@mui/material/Divider';

export default function MainLayout(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Outlet />
      <Divider />
      <Footer />
    </AppTheme>
  );
}