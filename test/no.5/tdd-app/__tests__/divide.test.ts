import { divide } from '../src/divide';

describe('devide()は数値を受け取ると割り算算された数値を返す', () => {
  describe('2, 2 を渡したとき', () => {
    it('1 を返すこと', () => {
      expect(divide(2, 2)).toBe(1);
    });
  });

  // 三角測定で使用したテスト(実際は削除する)
  // describe('8, 2, 2 を渡したとき', () => {
  //   it('2 を返すこと', () => {
  //     expect(divide(8, 2, 2)).toBe(2);
  //   });
  // });

  describe('1を渡したとき', () => {
    it('1 を返すこと', () => {
      expect(divide(1)).toBe(1);
    });
  });

  describe('計算結果が少数になる値(1,2)を渡したとき', () => {
    it('少数第一位を四捨五入した整数(1)を返すこと', () => {
      expect(divide(1, 2)).toBe(1);
    });
  });

  describe('計算結果が少数になる値(1,5)を渡したとき', () => {
    it('少数第一位を四捨五入した整数(0)を返すこと', () => {
      expect(divide(1, 5)).toBe(0);
    });
  });

  describe('31 個以上の引数を渡したとき', () => {
    it('例外が発生すること', () => {
      const numberOfInvalidArgments: number[] = [...Array(31).keys()];
      expect(() => divide(...numberOfInvalidArgments)).toThrow();
    });
  });

  describe('引数の先頭以外に 0 が含まれるとき', () => {
    it('例外が発生すること', () => {
      const invalidArguments = [1, 0, 2];
      expect(() => divide(...invalidArguments)).toThrow();
    });
  });

  describe('引数を渡さないとき', () => {
    it('0 を返すこと', () => {
      expect(divide()).toBe(0);
    });
  });
});
