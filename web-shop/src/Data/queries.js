import { gql } from '@apollo/client';

export const GET_CUSTOMERS = gql`
    query {
        customers {
            customerId
            name
        }
    }
`;

export const GET_PRODUCTS = gql`
    query products($offset: Int!, $pageSize: Int!) {
        products(offset: $offset, pageSize: $pageSize) {
            productId
            name
            unitPrice
            stock
            description
        }
    }
`;
