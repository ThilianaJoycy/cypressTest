Feature: Gestion des Ctégories

  Scenario: Création
    Given Nous avons  N Categorie
    When Je crée une nouvelle
    Then J'obtiens N + 1 categories

  Scenario: Suppression
    Given La BD contient la catégorie RC
    When Je supprime Categorie avec pour id 32
    Then La BD contient N-1 Caategorie

  Scenario Outline: Lecture
    Given Nous avons  N Categorie
    When Je recupère la categorie <id>
    Then J'obtiens la categorie d'identifiant <id> contenant les données <libelle>

    Examples: 
      | id | libelle |
      | 33 | RC      |

  Scenario Outline: Modification
    Given Nous avons la categorie suivant
      | id | libelle |
      | 33 | RC      |
    When Je modifie la categorie <libelle>
    Then J'obtiens la categorie d'identifiant <id> contenant les donnees <libelle>

    Examples: 
      | id | libelle     |
      |  3 | RC Modifie |
