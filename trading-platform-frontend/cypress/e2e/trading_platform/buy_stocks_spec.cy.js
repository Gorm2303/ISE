describe('Stock Purchase Tests', () => {
    beforeEach(() => {
        // Assuming you have a function to log in the user
        // loginUser(); 
        cy.visit('/'); // Adjust if the trade form is on a different route
        cy.intercept('GET', 'http://localhost:5000/latest-stocks').as('getStocks');
        cy.wait('@getStocks');
        cy.login('admin', 'password');
    });

    it('Successful stock purchase', () => {
        cy.depositMoney(17000);

        // Set trade type to 'buy'
        cy.get('select[name="tradeType"]').select('buy');

        // Enter stock symbol and quantity
        cy.get('input[name="stockSymbol"]').type('AAPL');
        cy.get('input[name="quantity"]').type('10');

        // Submit the form
        cy.get('.trade-form').submit();

        // Verify the portfolio update
        // This step depends on how your application displays the updated portfolio
        // For example, you might check for a success message or an updated balance
        cy.get('.portfolio').should('contain', 'AAPL'); 
    });

    // Add more tests as necessary...

    it('Unsuccessful stock purchase due to insufficient funds', () => {
        cy.on('window:alert', (text) => {
            // Assert the alert text
            expect(text).to.contains('Insufficient balance');
        });
        cy.get('select[name="tradeType"]').select('buy');

        cy.get('input[name="stockSymbol"]').type('AAPL');
        cy.get('input[name="quantity"]').type('1000'); // Large quantity for insufficient funds
        cy.get('.trade-form').submit();
    });
});
