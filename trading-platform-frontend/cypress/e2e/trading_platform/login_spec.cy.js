describe('Login Tests', () => {
    it('Successful login', () => {
        cy.visit('/login');
        cy.get('input[name="username"]').type('correctUsername');
        cy.get('input[name="password"]').type('correctPassword');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard'); // Assuming the user is redirected to a dashboard page
    });

    it('Unsuccessful login with incorrect credentials', () => {
        cy.visit('/login');
        cy.get('input[name="username"]').type('wrongUsername');
        cy.get('input[name="password"]').type('wrongPassword');
        cy.get('button[type="submit"]').click();
        cy.get('.error-message').should('be.visible'); // Assuming an error message is shown
    });
});
