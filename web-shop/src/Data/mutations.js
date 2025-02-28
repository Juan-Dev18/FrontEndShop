import { gql } from '@apollo/client';

//Juan Carrasco: I applied GraphQL in the Backend, it was easier than in the Frontend, only the sending of this mutation gave problems.

export const SET_ORDER = gql`
  mutation InsertOrder($request: RequestCreateOrder!) {
    insertOrder(request: $request) {
      message
    }
  }
`;