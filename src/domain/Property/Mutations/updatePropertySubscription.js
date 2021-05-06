import gql from 'graphql-tag';
export default gql`
    mutation updatePropertySubscription($property_id: ID!, $update: PropertySubscriptionUpdateInput){
        updatePropertySubscription(property_id: $property_id, update: $update){
            id
            object
            cancel_at
            cancel_at_period_end
            canceled_at
            collection_method
            created
            current_period_end
            current_period_start
            customer
            days_until_due
            default_payment_method
            default_source
            ended_at
            items{
                object
                has_more
                url
                data {
                    id
                    object
                    created
                    price {
                        id
                        amount
                        currency
                        active
                    }
                    quantity
                    subscription
                }
            }
            livemode
            metadata {
                property_id
            }
            start_date
            status
            trial_end
            trial_start
        }
    }
`