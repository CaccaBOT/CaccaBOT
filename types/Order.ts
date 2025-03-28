import { OrderType, OrderSide } from './OrderEnums'

export type Order = {
    id: number
    collectible_id: number
    type: OrderType
    side: OrderSide
    price: number
    active: boolean
}