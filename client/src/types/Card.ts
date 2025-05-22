import { CollectibleRarity } from '../enums/CollectibleRarity'

export type Card = {
  id: number
  name: string
  description: string
  asset_url: string
  quantity: number
  rarity_id: CollectibleRarity
  selling: number
}
