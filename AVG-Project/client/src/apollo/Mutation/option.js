import gql from "graphql-tag";

export const CREATE_OPTION = gql`
  mutation createOption($data: OptionCreateInput!) {
    createOption(data: $data) {
      id
    }
  }
`;

export const UPDATE_OPTION = gql`
  mutation updateOption($data: OptionUpdateInput!, $optionId: ID!) {
    updateOption(data: $data, where: {id: $optionId}) {
      id
    }
  }
`;

export const DELETE_OPTION = gql`
  mutation deleteOption($optionId: ID!) {
    deleteOption(where: {id: $optionId}) {
      id
    }
  }
`;
