export const subtract = (...numbers: number[]): string | number | never => {
  const NEGATIVE_NUMBER = 'negative number';
  const LIMIT_ARGUMENTS = 31;

  if (numbers.length === 0) return 0;
  if (numbers.length >= LIMIT_ARGUMENTS) throw new Error();

  const sumNumber = numbers.reduce((num1, num2) => num1 - num2);
  if (sumNumber < 0) {
    return NEGATIVE_NUMBER;
  }
  return sumNumber;
};
