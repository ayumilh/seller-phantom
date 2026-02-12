// Mock data generation functions
import { faker } from '@faker-js/faker/locale/pt_BR';

// Set a fixed seed for consistent data between renders
faker.seed(123);

// Helper to generate formatted currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Generate customer data
export const generateCustomers = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    totalSpent: formatCurrency(faker.number.float({ min: 1000, max: 50000, precision: 2 })),
    lastPurchase: faker.date.recent().toLocaleString('pt-BR'),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    transactions: faker.number.int({ min: 1, max: 50 })
  }));
};

// Generate product data
export const generateProducts = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: formatCurrency(faker.number.float({ min: 100, max: 5000, precision: 2 })),
    sales: faker.number.int({ min: 0, max: 200 }),
    revenue: formatCurrency(faker.number.float({ min: 1000, max: 500000, precision: 2 })),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    image: faker.image.urlLoremFlickr({ category: 'business' })
  }));
};

// Generate checkout data
export const generateCheckouts = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    customization: {
      banner: faker.image.urlLoremFlickr({ category: 'business' }),
      theme: faker.helpers.arrayElement(['dark', 'light']),
      methods: faker.helpers.arrayElements(['credit_card', 'pix', 'boleto'], { min: 1, max: 3 })
    }
  }));
};

// Generate domain data
export const generateDomains = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    domain: faker.internet.domainName(),
    status: faker.helpers.arrayElement(['active', 'pending']),
    lastVerified: faker.date.recent().toLocaleString('pt-BR'),
    ssl: faker.datatype.boolean()
  }));
};

// Generate webhook data
export const generateWebhooks = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.company.catchPhrase(),
    url: faker.internet.url(),
    events: faker.helpers.arrayElements([
      'sale.created',
      'sale.approved',
      'sale.canceled',
      'sale.refunded'
    ], { min: 1, max: 4 }),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    lastExecution: faker.date.recent().toLocaleString('pt-BR'),
    successRate: `${faker.number.int({ min: 90, max: 100 })}%`
  }));
};

// Generate report data
export const generateReportData = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toLocaleDateString('pt-BR'),
      income: faker.number.int({ min: 5000, max: 50000 }),
      outcome: faker.number.int({ min: 1000, max: 10000 }),
      splits: faker.number.int({ min: 500, max: 5000 })
    };
  }).reverse();
};

// Generate transaction data for reports
export const generateReportTransactions = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    description: faker.commerce.productName(),
    amount: formatCurrency(faker.number.float({ min: 100, max: 5000, precision: 2 })),
    date: faker.date.recent().toLocaleString('pt-BR'),
    category: faker.helpers.arrayElement(['Vendas', 'Taxas', 'Splits']),
    method: faker.helpers.arrayElement(['credit_card', 'pix', 'boleto'])
  }));
};

// Generate chart data
export const generateChartData = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toLocaleDateString('pt-BR', { month: 'short' }),
      cartao: faker.number.int({ min: 300, max: 800 }),
      pix: faker.number.int({ min: 150, max: 400 }),
      boleto: faker.number.int({ min: 50, max: 250 })
    };
  }).reverse();
};

// Generate financial statistics
export const generateFinancialStats = () => {
  return {
    balance: formatCurrency(faker.number.float({ min: 50000, max: 200000, precision: 2 })),
    balanceGrowth: `+${faker.number.float({ min: 1, max: 20, precision: 1 })}%`,
    dailyRevenue: formatCurrency(faker.number.float({ min: 5000, max: 20000, precision: 2 })),
    revenueGrowth: `+${faker.number.float({ min: 1, max: 20, precision: 1 })}%`,
    paymentsGenerated: faker.number.int({ min: 1000, max: 5000 }).toString(),
    paymentsGrowth: `+${faker.number.float({ min: 1, max: 20, precision: 1 })}%`,
    withdrawals: formatCurrency(faker.number.float({ min: 10000, max: 100000, precision: 2 })),
    withdrawalsGrowth: `+${faker.number.float({ min: 1, max: 20, precision: 1 })}%`,
    initiatedPayments: faker.number.int({ min: 1000, max: 5000 }).toString(),
    initiatedPaymentsGrowth: `+${faker.number.float({ min: 1, max: 20, precision: 1 })}%`,
    registeredProducts: faker.number.int({ min: 100, max: 500 }).toString(),
    registeredProductsGrowth: `+${faker.number.float({ min: 1, max: 20, precision: 1 })}%`,
    achievementsUnlocked: faker.number.int({ min: 5, max: 20 }).toString(),
    achievementsGrowth: `+${faker.number.int({ min: 1, max: 5 })}`,
    monthlyGoal: `${faker.number.int({ min: 70, max: 100 })}%`,
    monthlyGoalGrowth: `+${faker.number.float({ min: 1, max: 20, precision: 1 })}%`,
    totalRevenue: formatCurrency(faker.number.float({ min: 500000, max: 2000000, precision: 2 })),
    monthlyTarget: formatCurrency(faker.number.float({ min: 1000000, max: 2000000, precision: 2 }))
  };
};