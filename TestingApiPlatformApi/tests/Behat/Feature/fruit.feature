Feature: Fruit
  Background:
    Given the following fixtures files are loaded:
      | Fruit/fruit |

  Scenario: Listing fruit

    When I request "GET /fruits"
    Then the response status code should be 200
    And the "hydra:member" property should be an array with "2" data
    And the "hydra:member[0].name" property should be a string equalling "Banane"


    ## Add new fruit
    Given I have the payload
      """
      {
        "name": "Pomme"
      }
      """
    When I request "POST /fruits"
    Then the response status code should be 201
    And the "name" property should be a string equalling "Pomme"
    And I add new reference "new_fruit"


    ## Add new fruit without name
    Given I have the payload
      """
      {
        "test": "Pomme"
      }
      """
    When I request "POST /fruits"
    Then the response status code should be 500

    ## Test unique name
    Given I have the payload
      """
      {
        "name": "Banane"
      }
      """
    When I request "POST /fruits"
    Then the response status code should be 400
    And the "hydra:description" property should be a string equalling "name: fruit name need to be unique"

    ## Add new fruit without name
    Given I have the payload
      """
      {
        "name": "a"
      }
      """
    When I request "POST /fruits"
    Then the response status code should be 400
    And the "violations[0].message" property should be a string equalling "Le nom du fruit doit faire au minimum 2 caractères"


    ## Update fruit
    Given I have the payload
      """
      {
        "name": "Pomme 2"
      }
      """
    When I request "PUT {{ new_fruit.@id }}"
    Then the response status code should be 200
    And the "name" property should be a string equalling "Pomme 2"

    ## Update fruit with exist name
    Given I have the payload
      """
      {
        "name": "Banane"
      }
      """
    When I request "PUT {{ new_fruit.@id }}"
    Then the response status code should be 400
    And the "hydra:description" property should be a string equalling "name: fruit name need to be unique"

    ## Update unknow fruit
    Given I have the payload
      """
      {
        "name": "Banane"
      }
      """
    When I request "PUT /fruits/999"
    Then the response status code should be 404

    ## Get one fruit
    When I request "GET {{ new_fruit.@id }}"
    Then the response status code should be 200
    And the "name" property should be a string equalling "Pomme 2"

    ## Get unknow fruit
    When I request "GET /fruits/999"
    Then the response status code should be 404

    ## Delete fruit
    When I request "DELETE {{ new_fruit.@id }}"
    Then the response status code should be 204

    ## Delete unknow fruit
    When I request "DELETE /fruits/999"
    Then the response status code should be 404


