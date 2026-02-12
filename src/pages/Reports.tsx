import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, ChevronRight, BadgeDollarSign, ArrowDown, ArrowUp } from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';
import { PageHeader } from '../components/PageHeader';

export default function Reports() {
  const { isDarkMode } = useContext(ThemeContext);

  const reports = [
    {
      title: "Entradas",
      path: "/relatorios/entradas",
      icon: ArrowUpRight,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      amount: "R$ 579.667,46",
      change: "+12.5%"
    },
    {
      title: "Saídas",
      path: "/relatorios/saidas",
      icon: ArrowDownRight,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      amount: "R$ 24.890,12",
      change: "-1.2%"
    },
    {
      title: "SPLITs Recebidos",
      path: "/relatorios/splits",
      icon: BadgeDollarSign,
      color: "text-[var(--primary-color)]",
      bgColor: "bg-[var(--primary-light)]",
      amount: "R$ 45.890,00",
      change: "+8.4%"
    }
  ];

  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Visualize seus relatórios financeiros"
      />

      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reports.map((report, index) => (
            <Link
              key={index}
              to={report.path}
              className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5 hover:bg-[#1E1E2E]' : 'bg-white border-gray-200 hover:bg-gray-50'} rounded-xl border p-6 transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${report.bgColor}`}>
                  <report.icon className={report.color} size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{report.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold">{report.amount}</span>
                    <span className={`text-sm ${
                      report.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {report.change}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end mt-4 text-gray-400">
                <span className="text-sm">Ver relatório</span>
                <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}