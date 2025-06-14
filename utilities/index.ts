import moment from 'moment'

export function isSameDay(
  date1: moment.Moment | string | Date,
  date2: moment.Moment | string | Date
): boolean {
  return moment(date1).isSame(moment(date2), 'day')
}

export function compareDays(
  date1: moment.Moment | string | Date,
  date2: moment.Moment | string | Date
): number {
  const d1 = moment(date1).startOf('day')
  const d2 = moment(date2).startOf('day')

  if (d1.isBefore(d2)) return -1
  if (d1.isAfter(d2)) return 1
  return 0
}

export const rarityColors: Record<string, number> = {
  4: 0xffd600,
  3: 0x9500ff,
  2: 0x0068ff,
  1: 0x808080
}
