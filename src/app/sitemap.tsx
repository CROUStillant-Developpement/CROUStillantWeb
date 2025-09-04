import type { MetadataRoute } from 'next'


const SITE_URL = 'https://croustillant.menu'
const API_URL = 'https://api.croustillant.menu'

const links = [
    {
        url: SITE_URL,
        changeFrequency: "yearly" as const,
        priority: 1,
        alternates: {
            languages: {
                fr: `${SITE_URL}/fr`,
                en: `${SITE_URL}/en`,
            },
        },
    },
    {
        url: API_URL,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    },
    {
        url: `${SITE_URL}/restaurants`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: {
            languages: {
                fr: `${SITE_URL}/fr/restaurants`,
                en: `${SITE_URL}/en/restaurants`,
            },
        },
    },
    {
        url: `${SITE_URL}/dishes`,
        changeFrequency: "daily" as const,
        priority: 0.7,
        alternates: {
            languages: {
                fr: `${SITE_URL}/fr/dishes`,
                en: `${SITE_URL}/en/dishes`,
            },
        },
    },
    {
        url: `${SITE_URL}/stats`,
        changeFrequency: "daily" as const,
        priority: 0.7,
        alternates: {
            languages: {
                fr: `${SITE_URL}/fr/stats`,
                en: `${SITE_URL}/en/stats`,
            },
        },
    },
    {
        url: `${SITE_URL}/about`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
            languages: {
                fr: `${SITE_URL}/fr/about`,
                en: `${SITE_URL}/en/about`,
            },
        },
    },
    {
        url: `${SITE_URL}/legal`,
        changeFrequency: "yearly" as const,
        priority: 0.5,
        alternates: {
            languages: {
                fr: `${SITE_URL}/fr/legal`,
                en: `${SITE_URL}/en/legal`,
            },
        },
    },
    {
        url: `${SITE_URL}/changelog`,
        changeFrequency: "yearly" as const,
        priority: 0.5,
        alternates: {
            languages: {
                fr: `${SITE_URL}/fr/changelog`,
                en: `${SITE_URL}/en/changelog`,
            },
        },
    },
];

export default function sitemap(): MetadataRoute.Sitemap {
    return links
}
