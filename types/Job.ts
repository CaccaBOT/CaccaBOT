export type Job = {
    name: string
    interval: string
    execute: () => void
}