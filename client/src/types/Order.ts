import { OrderType } from '../enums/OrderTypeEnum'
import { OrderSide } from '../enums/OrderSideEnum'

export type Order = {
  id: number
  user_id: string
  collectible_id: number
  type: OrderType
  side: OrderSide
  price: number
  active: boolean
  creation_timestamp: Date
  executed: boolean
  execution_timestamp: Date
}
