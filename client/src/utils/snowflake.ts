export function isSnowflake(snoflake: string): boolean {
    const regex = /^(?<id>\d{17,20})$/
    return regex.test(snoflake);
}