export async function getCurrentDay() {
  try {
    const res = await fetch('https://worldtimeapi.org/api/timezone/America/Mexico_City');
    const data = await res.json();
    return new Date(data.datetime).getDate();
  } catch {
    return new Date().getDate();
  }
}

export function getClientStatusAndColor(dueDay, currentDay) {
  const diff = parseInt(dueDay, 10) - currentDay;
  if (diff > 3) {
    return { status: 'por_pagar', color: '#b6fcb6' };
  } else if (diff >= 0 && diff <= 3) {
    return { status: 'pago_proximo', color: '#fff9b1' };
  } else {
    return { status: 'no_pagado', color: '#ffb1b1' };
  }
}