import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root, { loader as RootLoader } from './pages/Root';
import DashBoardPage, { loader as DashboardLoader } from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AuthPage, { loader as AuthPageLoader } from './pages/AuthPage';
import { redirect } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element : <Root />,
    id: 'root',
    loader: RootLoader,
    children: [
      {
        index: true,
        element: <DashBoardPage />,
        loader: DashboardLoader
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/change-password',
        element: <ChangePasswordPage />,
      }
    ]
  },
  {
    path: '/authentication',
    element: <AuthPage />,
    loader: AuthPageLoader
  },
  {
    path: '/logout',
    loader: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      return redirect('/authentication');
    }
  }
])

function App() {
  return (
    <div className="App">
      <div className="AppGlass">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
