export const generateRandomHash = () => {
  const hash1 = Math.random().toString(36).substr(2, 8);
  const hash2 = Math.random().toString(36).substr(2, 8);
  const hash3 = Math.random().toString(36).substr(2, 8);
  const hash4 = Math.random().toString(36).substr(2, 8);

  return `${hash1}-${hash2}-${hash3}-${hash4}`;
};