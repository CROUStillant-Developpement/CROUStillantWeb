import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRestaurantMenu } from '@/hooks/useRestaurantMenu'
import { formatToISODate } from '@/lib/utils'
import { Menu, DateMenu } from '@/services/types'

// Mock menu-service
const mockGetMenuByRestaurantId = vi.fn()
const mockGetMenuByRestaurantIdAndDate = vi.fn()
const mockGetFutureDatesMenuAvailable = vi.fn()
const mockGetDatesMenuAvailable = vi.fn()
vi.mock('@/services/menu-service', () => ({
    getMenuByRestaurantId: (...args: any[]) => mockGetMenuByRestaurantId(...args),
    getMenuByRestaurantIdAndDate: (...args: any[]) => mockGetMenuByRestaurantIdAndDate(...args),
    getFutureDatesMenuAvailable: (...args: any[]) => mockGetFutureDatesMenuAvailable(...args),
    getDatesMenuAvailable: (...args: any[]) => mockGetDatesMenuAvailable(...args),
}))

// Keep utils real formatToISODate and normalizeToDate
vi.mock('@/lib/utils', async () => {
    const actual = await vi.importActual<any>('../src/lib/utils')
    return {
        ...actual,
    }
})

describe('useRestaurantMenu', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('future mode sets menu and dates when available', async () => {
        const rCode = 123
        const today = new Date()
        const fmt = (d: Date) => `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
        const menuItem: Menu = { date: fmt(today), repas: [] } as any
        const dateMenu: DateMenu = { date: fmt(today) } as any

        mockGetMenuByRestaurantId.mockResolvedValue({ success: true, data: [menuItem] })
        mockGetFutureDatesMenuAvailable.mockResolvedValue({ success: true, data: [dateMenu] })

        const { result } = renderHook(() =>
            useRestaurantMenu({ restaurantCode: rCode, mode: 'future' })
        )

        await waitFor(() => expect(result.current.datesLoading).toBe(false))

        expect(result.current.menu.length).toBeGreaterThanOrEqual(1)
        expect(result.current.dates.length).toBeGreaterThanOrEqual(1)
        expect(result.current.noMenuAtAll).toBe(false)
    })

    it('history mode with past dates sets dates and selectedDate', async () => {
        const rCode = 456
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const fmt = (d: Date) => `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
        const dateMenu: DateMenu = { date: fmt(yesterday) } as any

        mockGetDatesMenuAvailable.mockResolvedValue({ success: true, data: [dateMenu] })

        const { result } = renderHook(() =>
            useRestaurantMenu({ restaurantCode: rCode, mode: 'history' })
        )

        await waitFor(() => expect(result.current.datesLoading).toBe(false))

        expect(result.current.dates.length).toBe(1)
        expect(result.current.selectedDate).toBeDefined()
        expect(result.current.noHistoryAtAll).toBe(false)
    })

    it('history mode with no dates sets noHistoryAtAll', async () => {
        const rCode = 789
        mockGetDatesMenuAvailable.mockResolvedValue({ success: true, data: [] })

        const { result } = renderHook(() =>
            useRestaurantMenu({ restaurantCode: rCode, mode: 'history' })
        )

        await waitFor(() => expect(result.current.datesLoading).toBe(false))

        expect(result.current.noHistoryAtAll).toBe(true)
    })

    it('future mode initial menu data populates selected date meals', async () => {
        const rCode = 303
        const someDate = new Date(2025, 2, 3)
        const repas = [
            { type: 'matin', name: 'breakfast' },
            { type: 'midi', name: 'lunch' },
        ] as any
        const fmt = (d: Date) => `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
        const menuData: Menu = { date: fmt(someDate), repas } as any

        mockGetMenuByRestaurantId.mockResolvedValue({ success: true, data: [menuData] })
        mockGetFutureDatesMenuAvailable.mockResolvedValue({ success: true, data: [{ date: menuData.date }] })

        const { result } = renderHook(() =>
            useRestaurantMenu({ restaurantCode: rCode, mode: 'future' })
        )

        await waitFor(() => expect(result.current.datesLoading).toBe(false))

        expect(result.current.menu.length).toBeGreaterThan(0)
        // selectedDate should be set to the menu's date (compare times)
        expect(result.current.selectedDate.getTime()).toBe(
            formatToISODate(menuData.date as unknown as string).getTime()
        )
    })

    it('fetchMenuForDate failure blacklists date and clears meals', async () => {
        const rCode = 202
        const someDate = new Date(2025, 1, 1)

        mockGetMenuByRestaurantId.mockResolvedValue({ success: false, data: [] })
        mockGetFutureDatesMenuAvailable.mockResolvedValue({ success: false, data: [] })
        mockGetDatesMenuAvailable.mockResolvedValue({ success: false, data: [] })

        mockGetMenuByRestaurantIdAndDate.mockResolvedValue({ success: false, data: null })

        const { result } = renderHook(() =>
            useRestaurantMenu({ restaurantCode: rCode, mode: 'history' })
        )

        await waitFor(() => expect(result.current.datesLoading).toBe(false))

        act(() => {
            result.current.setSelectedDate(someDate)
        })

        await waitFor(() => expect(result.current.menuLoading).toBe(false))

        // Since fetch failed, meals should be empty
        expect(result.current.selectedDateMeals.length).toBe(0)
    })
})
