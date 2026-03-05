
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'xwphlsr2',
    dataset: 'production',
    useCdn: false,
    token: 'sknwdzZnkyfRqIjwSofszsDGxAOaME66GQvzMcfUYX3gWOVzLLcbGF9R66nNZEBUcorSjSbcYKc3O0ti6C4rIpqEn359jl9CAvWg54fclnTA7POjmM0BJLvK8kvS6CFFnq3UfYkIriAgvNFd9IzLHdZKy7wvgZ5Ej3C7Z5cpA0sSr0ddX3x7',
    apiVersion: '2023-05-03'
});

async function main() {
    const data = await client.fetch("*[_type == 'package']{planName, paymentButtonId, category, price}");
    console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
