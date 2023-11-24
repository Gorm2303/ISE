describe('Stock Purchase Tests', () => {
    it('Successful stock purchase', () => {
        cy.visit('/buy-stocks');
        cy.get('input[name="stockSymbol"]').type('AAPL');
        cy.get('input[name="quantity"]').type('10');
        cy.get('button[type="submit"]').click();
        cy.get('.portfolio').should('contain', 'AAPL'); // Check the portfolio for the stock
    });

    it('Unsuccessful stock purchase due to insufficient funds', () => {
        cy.visit('/buy-stocks');
        cy.get('input[name="stockSymbol"]').type('AAPL');
        cy.get('input[name="quantity"]').type('1000'); // Large quantity for insufficient funds
        cy.get('button[type="submit"]').click();
        cy.get('.error-message').should('be.visible');
    });
});
