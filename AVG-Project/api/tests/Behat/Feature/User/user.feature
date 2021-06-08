Feature: _User_
  Background:
    Given the following fixtures files are loaded:
      | User/user |

  Scenario: User Register and Login

    # Register success
    Given I have the payload
    """
      {
        "firstname": "Thomas",
        "lastname": "Popotes",
        "email": "thomas+1@popotes.fr",
        "phone": "0123456789",
        "plainPassword": "test123456"
      }
      """
    When I request "POST /users"
    Then the response status code should be 201
    And the "firstname" property should be a string equalling "Thomas"
    And the "lastname" property should be a string equalling "Popotes"
    And I add new reference "new_user"

    # Register fail
    Given I have the payload
    """
      {
        "email": "thomas@popotes.fr",
        "plainPassword": "test"
      }
      """
    When I request "POST /users"
    Then the response status code should be 400
    And the "violations" property should be an array
    And scope into the "violations[0]" property
    And the "message" property should be a string equalling "user.unique"
    And reset scope
    And scope into the "violations[1]" property
    And the "message" property should be a string equalling "user.plainPassword"
    And reset scope
    And scope into the "violations[2]" property
    And the "message" property should be a string equalling "user.errors.required.firstname"
    And reset scope
    And scope into the "violations[3]" property
    And the "message" property should be a string equalling "user.errors.required.lastname"
    And reset scope
    And scope into the "violations[4]" property
    And the "message" property should be a string equalling "user.errors.required.phone"
    And reset scope

    # Login
    Given I have the payload
      """
      {
        "email": "{{ user.email }}",
        "password": "test"
      }
      """
    When I request "POST /login_check"
    Then the response status code should be 200
    And the "token" property should exist
    And the "token" property should be a string

    # Send Reset password request
    Given I have the payload
      """
      {
        "email": "{{ user.email }}"
      }
      """
    When I request "POST /reset_password"
    Then the response status code should be 200

  Scenario: Profile User

    Given I authenticate with role "user"
    # Update
    Given I have the payload
      """
      {
        "lastname": "new_lastname"
      }
      """
    When I request "PUT {{ user.@id }}"
    Then the response status code should be 200
    And the "lastname" property should be a string equalling "new_lastname"
