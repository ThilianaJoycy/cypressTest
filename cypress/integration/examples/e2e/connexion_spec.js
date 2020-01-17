/// <reference types="Cypress" />

describe('Connexion à la plateforme', function() {
    it('should connect with corects credentials!', function() {
        cy.visit("/");
        cy.get("#account-menu").click();
        cy.get("#login").click();

        cy.get(".modal-dialog").should("be", "visible");

        cy.get("#username").type("user");
        cy.get("#password").type('user{enter}');
        cy.get("#home-logged-message").should("contain", "You are logged in as user \"user\"");
    //   expect(true).to.equal(false)
    });

    // it('Visits the Kitchen Sink', function() {
    //     cy.visit('https://example.cypress.io');

    //     cy.pause();

    //     cy.contains('type').click()

    // // Should be on a new URL which includes '/commands/actions'
    // cy.url().should('include', '/commands/actions')

    // // Get an input, type into it and verify that the value has been updated
    // cy.get('.action-email')
    //   .type('fake@email.com')
    //   .should('have.value', 'fake@email.com')
    // });
  })
  