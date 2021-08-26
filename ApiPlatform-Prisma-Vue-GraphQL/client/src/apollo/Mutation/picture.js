import gql from "graphql-tag";

export const DELETE_PICTURE = gql`
  mutation deletePicture($pictureId: ID!) {
    deletePicture(where: {id: $pictureId}) {
      id
    }
  }
`;
