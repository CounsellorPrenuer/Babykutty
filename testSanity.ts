import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'xwphlsr2',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2023-05-03'
});

async function main() {
    try {
        const data = await client.fetch("*[_type == 'package']");
        console.log("SCHEMA SAMPLE: ", JSON.stringify(data[0], null, 2));
    } catch (e) {
        console.error("Public fetch failed: ", e.message);
    }
}

main();
