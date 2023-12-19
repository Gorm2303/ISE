// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
        cy.visit('/'); // Visit the root path

        // Open the login modal by clicking the Login button
        cy.get('button').contains('Login').click(); // Adjust if your button has a specific identifier

        // Fill in the login form
        cy.get('input[type="text"]').type(username);
        cy.get('input[type="password"]').type(password);

        // Submit the form
        cy.get('form').contains('button', 'Login').click(); // Adjust this if your button has a specific identifier
});

Cypress.Commands.add('depositMoney', (amount) => {
    cy.get('input[name="amount"]').type(amount.toString());
    cy.get('button[name="actionTypeButton"]').click();
});

Cypress.Commands.add('addStocksToPortfolio', (stockSymbol, quantity) => {
    cy.depositMoney(17000);

        // Set trade type to 'buy'
        cy.get('select[name="tradeType"]').select('buy');

        // Enter stock symbol and quantity
        cy.get('input[name="stockSymbol"]').type(stockSymbol);
        cy.get('input[name="quantity"]').type(quantity);

        // Submit the form
        cy.get('.trade-form').submit();

        // Verify the portfolio update
        // This step depends on how your application displays the updated portfolio
        // For example, you might check for a success message or an updated balance
        cy.get('.portfolio').should('contain', 'AAPL'); 
});