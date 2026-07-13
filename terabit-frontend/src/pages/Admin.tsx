import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/admin/DashboardLayout';
import UserList from '../components/admin/UserList';
import UserShow from '../components/admin/UserShow';
import UserCreate from '../components/admin/UserCreate';
import UserEdit from '../components/admin/UserEdit';
import ChannelList from '../components/admin/ChannelList';
import ChannelCreate from '../components/admin/ChannelCreate';
import ChannelEdit from '../components/admin/ChannelEdit';
import ChannelShow from '../components/admin/ChannelShow';
import NotificationsProvider from '../hooks/useNotifications/NotificationsProvider';
import DialogsProvider from '../hooks/useDialogs/DialogsProvider';
import AppTheme from '../shared-theme/AppTheme';
import Footer from '../components/Footer';
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from '../shared-theme/customizations';

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function Admin(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
        <CssBaseline enableColorScheme />
        <NotificationsProvider>
            <DialogsProvider>
            <Routes>
                <Route element={<DashboardLayout />}>
                    <Route index element={<ChannelList />} />

                    <Route path="channels">
                    <Route index element={<ChannelList />} />
                    <Route path="new" element={<ChannelCreate />} />
                    <Route path=":channelId/edit" element={<ChannelEdit />} />
                    <Route path=":channelId" element={<ChannelShow />} />
                    </Route>

                    <Route path="users">
                    <Route index element={<UserList />} />
                    <Route path="new" element={<UserCreate />} />
                    <Route path=":userId/edit" element={<UserEdit />} />
                    <Route path=":userId" element={<UserShow />} />
                    </Route>

                    <Route path="*" element={<ChannelList />} />
                </Route>
            </Routes>
            <Footer />
            </DialogsProvider>
        </NotificationsProvider>
    </AppTheme>
  );
}