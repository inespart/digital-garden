describe('Can login and delete seed', () => {
  it('Can login and delete seed', () => {
    cy.viewport(1440, 715);
    cy.visit('http://localhost:3000/');
    cy.contains('Login');
    cy.get('[data-cy="header-login-link"]').click();
    cy.get('[data-cy="login-username"]').type('a_carlson');
    cy.get('[data-cy="login-password"]').type('triA1-PA55w0rd');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/profiles/a_carlson');
    cy.get('[data-cy="header-seeds-link"]').click();
    cy.contains('Read full seed').first().click();
    cy.get('[data-cy="delete-seed-button"]', { timeout: 10000 }).click();
    cy.on('window:confirm', () => true);
    cy.contains('All Seeds');
  });
});
