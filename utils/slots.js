// Generate 30-min slots between 09:00 and 17:00 (inclusive start, exclusive end)
export function generateSlots() {
  const slots = [];
  let h = 9, m = 0;
  while (h < 17 || (h === 17 && m === 0)) {
    const HH = String(h).padStart(2, "0");
    const MM = String(m).padStart(2, "0");
    slots.push(`${HH}:${MM}`);
    m += 30;
    if (m === 60) { m = 0; h += 1; }
    if (h === 17 && m > 0) break;
  }
  return slots;
}
