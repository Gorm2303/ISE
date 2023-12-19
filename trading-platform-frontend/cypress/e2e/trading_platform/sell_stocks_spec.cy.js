describe('Stock Sale Tests', () => {
    beforeEach(() => {
        // Log in and ensure the user has stocks to sell
        cy.login('admin', 'password');
        // Assuming 'addStocksToPortfolio' is a function or custom command you have for testing
        // This adds specified stocks to the user's portfolio
        cy.addStocksToPortfolio('AAPL', 10); // Add 10 shares of 'AAPL' to the portfolio
    });
    
    it('Successful stock sale', () => {
        cy.on('window:alert', (text) => {
            expect(text).to.contains('Stocks sold successfully');
        });
        // Set trade type to 'sell'
        cy.get('select[name="tradeType"]').should('be.visible').select('sell');

        // Enter stock symbol and quantity to sell
        cy.get('input[name="stockSymbol"]').clear().type('AAPL');
        cy.get('input[name="quantity"]').clear().type('5'); // Selling 5 shares of 'AAPL'

        // Submit the form
        cy.get('.trade-form').submit();

        // Verify the portfolio update after selling stocks
        // This can include checking for an updated stock count, balance, or a success message    
    });

    it('Unsuccessful stock sale of unowned stocks', () => {
        cy.on('window:alert', (text) => {
            expect(text).to.contains('Insufficient stock quantity');
        });
        cy.get('select[name="tradeType"]').should('be.visible').select('sell');
        cy.get('input[name="stockSymbol"]').clear().type('MSFT'); // Assuming the user doesn't own 'MSFT'
        cy.get('input[name="quantity"]').clear().type('5');
        cy.get('.trade-form').submit();

    });
});
