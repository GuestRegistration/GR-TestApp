import gql from 'graphql-tag';
export default gql`
    mutation createPropertySubscription($property_id: ID!, $customer_id: ID, $credit_card_id: ID){
        createPropertySubscription(property_id: $property_id, customer_id: $customer_id, credit_card_id: $credit_card_id){
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