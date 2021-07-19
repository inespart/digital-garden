describe('Can register account', () => {
  it('Can visit website, register new account', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Login');
    cy.get('[data-cy="header-login-link"]').click();
    cy.contains('Create new account').click();
    cy.get('[data-cy="registration-first-name"]').type('Alex');
    cy.get('[data-cy="registration-last-name"]').type('Carlson');
    cy.get('[data-cy="registration-email"]').type('a.carlson@gmail.com');
    cy.get('[data-cy="registration-username"]').type('a_carlson');
    cy.get('[data-cy="registration-password"]').type('triA1-PA55w0rd');
    cy.contains('Create Account').click();
    cy.get('[data-cy="go-to-all-seeds-link"]').click();
    cy.get('[data-cy="header-my-profile-link"]').click();
    // cy.contains('Delete').click();
  });
});
