import { multiply } from '../src/multiply';

describe('multiply()は数値を受け取ると掛け算された数値を返す', () => {
  describe('2,1を渡したとき', () => {
    it('2を返すこと', () => {
      expect(multiply(2, 1)).toBe(2);
    });
  });

  // 三角測定で使用したテスト(実際は削除する)
  // describe('4,2,2を渡したとき', () => {
  //   it('16を返すこと', () => {
  //     expect(multiply(4, 2, 2)).toBe(16);
  //   });
  // });

  describe('1を渡したとき', () => {
    it('1を返すこと', () => {
      expect(multiply(1)).toBe(1);
    });
  });

  describe('計算結果が1000を超える値(500, 2)を渡したとき', () => {
    it('「big big number」の文字列を返すこと', () => {
      const BIG_BIG_NUMBER = 'big big number';
      expect(multiply(500, 2)).toBe(BIG_BIG_NUMBER);
    });
  });

  describe('31 個以上の引数を渡したとき', () => {
    it('例外が発生すること', () => {
      const numberOfInvalidArgments: number[] = [...Array(31).keys()];
      expect(() => multiply(...numberOfInvalidArgments)).toThrow();
    });
  });

  describe('引数を渡さないとき', () => {
    it('0を返すこと', () => {
      expect(multiply()).toBe(0);
    });
  });
});
