
export type MarketDay = {
    marketPrice: number,
    dailyVariation: number
}

export type MarketDays = {
    [collectibleId: number]: MarketDay
}