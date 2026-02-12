export const fees = {
  pix: { percent: 5, fixed: 1, reserve: 0 },
  card: { percent: 7.9, fixed: 1.99, reserve: 30 },
  boleto: { percent: 4.99, fixed: 1.0, reserve: 0 },
  withdraw: { percent: 1.0, fixed: 2.0 },
  ticketMin: 0,
  ticketMax: { pix: 1000, card: 1000, boleto: 1000 },
};

export type FeeKey = keyof typeof fees;
