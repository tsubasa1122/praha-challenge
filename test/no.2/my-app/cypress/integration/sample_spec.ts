describe('Tic tac toeのテスト', () => {
  const sqlareData = '[data-e2e=square]';
  const statusData = '[data-e2e=status';

  beforeEach(() => {
    cy.visit('/');
  });

  describe('Xが勝利した時', () => {
    it('勝利メッセージ("Winner: X!")が表示されること', () => {
      // First Player: X , Second Player: ○
      cy.get(sqlareData).eq(0).click();
      cy.get(sqlareData).eq(1).click();
      cy.get(sqlareData).eq(4).click();
      cy.get(sqlareData).eq(2).click();
      cy.get(sqlareData).eq(8).click();
      cy.get(statusData).contains('Winner: X');
    });
  });

  describe('引き分けの時', () => {
    it('Drawが表示されること', () => {
      cy.get(sqlareData).eq(0).click();
      cy.get(sqlareData).eq(2).click();
      cy.get(sqlareData).eq(1).click();
      cy.get(sqlareData).eq(3).click();
      cy.get(sqlareData).eq(5).click();
      cy.get(sqlareData).eq(4).click();
      cy.get(sqlareData).eq(6).click();
      cy.get(sqlareData).eq(7).click();
      cy.get(sqlareData).eq(8).click();
      cy.get(statusData).contains('Draw');
      cy.get(statusData).contains('Winner:').should('not.exist');
    });
  });
});
