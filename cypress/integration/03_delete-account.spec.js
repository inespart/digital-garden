describe('Can delete account', () => {
  it('Can visit website and delete new account', () => {
    cy.viewport(1440, 715);
    cy.visit('http://localhost:3000/');
    cy.contains('Login');
    cy.get('[data-cy="header-login-link"]').click();
    cy.get('[data-cy="login-username"]').type('a_carlson');
    cy.get('[data-cy="login-password"]').type('triA1-PA55w0rd');
    cy.get('[data-cy="login-button"]').click();
    cy.contains('Delete').click();
    cy.on('window:confirm', () => true);
    cy.contains('Digital Garden');
  });
});
