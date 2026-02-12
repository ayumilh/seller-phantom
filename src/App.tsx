import { AppRoutes } from './routes';
import { Layout } from './components/Layout';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {Toaster} from 'sonner';
import { Provider } from 'react-redux';
import { store } from './lib/store';
function App() {
  useEffect(() => {
    const envTitle = import.meta.env.VITE_TITLE || 'Título Padrão';
    document.title = envTitle;
  }, []);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/resetPassword' || location.pathname === '/forgotPassword';
  const isDocsPage = location.pathname.startsWith('/docs');

  if (isAuthPage  || isDocsPage) {
    return (
      <>
      <Provider store={store}>
        <Toaster position='top-center' richColors/>
      <AppRoutes/>
      </Provider>
      </>
    );
  }

  return (
      <Provider store={store}>
        <Layout>
       <AppRoutes />
      <Toaster position='top-center' richColors/>
    </Layout>
      </Provider>
  );
}

export default App;