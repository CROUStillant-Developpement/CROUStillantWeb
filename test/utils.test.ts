import { describe, it, expect } from 'vitest'
import { slugify, getDates, formatToISODate, normalizeToDate, findRestaurantsAroundPosition } from '@/lib/utils'

describe('utils', () => {
  it('slugify should create url-friendly slugs', () => {
    expect(slugify('Crème Brûlée')).toBe('creme-brulee')
    expect(slugify('  Multiple   spaces ')).toBe('multiple-spaces')
    expect(slugify('Café & Bar')).toBe('cafe-bar')
  })

  it('getDates should return weekdays between two dates', () => {
    const start = new Date('2024-12-30') // Monday
    const end = new Date('2025-01-05') // Sunday
    const dates = getDates(start, end)
    // Monday(30), Tue(31), Wed(1), Thu(2), Fri(3) => 5 days
    expect(dates.length).toBe(5)
    expect(dates[0].getDay()).not.toBe(0)
  })

  it('formatToISODate converts DD-MM-YYYY to Date', () => {
    const d = formatToISODate('30-12-2024')
    expect(d.toISOString()).toBe('2024-12-30T00:00:00.000Z')
  })

  it('normalizeToDate resets time components', () => {
    const d = new Date('2024-12-30T15:23:10.500Z')
    const norm = normalizeToDate(d)
    expect(norm.getHours()).toBe(0)
    expect(norm.getMinutes()).toBe(0)
  })

  it('findRestaurantsAroundPosition filters and sorts by distance', () => {
    const restaurants = [
      { id: 'a', latitude: 48.8566, longitude: 2.3522 }, // Paris
      { id: 'b', latitude: 51.5074, longitude: -0.1278 }, // London
      { id: 'c' }, // missing coords
    ] as any

    const pos = { coords: { latitude: 48.8566, longitude: 2.3522 } } as any
    const nearby = findRestaurantsAroundPosition(restaurants, pos, 50) // 50km
    expect(nearby.length).toBe(1)
    expect(nearby[0].code).toBe('a')
  })
})
