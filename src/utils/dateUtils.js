export function localDateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(today);
  mon.setDate(diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return localDateStr(d);
  });
}

export function getMonthDates(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDow = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const dates = [];
  for (let i = 0; i < startDow; i++) dates.push(null);
  for (let d = 1; d <= last.getDate(); d++) dates.push(localDateStr(new Date(year, month, d)));
  return dates;
}
