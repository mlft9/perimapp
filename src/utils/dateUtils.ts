import { differenceInDays, isBefore, parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const getDaysUntilExpiration = (expirationDate: string): number => {
  const expDate = parseISO(expirationDate);
  const today = new Date();
  return differenceInDays(expDate, today);
};

export const isExpired = (expirationDate: string): boolean => {
  const expDate = parseISO(expirationDate);
  const today = new Date();
  return isBefore(expDate, today);
};

export const isExpiringSoon = (expirationDate: string, daysThreshold: number = 7): boolean => {
  const daysUntil = getDaysUntilExpiration(expirationDate);
  return daysUntil >= 0 && daysUntil <= daysThreshold;
};

export const getExpirationStatus = (expirationDate: string): 'expired' | 'warning' | 'good' => {
  if (isExpired(expirationDate)) return 'expired';
  if (isExpiringSoon(expirationDate, 7)) return 'warning';
  return 'good';
};

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'dd MMM yyyy', { locale: fr });
};
