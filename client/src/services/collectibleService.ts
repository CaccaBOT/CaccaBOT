import { CollectibleRarity } from '../enums/CollectibleRarity'

export function getCardRarityClass(rarityId: CollectibleRarity) {
  let rarityMap = {
    1: 'rarity-common',
    2: 'rarity-rare',
    3: 'rarity-epic',
    4: 'rarity-legendary'
  }

  return rarityMap[rarityId]
}

export function getTextRarityClass(rarityId: CollectibleRarity) {
  let rarityMap = {
    1: 'text-rarity-common',
    2: 'text-rarity-rare',
    3: 'text-rarity-epic',
    4: 'text-rarity-legendary'
  }

  return rarityMap[rarityId]
}

export function getRarityName(rarityId: CollectibleRarity) {
  return CollectibleRarity[rarityId]
}
