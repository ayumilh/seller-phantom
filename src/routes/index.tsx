import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Sales from '../pages/Sales';
import Financial from '../pages/Financial';
import Customers from '../pages/Customers';
import Products from '../pages/Products';
import Shipping from '../pages/Shipping';
import Settings from '../pages/Settings';
import Integrations from '../pages/Integrations';
import NewSale from '../pages/NewSale';
import NewProduct from '../pages/NewProduct';
import NewCustomer from '../pages/NewCustomer';
import WithdrawMoney from '../pages/WithdrawMoney';
import DepositMoney from '../pages/DepositMoney';
import Checkouts from '../pages/Checkouts';
import NewCheckout from '../pages/NewCheckout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Webhooks from '../pages/Webhooks';
import AuthorizeIP from '../pages/settings/AuthorizeIP';
import Support from '../pages/Support';
import CryptoWithdraw from '../pages/CryptoWithdraw';
import Profile from '../pages/settings/Profile';
import InternalTransfer from '../pages/InternalTransfer';
import Domains from '../pages/Domains';
import Reports from '../pages/Reports';
import ReportsIncome from '../pages/Reports/Income';
import BlockIncome from '../pages/Reports/BlockIncome';
import ReportsOutcome from '../pages/Reports/Outcome';
import ReportsSplits from '../pages/Reports/Splits';
import Achievements from '../pages/Achievements';
import Premiacoes from '../pages/Premiacoes';
import { DocsLayout } from '../pages/docs/DocsLayout';
import Wallet from '../pages/Wallet';
import Introduction from '../pages/docs/Introduction';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { NotFoundRedirect } from '../components/NotFound';
import ResetPassword from '../pages/auth/ResetPassword';
import ReportsDashboard from '../pages/ReportsDashoboard';
import AppsCenter from '../pages/AppsCenter';
import AppDetails from '../pages/AppDetails';
import CheckoutView from '../pages/CheckoutView';
import ThankYouPage from '../pages/ThankYouPage';

 export function AppRoutes() {
  return (
    <Routes>
       {/* Auth Routes */}
       <Route path='/login' element={<PublicRoute><Login/></PublicRoute>} />
       <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
       <Route path='/forgotPassword' element={<PublicRoute><ForgotPassword/></PublicRoute>}/>
       <Route path='/resetPassword' element={<PublicRoute><ResetPassword/></PublicRoute>}/>
      {/* Documentation Routes - External to main app layout */}
      <Route path="/docs/*" element={<DocsLayout><Introduction/></DocsLayout>} />
      {/* Main App Routes */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/vendas" element={<PrivateRoute><Sales /></PrivateRoute>} />
      <Route path="/vendas/nova" element={<PrivateRoute><NewSale /></PrivateRoute>} />
      <Route path="/financeiro" element={<PrivateRoute><Financial /></PrivateRoute>} />
      <Route path="/carteira" element={<PrivateRoute><Wallet /></PrivateRoute>} />
      <Route path="/clientes" element={<PrivateRoute><Customers /></PrivateRoute>} />  
      <Route path="/clientes/novo" element={<PrivateRoute><NewCustomer /></PrivateRoute>} />
      <Route path="/produtos" element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path="/frete" element={<PrivateRoute><Shipping /></PrivateRoute>} />
      <Route path="/produtos/novo" element={<PrivateRoute><NewProduct /></PrivateRoute>} />
      <Route path="/configuracoes" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/configuracoes/ip" element={<PrivateRoute><AuthorizeIP /></PrivateRoute>} />
      <Route path="/configuracoes/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/integracoes" element={<PrivateRoute><Integrations /></PrivateRoute>} />
      <Route path="/webhooks" element={<PrivateRoute><Webhooks /></PrivateRoute>} />
      <Route path="/sacar" element={<PrivateRoute><WithdrawMoney /></PrivateRoute>} />
      <Route path="/sacar/cripto" element={<PrivateRoute><CryptoWithdraw /></PrivateRoute>} />
      <Route path="/depositar" element={<PrivateRoute><DepositMoney /></PrivateRoute>} />
      <Route path="/checkouts" element={<PrivateRoute><Checkouts /></PrivateRoute>} />
      <Route path="/checkouts/novo" element={<PrivateRoute><NewCheckout /></PrivateRoute>} />
      <Route path="/suporte" element={<PrivateRoute><Support /></PrivateRoute>} />
      <Route path="/transferencia" element={<PrivateRoute><InternalTransfer /></PrivateRoute>} />
      <Route path="/dominios" element={<PrivateRoute><Domains /></PrivateRoute>} />
      <Route path="/relatorios-dashboard" element={<PrivateRoute><ReportsDashboard /></PrivateRoute>} />
      <Route path="/relatorios/entradas" element={<PrivateRoute><ReportsIncome /></PrivateRoute>} />
      <Route path="/relatorios/bloqueios-cautelares" element={<PrivateRoute><BlockIncome /></PrivateRoute>} />
      <Route path="/relatorios/saidas" element={<PrivateRoute><ReportsOutcome /></PrivateRoute>} />
      <Route path="/relatorios/splits" element={<PrivateRoute><ReportsSplits /></PrivateRoute>} />
      <Route path="/conquistas" element={<PrivateRoute><Achievements /></PrivateRoute>} />
      <Route path="/apps" element={<PrivateRoute><AppsCenter /></PrivateRoute>} />
      <Route path="/premiacoes" element={<PrivateRoute><Premiacoes /></PrivateRoute>} />
      <Route path="/apps/:id" element={<PrivateRoute><AppDetails /></PrivateRoute>} />
      <Route path='*' element={<NotFoundRedirect/>}/>
      <Route path="/checkout/:slug" element={<CheckoutView />} />
      <Route path="/checkout/thank-you" element={<ThankYouPage />} />
    </Routes>
  );
}

