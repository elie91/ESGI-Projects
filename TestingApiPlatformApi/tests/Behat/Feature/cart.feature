Feature: Cart
  Background:
    Given the following fixtures files are loaded:
      | Cart/cart |

  Scenario: Listing cart

    When I request "GET /carts"
    Then the response status code should be 200
    And the "hydra:member" property should be an array with "2" data

    ## Add new cart
    Given I have the payload
      """
      {}
      """
    When I request "POST /carts"
    Then the response status code should be 201
    And I add new reference "new_cart"

    When I request "GET {{ new_cart.@id }}"
    Then the response status code should be 200

    When I request "GET /carts/99999"
    Then the response status code should be 404

    When I request "PUT /carts/99999"
    Then the response status code should be 405

    ## Delete cart
    When I request "DELETE {{ new_cart.@id }}"
    Then the response status code should be 204

    ## Delete cart
    When I request "DELETE /carts/99999"
    Then the response status code should be 404


