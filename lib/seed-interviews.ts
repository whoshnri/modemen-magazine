import db from './prisma';

const INTERVIEWS = [
    {
        id: '1',
        name: 'Davido',
        role: 'Musician & Mogul',
        title: 'Timeless Influence',
        image: 'https://i.pinimg.com/236x/e2/6c/58/e26c58c7838e1fb7c34aa73e6384eee6.jpg',
        slug: 'davido-timeless-influence',
        content: "This interview featured famous artist, influencer and celebrity Davido. It covered his journey from to becoming the successful voice that he is today. He shared his experiences and insights on the music industry and the impact of social media on the industry.",
        featured: true
    },
    {
        id: '2',
        name: 'Tony Elumelu',
        role: 'Philanthropist & Entrepreneur',
        title: 'The Art of Africapitalism',
        image: 'https://i.pinimg.com/736x/cd/22/82/cd2282c4d3e4c9719ecfd16f7c94013b.jpg',
        slug: 'tony-elumelu-africapitalism',
        content: "This interview featured Tony Elumelu, the founder of the Tony Elumelu Foundation. It covered his journey from to becoming the successful voice that he is today.",
        featured: true
    },
    {
        id: '3',
        name: 'Chimamanda N. Adichie',
        role: 'Author & Speaker',
        title: 'Stories That Matter',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
        slug: 'chimamanda-stories-matter',
        content: "In a world desperate for authentic narratives, Chimamanda Ngozi Adichie continues to be a beacon of truth.",
        featured: true
    },
    {
        id: '4',
        name: 'Burna Boy',
        role: 'Afro-Fusion Giant',
        title: 'Conquering the World',
        image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&auto=format&fit=crop&q=60',
        slug: 'burna-boy-conquering-world',
        content: "From Port Harcourt to Madison Square Garden, Burna Boy's journey has been nothing short of meteoric.",
        featured: true
    },
    {
        id: '5',
        name: 'Aliko Dangote',
        role: 'Business Titan',
        title: 'Building an Empire',
        image: 'https://images.unsplash.com/photo-1556157382-97eda2d6229b?w=500&auto=format&fit=crop&q=60',
        slug: 'aliko-dangote-building-empire',
        content: "Africa's richest man is not slowing down. With the launch of the new refinery...",
        featured: false
    },
    {
        id: '6',
        name: 'Tiwa Savage',
        role: 'Queen of Afrobeats',
        title: 'Water & Fire',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&auto=format&fit=crop&q=60',
        slug: 'tiwa-savage-water-fire',
        content: "Tiwa Savage has seen it all. The highs, the lows, and everything in between.",
        featured: false
    }
];

async function main() {
    console.log('Seeding Interviews only...');
    for (const interview of INTERVIEWS) {
        await db.interview.upsert({
            where: { slug: interview.slug },
            update: {
                people: interview.name,
                tagline: interview.role,
                title: interview.title,
                coverImage: interview.image,
                content: interview.content,
                featured: interview.featured,
            },
            create: {
                people: interview.name,
                tagline: interview.role,
                title: interview.title,
                coverImage: interview.image,
                content: interview.content,
                slug: interview.slug,
                featured: interview.featured,
            },
        });
    }
    console.log(`${INTERVIEWS.length} Interviews seeded.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
