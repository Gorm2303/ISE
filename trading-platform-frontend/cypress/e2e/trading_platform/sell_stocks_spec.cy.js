describe('Stock Sale Tests', () => {
    it('Successful stock sale', () => {
        cy.visit('/sell-stocks');
        cy.get('input[name="stockSymbol"]').type('AAPL');
        cy.get('input[name="quantity"]').type('5');
        cy.get('button[type="submit"]').click();
        cy.get('.account-balance').should('include.text', 'UpdatedBalance'); // Assuming the balance is updated
    });

    it('Unsuccessful stock sale of unowned stocks', () => {
        cy.visit('/sell-stocks');
        cy.get('input[name="stockSymbol"]').type('AMZN'); // Assuming the user doesn't own AMZN
        cy.get('input[name="quantity"]').type('5');
        cy.get('button[type="submit"]').click();
        cy.get('.error-message').should('be.visible');
    });
});
