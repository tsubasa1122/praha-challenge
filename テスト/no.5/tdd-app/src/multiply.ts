export const multiply = (...numbers: number[]): string | number | never => {
  const BIG_BIG_NUMBER = 'big big number';
  const LIMIT_ARGUMENTS = 31;
  const LIMIT_SUM_NUMBER = 1000;

  if (numbers.length === 0) return 0;
  if (numbers.length >= LIMIT_ARGUMENTS) throw new Error();

  const sumNumber = numbers.reduce((num1, num2) => num1 * num2);

  if (sumNumber >= LIMIT_SUM_NUMBER) {
    return BIG_BIG_NUMBER;
  }
  return sumNumber;
};
