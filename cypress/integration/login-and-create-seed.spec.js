describe('Can login, create new seed, edit and delete it', () => {
  it('Can login, create new seed, edit and delete it', () => {
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
    cy.setTinyMceContent('public-note-id', 'Public Note Content');
    cy.setTinyMceContent('private-note-id', 'Private Note Content');
    cy.get('[data-cy="create-seed-button"]').click();
    cy.contains('Edit').click();
    cy.get('[data-cy="edit-resource-url"]')
      .type('{selectall}')
      .type('http://www.newurl.com');
    cy.contains('Save').click();
    cy.contains('newurl').should('be.visible');
    cy.contains('Delete').click();
  });
});
