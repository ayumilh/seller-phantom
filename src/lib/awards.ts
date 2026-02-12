import plaque500 from '../../dist/assets/Prancheta 2.png';
import plaque1m from '../../dist/assets/Prancheta 3.png';
import plaque5m from '../../dist/assets/Prancheta 4.png';
import plaque10m from '../../dist/assets/Prancheta 5.png';
import plaque50m from '../../dist/assets/Prancheta 6.png';

export type AwardMilestone = { amount: number; label: string; img: string };

export const AWARDS_MILESTONES: AwardMilestone[] = [
  { amount: 500_000, label: '500 mil', img: plaque500 },
  { amount: 1_000_000, label: '1 milhão', img: plaque1m },
  { amount: 5_000_000, label: '5 milhão', img: plaque5m },
  { amount: 10_000_000, label: '10 milhão', img: plaque10m },
  { amount: 50_000_000, label: '50 milhão', img: plaque50m },
];

export function computeAwards(totalRevenue: number) {
  const milestones = AWARDS_MILESTONES;
  const next = milestones.find(m => totalRevenue < m.amount) || milestones[milestones.length - 1];
  const achieved = [...milestones].reverse().find(m => totalRevenue >= m.amount) || milestones[0];
  const percent = Math.max(0, Math.min(100, (totalRevenue / next.amount) * 100));
  return { milestones, next, achieved, percent };
}
