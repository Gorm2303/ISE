describe('Deposit Tests', () => {
    beforeEach(() => {
        // Assuming you have a function to log in the user
        // loginUser(); 
        cy.visit('/'); // Adjust if the trade form is on a different route
        cy.intercept('GET', 'http://localhost:5000/latest-stocks').as('getStocks');
        cy.wait('@getStocks');
        cy.login('admin', 'password');
    });

    it('Successful deposit', () => {
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Deposited successfully');
        });
        // Assuming the user is already logged in
        cy.depositMoney(1);
    });

});
