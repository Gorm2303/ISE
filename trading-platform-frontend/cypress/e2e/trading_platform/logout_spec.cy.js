describe('Logout Tests', () => {
    it('Successful logout', () => {
        // Assuming the user is already logged in
        cy.visit('/dashboard');
        cy.get('button#logout-button').click();
        cy.url().should('include', '/login');
    });
});
