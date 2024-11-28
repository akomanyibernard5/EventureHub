import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('token');
    const publicPaths = ['/login', '/signup', '/forgot-password'];
    
    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (isAuthenticated && publicPaths.includes(location.pathname)) {
      navigate('/dashboard', { replace: true });
    }

    // Prevent browser back button
    window.history.pushState(null, '', window.location.href);
    const preventBackButton = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', preventBackButton);

    // Clean up
    return () => {
      window.removeEventListener('popstate', preventBackButton);
    };
  }, [navigate, location]);

  return null;
};

export default NavigationGuard; 