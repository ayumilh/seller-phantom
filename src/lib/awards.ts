// Plaques em public/awards/ (prancheta-2.png a prancheta-6.png)
export type AwardMilestone = { amount: number; label: string; img: string };

export const AWARDS_MILESTONES: AwardMilestone[] = [
  { amount: 500_000, label: '500 mil', img: '/awards/prancheta-2.png' },
  { amount: 1_000_000, label: '1 milhão', img: '/awards/prancheta-3.png' },
  { amount: 5_000_000, label: '5 milhão', img: '/awards/prancheta-4.png' },
  { amount: 10_000_000, label: '10 milhão', img: '/awards/prancheta-5.png' },
  { amount: 50_000_000, label: '50 milhão', img: '/awards/prancheta-6.png' },
];

export function computeAwards(totalRevenue: number) {
  const milestones = AWARDS_MILESTONES;
  const next = milestones.find(m => totalRevenue < m.amount) || milestones[milestones.length - 1];
  const achieved = [...milestones].reverse().find(m => totalRevenue >= m.amount) || milestones[0];
  const percent = Math.max(0, Math.min(100, (totalRevenue / next.amount) * 100));
  return { milestones, next, achieved, percent };
}
