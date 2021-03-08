export const divide = (...numbers: number[]): string | number | never => {
  const LIMIT_ARGUMENTS = 31;
  const FROM_INDEX = 1;

  if (numbers.length === 0) return 0;
  if (numbers.length >= LIMIT_ARGUMENTS) throw new Error();
  if (numbers.includes(0, FROM_INDEX)) throw new Error();

  const sunNumber = numbers.reduce(
    (num1: number, num2: number): number => num1 / num2
  );

  return Math.round(sunNumber);
};
