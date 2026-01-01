import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Explicit mapping for each file to ensure robustness
// Filename, ItemType, Category
const CONFIG: [string, string, string][] = [
    ['Bags.csv', 'BAGS', 'Accessories'],
    ['Belts.csv', 'BELTS', 'Accessories'],
    ['Blazers.csv', 'BLAZERS', "Men's Fashion"],
    ['Face caps.csv', 'CAPS', 'Accessories'],
    ['Jeans.csv', 'JEANS', "Men's Fashion"],
    ['Jogers.csv', 'JOGGERS', "Men's Fashion"],
    ["Men's Perfumes.csv", 'PERFUMES', 'Grooming & Fragrance'],
    ["Men's Sunglasses.csv", 'SUNGLASSES', 'Accessories'],
    ['Mens Frames.csv', 'FRAMES', 'Accessories'],
    ['Office shirts.csv', 'SHIRTS', "Men's Fashion"],
    ['Perfumes set.csv', 'PERFUMES', 'Grooming & Fragrance'],
    ['Polo.csv', 'POLOS', "Men's Fashion"],
    ['Shoes.csv', 'SHOES', "Men's Fashion"],
    ['Short Nikkas.csv', 'SHORTS', "Men's Fashion"],
    ['Sweaters.csv', 'SWEATERS', "Men's Fashion"],
    ['T-Shirts.csv', 'TSHIRTS', "Men's Fashion"],
    ['wallet.csv', 'WALLETS', 'Accessories'],
    ["Women's Perfumes set.csv", 'PERFUMES', 'Grooming & Fragrance'],
    ["Women's Perfumes.csv", 'PERFUMES', 'Grooming & Fragrance'],
    ['Womens frames.csv', 'FRAMES', 'Accessories'],
    ['womens sunglasses.csv', 'SUNGLASSES', 'Accessories'],
];

async function bundle() {
    console.log('🚀 Starting Robust CSV consolidation...');
    const stockDir = path.join(process.cwd(), 'stock');
    const allRows: any[] = [];
    const headers = ['Designer', 'Color', 'Description', 'Size', 'Price', 'Opening_Stock', 'Type', 'Category'];

    // Use index-based iteration for "specific file index" approach
    for (let i = 0; i < CONFIG.length; i++) {
        const [filename, itemType, category] = CONFIG[i];
        const filePath = path.join(stockDir, filename);

        if (!fs.existsSync(filePath)) {
            console.warn(`[${i}] ⚠️  File not found: ${filename}`);
            continue;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf-8');

            interface schema {
                Designer: string;
                Color: string;
                Description: string;
                Size: string;
                Price: string;
                Opening_Stock: string;
                Type: string;
                Category: string;
            }

            const records : schema[] = parse(content, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
                relax_column_count: true
            });

            console.log(`[${i}] 📑 Proccessing ${filename} -> ${itemType} (${records.length} items)`);

            for (const record of records) {
                const values = Object.values(record).join('').toLowerCase();
                if (values.includes('total')) continue;

                const row: any = {
                    Designer: record['Designer'] || 'Modemen',
                    Color: record['Color'] || '',
                    Description: record['Description'] || '',
                    Size: record['Size'] || '',
                    Price: record['Price'] || '0',
                    Opening_Stock: record['Opening_Stock'] || '1',
                    Type: itemType, // Explicit from config
                    Category: category
                };

                allRows.push(row);
            }
        } catch (err) {
            console.error(`[${i}] ❌ Error parsing ${filename}:`, err);
        }
    }

    const csvContent = [
        headers.join(','),
        ...allRows.map(row =>
            headers.map(h => {
                let val = String(row[h] || '');
                val = val.replace(/"/g, '""');
                if (val.includes(',') || val.includes('\n')) {
                    return `"${val}"`;
                }
                return val;
            }).join(',')
        )
    ].join('\n');

    const outputPath = path.join(stockDir, 'master_inventory.csv');
    fs.writeFileSync(outputPath, csvContent);

    console.log('\n✨ CONSOLIDATION COMPLETE ✨');
    console.log(`📍 Master file: ${outputPath}`);
    console.log(`📊 Total items bundled: ${allRows.length}`);
}

bundle().catch(console.error);
