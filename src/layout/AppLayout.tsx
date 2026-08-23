import { Outlet } from 'react-router-dom';
import AppFrame from '../components/AppFrame';

export default function AppLayout() {
  return (
    <AppFrame>
      <Outlet />
    </AppFrame>
  );
}