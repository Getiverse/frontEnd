import { gql } from '@apollo/client';



export const GET_ALL_CATEGORIES = gql`
query {
    findAllCategories {
        name,
        image,
        id
    }
}
`;
