describe('Can login and create new seed', () => {
  it('Can login and create new seed', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Login');
    cy.get('[data-cy="header-login-link"]').click();
    cy.get('[data-cy="login-username"]').type('a_carlson');
    cy.get('[data-cy="login-password"]').type('triA1-PA55w0rd');
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="create-seed-button"]').click();
    cy.get('[data-cy="create-category"]').select('Business');
    cy.get('[data-cy="create-title"]').type('Cypress Test Title');
    cy.get('[data-cy="create-resource-url"]').type(
      'http://www.stackoverflow.com',
    );
    cy.wait(10000);
    cy.setTinyMceContent('public-note-id', 'Public Note Content');
    cy.wait(10000);
    cy.setTinyMceContent('private-note-id', 'Private Note Content');
    cy.get('[data-cy="create-seed-button"]').click();
    cy.contains('Cypress Test Title').should('be.visible');
  });
});
