import { localDateStr } from './dateUtils';

export function scoreDay(log, spheres) {
  if (!log || !spheres || !spheres.length) return 0;
  return spheres.reduce((s, sp) => s + (log[sp.id]?.checked ? 1 : 0), 0);
}

export function totalMinutes(log, spheres) {
  if (!log || !spheres) return 0;
  return spheres.reduce((s, sp) => s + (log[sp.id]?.minutes || 0), 0);
}

export function formatMins(m) {
  if (!m) return '0m';
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h${m % 60 > 0 ? ` ${m % 60}m` : ''}`;
}

export function getStreak(logs, spheres) {
  if (!logs || !spheres || !spheres.length) return 0;
  let streak = 0;
  const d = new Date();
  while (true) {
    const ds = localDateStr(d);
    const dayLog = logs[ds];
    if (!dayLog || scoreDay(dayLog, spheres) === 0) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
