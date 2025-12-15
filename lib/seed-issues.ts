import db from './prisma';

const MOCK_ISSUES = [
    {
        id: 'issue-1',
        title: 'The Renaissance Issue',
        releaseDate: new Date('2025-12-01'),
        coverImage: 'https://images.unsplash.com/photo-1544654803-b69140b285a1?w=500&auto=format&fit=crop&q=60',
        description: 'Exploring the rebirth of African luxury fashion and the new guard of designers redefining the global stage.',
        teaserText: 'The New African Luxury',
        viewLink: 'https://example.com/read/renaissance',
        buyLink: 'https://example.com/buy/renaissance',
    },
    {
        id: 'issue-2',
        title: 'The Power List 2024',
        releaseDate: new Date('2024-11-01'),
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
        description: 'Our annual ranking of the most influential men in business, politics, and culture across the continent.',
        teaserText: 'Who Runs Africa?',
        viewLink: 'https://example.com/read/power-list-2024',
    },
    {
        id: 'issue-3',
        title: 'Tech Titans',
        releaseDate: new Date('2024-10-01'),
        coverImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60',
        description: 'Inside the minds of the founders building the next unicorns. Exclusive interviews with the creators of Flutterwave, Paystack, and more.',
        teaserText: 'Building the Future',
        viewLink: 'https://example.com/read/tech-titans',
        buyLink: 'https://example.com/buy/tech-titans',
    },
    {
        id: 'issue-4',
        title: 'The Art of Living',
        releaseDate: new Date('2024-09-01'),
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60',
        description: 'A dedicated issue to architecture, interior design, and the finest properties in Lagos, Cape Town, and Nairobi.',
        teaserText: 'Curating Your Space',
        viewLink: 'https://example.com/read/art-of-living',
    },
    {
        id: 'issue-5',
        title: 'Summer Escapes',
        releaseDate: new Date('2024-08-01'),
        coverImage: 'https://images.unsplash.com/photo-1571896349842-68c69102d289?w=500&auto=format&fit=crop&q=60',
        description: 'The ultimate guide to luxury travel. Hidden gems in Zanzibar, the best resorts in Seychelles, and city breaks in Marrakech.',
        teaserText: 'Wanderlust Defined',
        viewLink: 'https://example.com/read/summer-escapes',
        buyLink: 'https://example.com/buy/summer-escapes',
    },
    {
        id: 'issue-6',
        title: 'The Gentleman\'s Guide',
        releaseDate: new Date('2024-07-01'),
        coverImage: 'https://images.unsplash.com/photo-1617137968427-85924c809a22?w=500&auto=format&fit=crop&q=60',
        description: 'Essential etiquette, style rules, and grooming tips for the modern man. Mastering the art of being a gentleman in 2024.',
        teaserText: 'Timeless Elegance',
        viewLink: 'https://example.com/read/gentlemans-guide',
    },
    {
        id: 'issue-7',
        title: 'Wheels & Watches',
        releaseDate: new Date('2024-06-01'),
        coverImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&auto=format&fit=crop&q=60',
        description: 'A high-octane issue featuring the latest supercars and the most complicated timepieces from Geneva.',
        teaserText: 'Precision Engineering',
        viewLink: 'https://example.com/read/wheels-watches',
        buyLink: 'https://example.com/buy/wheels-watches',
    },
    {
        id: 'issue-8',
        title: 'Culinary Journeys',
        releaseDate: new Date('2024-05-01'),
        coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&auto=format&fit=crop&q=60',
        description: 'Exploring the diverse flavors of African cuisine. From street food in Accra to fine dining in Johannesburg.',
        teaserText: 'Taste of Africa',
        viewLink: 'https://example.com/read/culinary-journeys',
    },
];

async function main() {
    console.log('Seeding Issues only...');
    for (const issue of MOCK_ISSUES) {
        await db.issues.upsert({
            where: { id: issue.id },
            update: {
                title: issue.title,
                releaseDate: issue.releaseDate,
                coverImage: issue.coverImage,
                description: issue.description,
                teaserText: issue.teaserText,
                viewLink: issue.viewLink,
                buyLink: issue.buyLink,
            },
            create: {
                id: issue.id,
                title: issue.title,
                releaseDate: issue.releaseDate,
                coverImage: issue.coverImage,
                description: issue.description,
                teaserText: issue.teaserText,
                viewLink: issue.viewLink,
                buyLink: issue.buyLink,
            },
        });
    }
    console.log(`${MOCK_ISSUES.length} Issues seeded.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
