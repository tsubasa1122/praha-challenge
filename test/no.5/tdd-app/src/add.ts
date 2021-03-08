export const add = (...numbers: number[]): string | number | never => {
  const TOO_BIG = 'too big';
  const LIMIT_ARGUMENTS = 31;
  const LIMIT_SUM_NUMBER = 1000;

  if (numbers.length >= LIMIT_ARGUMENTS) throw new Error();

  const sunNumber = numbers.reduce(
    (num1: number, num2: number): number => num1 + num2,
    0
  );

  if (sunNumber >= LIMIT_SUM_NUMBER) {
    return TOO_BIG;
  }
  return sunNumber;
};
