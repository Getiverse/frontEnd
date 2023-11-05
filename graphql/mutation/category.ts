import { gql } from '@apollo/client';
export const SELECT_CATEGORY = gql`
    mutation SelectCategory($type: String!) {
        selectCategory(categoryId: $type)
    }
`

