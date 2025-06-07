import { Order } from "../Order"
import { User } from "../User"
import { MarketActionEnum } from "./MarketActionEnum"

export type MarketEvent = {
    action: MarketActionEnum
    orders: Order[]
    user: User
}
