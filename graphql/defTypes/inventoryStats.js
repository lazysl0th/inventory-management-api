import { gql } from 'graphql-tag';

const inventoryStatsTypeDefs = gql`
    extend type Inventory {
        stats: FieldsStats
    }

    type FieldsStats {
        numStats: [NumericFieldStat!]!
        textStats: [TextFieldStat!]!
    }

    type NumericFieldStat {
        field: String!
        average: Float
        min: Float
        max: Float
    }

    type TextFieldStat {
        field: String!
        topValues: [TopValue!]!
    }

    type TopValue {
        value: String!
        count: Int!
    }
`;

export default inventoryStatsTypeDefs;
