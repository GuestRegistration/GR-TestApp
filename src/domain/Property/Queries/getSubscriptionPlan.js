import gql from 'graphql-tag';

export default gql`
    query getSubscriptionPlan{
        getSubscriptionPlan{
            id
            amount
            currency
            interval
            interval_count
            trial_period_days
            product{
                name
                active
            }
        }
    }`;