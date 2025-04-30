import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './components/Home';
import ProductsPage from './components/ProductsSection';
import LoginPage from './components/auth/Login';
import RegisterPage from './components/auth/Register';
import ProfilePage from './components/ProfilePage';
import PromoPage from './components/PromoSection';
import NewPage from './components/NewPage';
import About from './components/AboutPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },

      {
        path: 'profile',
        element:<ProfilePage />
      },

      {
        path: 'sales',
        element:<PromoPage />
      },
      
      {
        path: 'new',
        element:<NewPage />
      },
      {
        path: 'about',
        element:<About />
      },
    ]
  }
]);