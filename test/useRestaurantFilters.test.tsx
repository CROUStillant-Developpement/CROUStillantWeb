import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useRestaurantFilters } from '@/hooks/useRestaurantFilters'
import { Restaurant } from '@/services/types'

// Configurable mocks for next/navigation to allow per-test searchParams
let currentSearchParams = new URLSearchParams()
let currentPathname = '/'
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => currentPathname,
    useSearchParams: () => currentSearchParams,
}))

// Mock user preferences store
vi.mock('@/store/userPreferencesStore', () => ({
    useUserPreferences: () => ({ favouriteRegion: { code: 1 } }),
}))

// Mock locale hook
vi.mock('next-intl', () => ({ useLocale: () => 'en' }))

// Mock utils functions (geolocation)
const mockGetGeoLocation = vi.fn()
const mockFindAround = vi.fn()
vi.mock('@/lib/utils', () => ({
    getGeoLocation: () => mockGetGeoLocation(),
    findRestaurantsAroundPosition: (...args: any[]) => mockFindAround(...args),
}))

// Mock filters functions
vi.mock('@/lib/filters', () => ({
    filterRestaurants: (restaurants: Restaurant[]) => restaurants,
    sortRestaurants: (restaurants: Restaurant[]) => restaurants,
    buildQueryString: (filters: any) => 'q=1',
}))

// Mock debounce to call immediate and provide cancel
vi.mock('usehooks-ts', () => ({
    useDebounceCallback: (fn: any) => {
        const cb = (...args: any[]) => fn(...args)
        cb.cancel = vi.fn()
        return cb
    },
}))

describe('useRestaurantFilters', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        currentSearchParams = new URLSearchParams()
        currentPathname = '/'
    })

    it('initializes filters and exposes resetFilters', () => {
        const restaurants: Restaurant[] = [
            { id: 'a', latitude: 0, longitude: 0 } as any,
        ]

        const setFilteredRestaurants = vi.fn()
        const setLoading = vi.fn()

        const { result } = renderHook(() =>
            useRestaurantFilters(restaurants, setFilteredRestaurants, setLoading)
        )

        // initial filters object
        expect(result.current.filters).toBeDefined()

        act(() => {
            result.current.resetFilters()
        })

        expect(setFilteredRestaurants).toHaveBeenCalledWith(restaurants)
    })

    it('initializeFilters reads search params and sets filters accordingly', () => {
        currentSearchParams = new URLSearchParams(
            'search=foo&ispmr=true&open=true&region=2&izly=true&card=true&restaurantCityAsc=true&restaurantType=3'
        )

        const restaurants: Restaurant[] = []
        const setFilteredRestaurants = vi.fn()
        const setLoading = vi.fn()

        const { result } = renderHook(() =>
            useRestaurantFilters(restaurants, setFilteredRestaurants, setLoading)
        )

        // filters should reflect search params
        expect(result.current.filters.search).toBe('foo')
        expect(result.current.filters.isPmr).toBe(true)
        expect(result.current.filters.isOpen).toBe(true)
        expect(result.current.filters.crous).toBe(2)
        expect(result.current.filters.izly).toBe(true)
        expect(result.current.filters.card).toBe(true)
        expect(result.current.filters.restaurantCityAsc).toBe(true)
        expect(result.current.filters.restaurantType).toBe(3)
    })

    it('activeFilterCount counts non-default filters', () => {
        const restaurants: Restaurant[] = []
        const setFilteredRestaurants = vi.fn()
        const setLoading = vi.fn()

        const { result } = renderHook(() =>
            useRestaurantFilters(restaurants, setFilteredRestaurants, setLoading)
        )

        // favouriteRegion is set by the mocked store, so one active filter expected
        expect(result.current.activeFilterCount).toBe(1)

        act(() => {
            result.current.setFilters({ ...result.current.filters, search: 'x', izly: true })
        })

        expect(result.current.activeFilterCount).toBeGreaterThanOrEqual(1)
    })

    it('updates query string (router.push) when filters change', () => {
        const restaurants: Restaurant[] = []
        const setFilteredRestaurants = vi.fn()
        const setLoading = vi.fn()

        const { result } = renderHook(() =>
            useRestaurantFilters(restaurants, setFilteredRestaurants, setLoading)
        )

        act(() => {
            result.current.setFilters({ ...result.current.filters, search: 'updated' })
        })

        expect(mockPush).toHaveBeenCalled()
    })

    it('handleLocationRequest sets geoLocError on failure', async () => {
        const restaurants: Restaurant[] = [
            { id: 'a', latitude: 48.8566, longitude: 2.3522 } as any,
        ]

        const setFilteredRestaurants = vi.fn()
        const setLoading = vi.fn()

        mockGetGeoLocation.mockRejectedValue(new Error('denied'))

        const { result } = renderHook(() =>
            useRestaurantFilters(restaurants, setFilteredRestaurants, setLoading)
        )

        await act(async () => {
            await result.current.handleLocationRequest()
        })

        expect(result.current.geoLocError).toBe('denied')
    })
})
