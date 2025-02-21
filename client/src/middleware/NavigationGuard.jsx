import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    const isAuthenticated = localStorage.getItem('token');
    const publicPaths = ['/login', '/signup', '/forgot-password'];

    if (isAuthenticated && publicPaths.includes(location.pathname)) {
      navigate('/dashboard', { replace: true });
    }

    window.history.pushState(null, '', window.location.href);
    const preventBackButton = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', preventBackButton);

    return () => {
      window.removeEventListener('popstate', preventBackButton);
    };
  }, [navigate, location]);

  return null;
};

export default NavigationGuard; 