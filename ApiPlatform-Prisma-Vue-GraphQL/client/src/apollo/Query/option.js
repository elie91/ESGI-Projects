import gql from "graphql-tag";

export const OPTIONS_QUERY = gql`
  query options($orderBy: OptionOrderByInput, $first: Int, $skip: Int) {
    options(orderBy: $orderBy, first: $first, skip: $skip) {
      id,
      name
    }
  }
`;

export const OPTION_QUERY = gql`
  query option($optionId: ID!) {
    option(where: {id: $optionId}) {
      id,
      name
    }
  }
`;
