export const number = (value: number, digits = 2) =>
  new Intl.NumberFormat("pl-PL", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

export const integer = (value: number) => new Intl.NumberFormat("pl-PL").format(value);
export const currency = (value: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(value);

export const labels: Record<string, string> = {
  istniejacy: "Istniejący",
  planowany: "Planowany",
  do_weryfikacji: "Do weryfikacji",
  awarie: "Awarie",
  dobry: "Dobry",
  koncepcja: "Koncepcja",
  projektowany: "Projektowany",
  do_realizacji: "Do realizacji",
  zrealizowany: "Zrealizowany"
};
