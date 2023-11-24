describe('Withdrawal Tests', () => {
    it('Successful withdrawal within balance limit', () => {
        cy.visit('/withdraw');
        cy.get('input[name="amount"]').type('150');
        cy.get('button[type="submit"]').click();
        cy.get('.account-balance').should('contain', '$50');
    });

    it('Unsuccessful withdrawal exceeding balance', () => {
        cy.visit('/withdraw');
        cy.get('input[name="amount"]').type('150');
        cy.get('button[type="submit"]').click();
        cy.get('.error-message').should('be.visible');
    });
});
