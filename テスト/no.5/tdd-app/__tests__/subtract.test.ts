import { subtract } from '../src/subtract';

describe('subtract()は数値を受け取ると引き算された値を返す', () => {
  describe('2, 1 を渡したとき', () => {
    it('1 を返すこと', () => {
      expect(subtract(2, 1)).toBe(1);
    });
  });

  // 三角測定で使用したテスト(実際は削除する)
  // describe('4, 1, 1 を渡したとき', () => {
  //   it('-1 を返すこと', () => {
  //     expect(subtract(4, 1, 1)).toBe(2);
  //   });
  // });

  describe('1を渡したとき', () => {
    it('1 を返すこと', () => {
      expect(subtract(1)).toBe(1);
    });
  });

  describe('計算結果がマイナスになる値(1,1,4)を渡したとき', () => {
    it('「negative number」の文字列を返すこと', () => {
      const NEGATIVE_NUMBER = 'negative number';
      expect(subtract(1, 1, 4)).toBe(NEGATIVE_NUMBER);
    });
  });

  describe('31 個以上の引数を渡したとき', () => {
    it('例外が発生することと', () => {
      const numberOfInvalidArguments: number[] = [...Array(31).keys()];
      expect(() => subtract(...numberOfInvalidArguments)).toThrow();
    });
  });

  describe('引数を渡さないとき', () => {
    it('0を返すこと', () => {
      expect(subtract()).toBe(0);
    });
  });
});
