import { EventEmitter } from 'events'
import { MarketEvent } from '../types/events/MarketEvent'
import { CollectibleEvent } from '../types/events/CollectibleEvent'
import { EventTypeEnum } from '../types/events/EventType'

const emitter = new EventEmitter()

type EventMap = {
  [EventTypeEnum.MARKET]: MarketEvent
  [EventTypeEnum.COLLECTIBLE]: CollectibleEvent
};

type Listener<K extends keyof EventMap> = (value: EventMap[K]) => void

const events = {
  on: <K extends keyof EventMap>(event: K, listener: Listener<K>): void => {
    emitter.on(event, listener)
  },

  off: <K extends keyof EventMap>(event: K, listener: Listener<K>): void => {
    emitter.off(event, listener)
  },

  once: <K extends keyof EventMap>(event: K, listener: Listener<K>): void => {
    emitter.once(event, listener)
  },

  emit: <K extends keyof EventMap>(event: K, value: EventMap[K]): void => {
    emitter.emit(event, value)
  },
}

export { events }
