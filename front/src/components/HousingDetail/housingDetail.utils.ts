import type { HousingDetails, RatingMetricItem } from "./housingDetail.types";

export const formatDate = (value: string) => { const [y,m,d]=value.split("-"); return y&&m&&d ? `${d}.${m}.${y}` : value; };
export const getRuleLabel = (value?: string) => value === "allowed" ? "Дозволено" : "Заборонено";
export const getRoomLabel = (n: number) => n===1 ? "кімната" : n>=2&&n<=4 ? "кімнати" : "кімнат";
export const getGuestLabel = (n: number) => n===1 ? "гість" : n>=2&&n<=4 ? "гості" : "гостей";
export const getNightLabel = (n: number) => n===1 ? "ніч" : n>=2&&n<=4 ? "ночі" : "ночей";
export const getReviewLabel = (n: number) => { const t=n%100,l=n%10; if(t>=11&&t<=14) return "відгуків"; if(l===1) return "відгук"; if(l>=2&&l<=4) return "відгуки"; return "відгуків"; };
export const getAverageRating = (h?: HousingDetails) => Number(h?.averageRating ?? h?.rating ?? 0);
export const getReviewCount = (h?: HousingDetails) => Number(h?.reviewCount ?? h?.reviewsCount ?? 0);
export const getRatingMetrics = (h?: HousingDetails): RatingMetricItem[] => !h ? [] : [
  ["Чистота",h.cleanlinessRating],["Комунікація",h.communicationRating],["Заїзд",h.checkInRating],
  ["Точність опису",h.accuracyRating],["Розташування",h.locationRating],["Ціна / якість",h.valueRating],
].filter((x): x is [string,number] => typeof x[1] === "number" && Number.isFinite(x[1])).map(([label,value])=>({label,value}));
