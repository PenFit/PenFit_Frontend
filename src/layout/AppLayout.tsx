import { Outlet } from 'react-router-dom';
import AppFrame from '../components/AppFrame';
import StatusBar from '../components/StatusBar';

export default function AppLayout() {
  return (
    <AppFrame>
      <StatusBar />
      <Outlet />
    </AppFrame>
  );
}