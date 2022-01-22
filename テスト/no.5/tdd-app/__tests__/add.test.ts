import { add } from '../src/add';

describe('add()は数値を受け取ると足し算された数値を返す', () => {
  describe('1, 2 を渡したとき', () => {
    it('3 を返すこと', () => {
      expect(add(1, 2)).toBe(3);
    });
  });

  // 三角測定で使用したテスト(実際は削除する)
  // describe('1, 2, 3 を渡したとき', () => {
  //   it('6 を返すこと', () => {
  //     expect(add(1, 2, 3)).toBe(6);
  //   });
  // });

  describe('1を渡したとき', () => {
    it('1 を返すこと', () => {
      expect(add(1)).toBe(1);
    });
  });

  describe('計算結果が1000 超える値(1,999)を渡したとき', () => {
    it('「too big」の文字列を返すこと', () => {
      const TOO_BIG = 'too big';
      expect(add(1, 999)).toBe(TOO_BIG);
    });
  });

  describe('31 個以上の引数を渡したとき', () => {
    it('例外が発生すること', () => {
      const numberOfInvalidArgments: number[] = [...Array(31).keys()];
      expect(() => add(...numberOfInvalidArgments)).toThrow();
    });
  });

  describe('引数を渡さないとき', () => {
    it('0 を返すこと', () => {
      expect(add()).toBe(0);
    });
  });
});
