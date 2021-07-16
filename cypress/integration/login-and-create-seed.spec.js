describe('Can register and delete account', () => {
  it('Can visit website, register new account and delete account', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Login');
    cy.get('[data-cy="header-login-link"]').click();
    cy.get('[data-cy="login-username"]').type('ip');
    cy.get('[data-cy="login-password"]').type('ip');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="create-seed-button"]').click();
    cy.get('[data-cy="create-category"]').select('Business');
    cy.get('[data-cy="create-title"]').type('Cypress Test Title');
    cy.get('[data-cy="create-resource-url"]').type(
      'http://www.stackoverflow.com',
    );
  });
});
