import { NextRequest } from 'next/server';

// Environment variables (add to .env.local)
const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!; // e.g., 'myzone'
const REGION = process.env.BUNNY_REGION || ''; // e.g., 'ny' or leave empty
const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!; // Storage password (keep secret!)
const PULL_ZONE_HOSTNAME = process.env.BUNNY_PULL_ZONE!; // e.g., 'my-cdn.b-cdn.net'

const baseHost = REGION ? `${REGION}.storage.bunnycdn.com` : 'storage.bunnycdn.com';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        // Allow custom path but fallback to filename. 
        // Ideally user provides a folder or specific name to avoid collisions.
        const remotePath = (formData.get('remotePath') as string) || (file?.name ?? `upload-${Date.now()}`);

        if (!file) {
            return Response.json({ message: 'No file provided' }, { status: 400 });
        }

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Construct the storage URL
        // storage.bunnycdn.com/storageZoneName/path/to/file.jpg
        const url = `https://${baseHost}/${STORAGE_ZONE}/${remotePath}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                AccessKey: ACCESS_KEY,
                'Content-Type': 'application/octet-stream', // BunnyCDN recommends this or actual type
            },
            body: buffer,
        });

        if (response.status === 201 || response.status === 200) {
            // 201 is typical for created, checks docs if 200 is possible on overwrite
            const cdnUrl = `https://${PULL_ZONE_HOSTNAME}/${remotePath}`;
            return Response.json({ success: true, cdnUrl });
        } else {
            const text = await response.text();
            return Response.json({ message: 'Bunny upload failed', details: text }, { status: 500 });
        }
    } catch (err) {
        console.error('Upload error:', err);
        return Response.json({ message: 'Server error', error: String(err) }, { status: 500 });
    }
}

// Important for large files: increase body size limit if needed
export const config = {
    api: {
        bodyParser: false, // We'll handle formData manually
    },
};
