// describe('Can login, create new seed and delete it', () => {
//   it('Can login, create new seed and delete it', () => {
//     cy.visit('http://localhost:3000/');
//     cy.contains('Login');
//     cy.get('[data-cy="header-login-link"]').click();
//     cy.get('[data-cy="login-username"]').type('a_carlson');
//     cy.get('[data-cy="login-password"]').type('triA1-PA55w0rd');
//     cy.get('[data-cy="login-button"]').click();
//     cy.visit('http://localhost:3000/');
//     cy.contains('Digital Seeds').click();
//     cy.contains('Read full seed').first().click();

//     cy.contains('Edit', { timeout: 10000 }).click();
//     cy.get('[data-cy="edit-resource-url"]')
//       .type('{selectall}')
//       .type('http://www.newurl.com');
//     cy.contains('Save').click();
//     cy.contains('newurl').should('be.visible');
//     cy.get('[data-cy="delete-seed-button"]', { timeout: 12000 }).click();
//   });
// });
