/// <reference types="Cypress" />

describe('Gestion des catégories', function() {
    // before(() => {
    //     cy.visit("/");

    //     //
    //     //-------------*******************************Créer un utilisateur sans passer par l'interface*************************************-------------------------
    //     // cy.request({
    //     //     method:'POST',
    //     //     url:'/services/uaa/api/register', 
    //     //     body:{login: 'joyce', email:"joyce.yimga@sprint-pay.com", password: 'joyce8484', confirmPassword: 'joyce8484'},
    //     //     failOnStatusCode: false
    //     //   })
    //     //   .as('currentUser')

        
    //   })
    beforeEach(() => {
        //---------------*******************************Connexion d'un utilisateur sans passer par l'interface***********************************----------------------
        cy.request({
            method:'POST',
            url:'/auth/login', 
            body:{username: 'user', password: 'user', rememberMe: false},
            failOnStatusCode: false
          });
        
      })
    it('Crée une catégorie', function() {
       //Given Nous avons  N Categorie
        cy.visit('/');
        cy.get("#entity-menu").click();
        cy.get("a[routerlink=categories]").click();

        cy.get(".table.table-striped").get("tbody").find("tr").should("have.length", 10);

        //When Je crée une nouvelle
        cy.get("#jh-create-entity").should("be", "visible");
        cy.get("#jh-create-entity").should("contain", "Create a new Categories");

        cy.get("#jh-create-entity").click();

        cy.get("#jhi-categories-heading").should("be", "visible");
        cy.get("#jhi-categories-heading").should("contain", "Create or edit a Categories");

        cy.get("#field_libelle").type("Nouvelle catégorie{enter}");

        //Then J'obtiens N + 1 categories
        cy.get(".table.table-striped").get("tbody").find("tr").should("have.length", 11);
        cy.get(".table.table-striped").get("tbody").find("tr").last().find("td").eq(1).should("contain", "Nouvelle catégorie");
    });

    it('Suppression', function() {
        //Given La BD contient N categories
        cy.visit('/categories');
        
        cy.get(".table.table-striped").get("tbody").find("tr").should("have.length", 11);

        //When Je supprime la dernières catégories
        cy.get(".table.table-striped").get("tbody").find("tr").last().find("td").last().find(".btn.btn-danger.btn-sm").click();

        cy.get("jhi-categories-delete-dialog").should("be", "visible");
        cy.get("#jhi-confirm-delete-categories").click();

        //Then La BD contient N-1 Caategorie
        cy.get(".table.table-striped").get("tbody").find("tr").should("have.length", 10);

        
    });

    it('Lecture', function() {
        //Given Nous avons  N Categories
        cy.visit('/categories');
        
        cy.get(".table.table-striped").get("tbody").find("tr").should("have.length", 10);
        cy.get(".table.table-striped").get("tbody").find("tr").eq(2).find("td").first().should("contain", "3");
        cy.get(".table.table-striped").get("tbody").find("tr").eq(2).find("td").eq(1).should("contain", "Trace");

        //When Je recupère la categorie 3
        cy.get(".table.table-striped").get("tbody").find("tr").eq(2).find("td").last().find(".btn.btn-info.btn-sm").click();

        //Then J'obtiens la categorie d'identifiant 3 et de libéllé 'Trace'
        cy.get("jhi-categories-detail").should("be", "visible");
        cy.get("h2").should("contain", "3");
        cy.get(".row-md.jh-entity-details>dd").should("contain", "Trace");

        
    });

    it('Modification', function() {
        //Given Nous avons la categorie 3
        cy.visit('/categories');

        cy.get(".table.table-striped").get("tbody").find("tr").eq(2).find("td").first().should("contain", "3");
        cy.get(".table.table-striped").get("tbody").find("tr").eq(2).find("td").eq(1).should("contain", "Trace");

        //When Je modifie le libéllé de la categorie 3
        cy.get(".table.table-striped").get("tbody").find("tr").eq(2).find("td").last().find(".btn.btn-primary.btn-sm").click();

        cy.get("jhi-categories-update").should("be", "visible");
        cy.url().should('include', '/categories/3/edit')
        cy.get("#id").should("have.value", "3");

        cy.get("#id").type("1", {force:true});

        cy.get("#field_libelle").should("have.value", "Trace");
        cy.get("#field_libelle").clear();
        cy.get("#field_libelle").type("Catégorie modifiée{enter}");

        //Then J'obtiens la categorie d'identifiant 3 contenant les donnees 'Catégorie modifiée'
        cy.url().should('not.include', '/categories/3/edit');
        cy.get(".table.table-striped").get("tbody").find("tr").eq(2).find("td").eq(1).should("contain", "Catégorie modifiée");

        
    });
  })
  