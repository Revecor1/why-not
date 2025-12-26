export const formatRub = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "₽",
    maximumFractionDigits: 2,
  }).format(value);

export const formatDateTime = (value: string | number | Date) => {
  const d = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};
