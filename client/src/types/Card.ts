export type Card = {
  name: string
  description: string
  asset_url: string
  quantity: number
  rarity: Rarity
}

export type Rarity =
  | "Caccasmagorico"
  | "Sensazianale"
  | "Escrementale"
  | "Merdume"
