describe('Deposit Tests', () => {
    it('Successful deposit', () => {
        // Assuming the user is already logged in
        cy.visit('/deposit');
        cy.get('input[name="amount"]').type('50');
        cy.get('button[type="submit"]').click();
        cy.get('.account-balance').should('contain', '$150'); // Check the updated balance
    });

    it('Deposit with invalid amount', () => {
        cy.visit('/deposit');
        cy.get('input[name="amount"]').type('-50');
        cy.get('button[type="submit"]').click();
        cy.get('.error-message').should('be.visible');
    });
});
