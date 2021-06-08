Feature: CartFruit

  Background:
    Given the following fixtures files are loaded:
      | Cart/cart   |
      | Fruit/fruit |
      | Cart/fruit  |

  Scenario: Listing cart

    When I request "GET {{ cart.@id }}/cart_fruits"
    Then the response status code should be 200
    And the "hydra:member" property should be an array with "2" data
    And the "hydra:member[0].quantity" property should be an integer equalling "3"

    When I request "GET /carts/9999/cart_fruits"
    Then the response status code should be 200
    And the "hydra:member" property should be an empty array

    ## Add new cart
    Given I have the payload
      """
      {
        "fruit": "/fruits/1",
        "cart" : "/carts/4",
        "quantity": 5
      }
      """
    When I request "POST /cart_fruits"
    Then the response status code should be 201
    And I add new reference "new_cart_fruit"

    When I request "GET {{ cart.@id }}/cart_fruits"
    Then the response status code should be 200
    And the "hydra:member" property should be an array with "3" data
    And the "hydra:member[2].quantity" property should be an integer equalling "5"

    ## Add new cart with too much fruit
    Given I have the payload
      """
      {
        "fruit": "/fruits/1",
        "cart" : "/carts/4",
        "quantity": 10
      }
      """
    When I request "POST /cart_fruits"
    Then the response status code should be 400
    And the "violations[0].message" property should be a string equalling "This value should be less than or equal to 5."

    ## Add new cart
    Given I have the payload
      """
      {
        "quantity": 1
      }
      """
    When I request "PUT {{ new_cart_fruit.@id }}"
    Then the response status code should be 200
    And the "quantity" property should be an integer equalling "1"

    When I request "GET {{ new_cart_fruit.@id }}"
    Then the response status code should be 200
    And the "quantity" property should be an integer equalling "1"

    When I request "GET /cart_fruits/99999"
    Then the response status code should be 404

    When I request "DELETE {{ new_cart_fruit.@id }}"
    Then the response status code should be 204

    When I request "DELETE /cart_fruits/99999"
    Then the response status code should be 404
