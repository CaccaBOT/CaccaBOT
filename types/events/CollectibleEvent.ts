import { CollectibleOwnership } from "../CollectibleOwnership"
import { RawUser } from "../User"
import { CollectibleActionEnum } from "./CollectibleActionEnum"

export type CollectibleEvent = {
    action: CollectibleActionEnum
    collectibles: CollectibleOwnership[]
    user: RawUser
}
