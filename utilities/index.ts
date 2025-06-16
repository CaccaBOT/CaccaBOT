import moment from 'moment'
import * as crypto from 'crypto'
import log from 'loglevel'

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

export function getKeyFromUserId(userId: string): Buffer {
  return crypto.createHash('sha256').update(userId).digest()
}

export function encryptRiddlePart(
  riddlePartId: string,
  userId: string
): string {
  const key = getKeyFromUserId(userId);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(riddlePartId, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return `${iv.toString('base64')}:${encrypted}`;
}

export function decryptRiddlePart(
  encryptedStr: string,
  userId: string
): string | null {
  try {
    // 1. Check the format: exactly one colon separating IV and ciphertext
    const parts = encryptedStr.split(':');
    if (parts.length !== 2)
      return null;

    const [ivBase64, data] = parts;

    // 2. Validate IV base64 characters
    if (!/^[A-Za-z0-9+/=]+$/.test(ivBase64))
      return null;

    // 3. Decode IV and check length
    const iv = Buffer.from(ivBase64, 'base64');
    if (iv.length !== 16) return null;

    // 4. Derive key and validate length
    const key = getKeyFromUserId(userId);
    if (!Buffer.isBuffer(key) || key.length !== 32)
      return null;

    // 5. Decrypt ciphertext
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    // 6. Optionally, you could validate decrypted string here (e.g. regex or length)
    return decrypted;
  } catch (e) {
    log.info(e)
    // Catch any errors (bad base64, decryption errors, padding errors)
    return null;
  }
}