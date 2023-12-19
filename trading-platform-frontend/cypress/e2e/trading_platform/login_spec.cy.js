describe('Login Tests', () => {
    beforeEach(() => {
        // Assuming you have a function to log in the user
        // loginUser(); 
        cy.visit('/'); // Adjust if the trade form is on a different route
        cy.intercept('GET', 'http://localhost:5000/latest-stocks').as('getStocks');
        cy.wait('@getStocks');
    });
    it('Successful login', () => {
        cy.login('admin', 'password');

        cy.get('.portfolio').should('be.visible');
        
        // Verify that the login was successful
        cy.get('button').contains('Logout').should('be.visible');
    });

    it('Unsuccessful login with incorrect credentials', () => {    
        // Stub the console.error method
        cy.window().then((win) => {
            cy.stub(win.console, 'error').as('consoleError');
        });

        cy.get('button').contains('Login').click(); // Adjust if your button has a specific identifier

        // Fill in the login form
        cy.get('input[type="text"]').type("wrongUsername");
        cy.get('input[type="password"]').type("wrongPassword");
        
        cy.intercept('POST', 'http://localhost:5000/auth/login').as('loginRequest');

        // Submit the form
        cy.get('form').contains('button', 'Login').click();

        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    
        // Check if console.error was called with the expected message
        cy.get('@consoleError').should('be.calledWithMatch', /Login error/);
    
    });
    
});
