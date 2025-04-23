import { OrderSide } from "../enums/OrderSideEnum"
import { OrderType } from "../enums/OrderTypeEnum"

export type OrderRequest = {
	collectibleId: number
	type: OrderType
	side: OrderSide
	price: number
	quantity: number
}