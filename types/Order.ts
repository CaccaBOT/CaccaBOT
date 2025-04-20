import { OrderType, OrderSide } from './OrderEnums'

export type Order = {
    id: number
    user_id: string
    collectible_id: number
    type: OrderType
    side: OrderSide
    price: number
    active: boolean
    executed: boolean
    execution_timestamp: Date
}