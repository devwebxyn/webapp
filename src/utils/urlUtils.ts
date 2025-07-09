// Fungsi ini membuat string acak dengan panjang tertentu
export const generateRandomId = (length: number = 8): string => {
  return Math.random().toString(36).substring(2, 2 + length);
};