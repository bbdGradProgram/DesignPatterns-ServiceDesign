export const getRandomBigInt = digits => {
  let randomBigInt = BigInt(0);
  const base = BigInt(4);
  
  for (let i = 0; i < digits; i++) {
    const randomDigit = BigInt(Math.floor(Math.random() * 10));
    randomBigInt = randomBigInt * base + randomDigit;
  }
  
  return randomBigInt;
}