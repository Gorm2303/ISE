describe('Withdrawal Tests', () => {
    beforeEach(() => {
        // Log in the user before each test
        cy.login('admin', 'password'); // Replace with valid credentials
    });

    it('Successful withdrawal', () => {
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Withdrawal successful'); // Adjust the text to match your actual success message
        });

        // Navigate to withdrawal section if it's not on the same page
        // cy.visit('/withdrawal'); // Uncomment and adjust if needed

        // Select 'Withdraw' action
        cy.get('select[name="transactionType"]').select('withdraw');

        // Enter an amount to withdraw
        cy.get('input[name="amount"]').type('50'); // Adjust the amount as per your test setup

        // Submit the form
        cy.get('button[name="actionTypeButton"]').click(); // Make sure this matches your button's selector

        // Additional checks can be added here if needed
    });

    it('Unsuccessful withdrawal due to insufficient funds', () => {
        // Intercept the POST request to the withdrawal endpoint
        cy.intercept('POST', 'http://localhost:5000/account/withdraw').as('withdrawRequest');

        // Select 'Withdraw' action and enter an amount that will cause a failure
        cy.get('select[name="transactionType"]').select('withdraw');
        cy.get('input[name="amount"]').type('10000000000'); // An amount greater than the expected balance

        // Submit the form
        cy.get('button[name="actionTypeButton"]').click();
        // Wait for the intercepted request and assert its status
        cy.wait('@withdrawRequest').its('response.statusCode').should('eq', 400);

    });
});
