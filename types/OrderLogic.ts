import { OrderType } from './OrderEnums'

export type OrderLogic = {
  id: OrderType
  updateAll: () => void
}
