import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { 
  X,
  CreditCard,
  BadgeDollarSign,
  Wallet,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Hash,
  ClipboardCopy,
  Info,
  Tag
} from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';

export interface ViewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: {
    id: number;
    customer: string;
    email: string;
    amount: string;
    status: string; // paid | pending | failed | abandoned | completo...
    method: string; // credit_card | pix | boleto | PIX
    date: string;
    // opcionais (para transações PIX/entradas)
    internalId?: string | number;
    transactionId?: string; // hash/transação
    description?: string;
    fee?: string;
    category?: string;
    document?: string;
    payerName?: string;
  };
}
const paymentMethodIcons = {
  credit_card: CreditCard,
  pix: BadgeDollarSign,
  boleto: Wallet
};
const getPaymentMethodNames = (intl: ReturnType<typeof useIntl>) => ({
  credit_card: intl.formatMessage({ id: 'modal.viewSale.creditCard' }),
  pix: intl.formatMessage({ id: 'modal.viewSale.pix' }),
  boleto: intl.formatMessage({ id: 'modal.viewSale.boleto' })
});

const statusColors = {
  paid: "text-green-500",
  pending: "text-yellow-500",
  abandoned: "text-yellow-500",
  failed: "text-red-500",
  completo: "text-green-500"
};

const statusIcons = {
  paid: CheckCircle2,
  pending: Clock,
  failed: XCircle,
  abandoned: Clock,
  completo: CheckCircle2
};

const getStatusTranslations = (intl: ReturnType<typeof useIntl>) => ({
  paid: intl.formatMessage({ id: 'modal.viewSale.approved' }),
  pending: intl.formatMessage({ id: 'modal.viewSale.pending' }),
  failed: intl.formatMessage({ id: 'modal.viewSale.failed' }),
  abandoned: intl.formatMessage({ id: 'modal.viewSale.abandoned' }),
  completo: intl.formatMessage({ id: 'modal.viewSale.complete' })
});

export function ViewSaleModal({ isOpen, onClose, sale }: ViewSaleModalProps) {
  const intl = useIntl();
  const { isDarkMode } = useContext(ThemeContext);
  
  if (!isOpen) return null;

  const paymentMethodNames = getPaymentMethodNames(intl);
  const statusTranslations = getStatusTranslations(intl);
  const PaymentIcon = paymentMethodIcons[sale.method as keyof typeof paymentMethodIcons];
  const statusKey = (sale.status?.toLowerCase?.() || 'pending') as keyof typeof statusIcons;
  const StatusIcon = statusIcons[statusKey] || Clock;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/10' : 'bg-white border-gray-200'} rounded-2xl w-full max-w-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Info size={18} className="text-[var(--primary-color)]" />
            <h3 className="text-lg font-semibold">{intl.formatMessage({ id: 'modal.viewSale.title' })}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and amount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center gap-2`}>
              <StatusIcon className={statusColors[statusKey] || 'text-yellow-500'} size={18} />
              <span className={`text-sm font-medium ${statusColors[statusKey] || 'text-yellow-500'}`}>
                {statusTranslations[statusKey] || sale.status}
              </span>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between`}>
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.amount' })}</span>
              <span className="font-semibold">{sale.amount}</span>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between`}>
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.method' })}</span>
              <span className="inline-flex items-center gap-2 font-medium"><PaymentIcon size={16} /> {paymentMethodNames[sale.method as keyof typeof paymentMethodNames] || sale.method}</span>
            </div>
          </div>

          {/* Transaction identifiers */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.transactionInfo' })}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sale.internalId !== undefined && (
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}> 
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.internalId' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs">{String(sale.internalId)}</code>
                    <button onClick={()=>navigator.clipboard?.writeText(String(sale.internalId))} className="p-1 rounded hover:bg-white/5"><ClipboardCopy size={14} /></button>
                  </div>
                </div>
              )}
              {sale.transactionId && (
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.transactionId' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs break-all max-w-[220px] md:max-w-[280px]">{sale.transactionId}</code>
                    <button onClick={()=>navigator.clipboard?.writeText(sale.transactionId!)} className="p-1 rounded hover:bg-white/5"><ClipboardCopy size={14} /></button>
                  </div>
                </div>
              )}
              {sale.e2e && (
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.e2e' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs break-all max-w-[220px] md:max-w-[280px]">{sale.e2e}</code>
                    <button onClick={()=>navigator.clipboard?.writeText(sale.e2e!)} className="p-1 rounded hover:bg-white/5"><ClipboardCopy size={14} /></button>
                  </div>
                </div>
              )}
              {sale.description && (
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-2">
                    <Info size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.description' })}</span>
                  </div>
                  <span className="text-sm">{sale.description}</span>
                </div>
              )}
              {sale.fee && (
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.fee' })}</span>
                  </div>
                  <span className="text-sm">{sale.fee}</span>
                </div>
              )}
              {sale.category && (
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.category' })}</span>
                  </div>
                  <span className="text-sm">{sale.category}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payer and date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                <User size={18} />
                <span className="text-sm">{intl.formatMessage({ id: 'modal.viewSale.payerInfo' })}</span>
              </div>
              <div className={`p-4 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} rounded-xl space-y-2`}>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.name' })}</span><span className="text-sm font-medium">{sale.payerName || sale.customer}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.document' })}</span><span className="text-sm font-medium">{sale.document || '-'}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-400">{intl.formatMessage({ id: 'modal.viewSale.email' })}</span><span className="text-sm font-medium">{sale.email}</span></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400"><Calendar size={18} /><span className="text-sm">{intl.formatMessage({ id: 'modal.viewSale.dateTime' })}</span></div>
              <div className={`p-4 ${isDarkMode ? 'bg-[var(--background-color)]' : 'bg-gray-50'} rounded-xl`}>
                <p className="text-sm text-gray-300">{sale.date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-200'} flex items-center justify-end`}>
          <button onClick={onClose} className="px-4 h-10 rounded-lg bg-[var(--primary-color)] text-white font-medium hover:opacity-90">{intl.formatMessage({ id: 'modal.viewSale.close' })}</button>
        </div>
      </div>
    </div>
  );
}