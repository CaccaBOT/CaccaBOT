import { Job } from '../types/Job'
import { client } from '../discord/client'
import fs from 'fs'
import log from 'loglevel'
import { TextChannel } from 'discord.js'
import path from 'path'
import { config } from '../config/loader'
import { addMarketPriceHistory, getAllCollectibles, getMarketPriceHistory, getOrdersExecutedInDay } from '../database'
import moment from 'moment'

const saveMarketHistory: Job = {
    name: 'Save Market History',
    interval: '0 0 * * *',
    execute: async () => {
        const day = moment().tz(config.timezone).startOf('day').subtract(1, 'days').utc().toDate()

        log.info(`[MARKET] Saving prices for day ${day.toISOString().slice(0, 10)}`)

        const collectibles = getAllCollectibles()

        for (const collectible of collectibles) {
            const orders = getOrdersExecutedInDay(collectible.id, day)

            if (!orders || orders.length == 0) {
                const yesterday = moment().tz(config.timezone).startOf('day').subtract(2, 'days').utc().toDate()
                yesterday.setDate(yesterday.getDate() - 1)

                const previousMarketHistory = getMarketPriceHistory(collectible.id, yesterday)

                if (!previousMarketHistory) {
                    addMarketPriceHistory(collectible.id, day, {
                        openPrice: null,
                        closePrice: null,
                        highPrice: null,
                        lowPrice: null
                    })
                }
                else {
                    addMarketPriceHistory(collectible.id, day, {
                        openPrice: previousMarketHistory.open_price,
                        closePrice: previousMarketHistory.close_price,
                        highPrice: previousMarketHistory.high_price,
                        lowPrice: previousMarketHistory.low_price
                    })
                }
            }
            else {
                const openPrice = orders[0].price
                const closePrice = orders[orders.length - 1].price
                const highPrice = Math.max(...orders.map(x => x.price))
                const lowPrice = Math.min(...orders.map(x => x.price))

                addMarketPriceHistory(collectible.id, day, {
                    openPrice,
                    closePrice,
                    highPrice,
                    lowPrice
                })
            }
        }
    },
}

export default saveMarketHistory
