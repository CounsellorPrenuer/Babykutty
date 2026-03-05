
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'xwphlsr2',
    dataset: 'production',
    useCdn: false,
    token: 'sknwdzZnkyfRqIjwSofszsDGxAOaME66GQvzMcfUYX3gWOVzLLcbGF9R66nNZEBUcorSjSbcYKc3O0ti6C4rIpqEn359jl9CAvWg54fclnTA7POjmM0BJLvK8kvS6CFFnq3UfYkIriAgvNFd9IzLHdZKy7wvgZ5Ej3C7Z5cpA0sSr0ddX3x7',
    apiVersion: '2023-05-03'
});

const standardPackages = [
    {
        _id: 'pkg-1',
        _type: 'package',
        planName: 'Discover',
        category: '8-9 Students',
        categoryLabel: '8-9 Students',
        price: '₹5,500',
        paymentButtonId: 'pl_RwDuOx96VYrsyN',
        packageType: 'standard',
        subgroup: '8-9 Students',
        features: [
            { text: 'Psychometric assessment', included: true },
            { text: '1 career counselling session', included: true },
            { text: 'Lifetime Knowledge Gateway access', included: true },
            { text: 'Live webinar invites', included: true }
        ]
    },
    {
        _id: 'pkg-2',
        _type: 'package',
        planName: 'Discover Plus+',
        category: '8-9 Students',
        categoryLabel: '8-9 Students',
        price: '₹15,000',
        paymentButtonId: 'pl_RwDq8XpK76OhB3',
        packageType: 'standard',
        subgroup: '8-9 Students',
        features: [
            { text: 'Psychometric assessments', included: true },
            { text: '8 career counselling sessions (1/year)', included: true },
            { text: 'Custom reports & study abroad guidance', included: true },
            { text: 'CV building', included: true }
        ]
    },
    {
        _id: 'pkg-3',
        _type: 'package',
        planName: 'Achieve Online',
        category: '10-12 Students',
        categoryLabel: '10-12 Students',
        price: '₹5,999',
        paymentButtonId: 'pl_RwDxvLPQP7j4rG',
        packageType: 'standard',
        subgroup: '10-12 Students',
        features: [
            { text: 'Psychometric assessment', included: true },
            { text: '1 career counselling session', included: true },
            { text: 'Lifetime Knowledge Gateway access', included: true },
            { text: 'Pre-recorded webinars', included: true }
        ]
    },
    {
        _id: 'pkg-4',
        _type: 'package',
        planName: 'Achieve Plus+',
        category: '10-12 Students',
        categoryLabel: '10-12 Students',
        price: '₹10,599',
        paymentButtonId: '', // Placeholder
        packageType: 'standard',
        subgroup: '10-12 Students',
        features: [
            { text: 'Psychometric assessment', included: true },
            { text: '4 career counselling sessions', included: true },
            { text: 'Custom reports & study abroad guidance', included: true },
            { text: 'CV reviews', included: true }
        ]
    },
    {
        _id: 'pkg-5',
        _type: 'package',
        planName: 'Ascend Online',
        category: 'Graduates',
        categoryLabel: 'Graduates',
        price: '₹6,499',
        paymentButtonId: '', // Placeholder
        packageType: 'standard',
        subgroup: 'Graduates',
        features: [
            { text: 'Psychometric assessment', included: true },
            { text: '1 career counselling session', included: true },
            { text: 'Lifetime Knowledge Gateway access', included: true },
            { text: 'Pre-recorded webinars', included: true }
        ]
    },
    {
        _id: 'pkg-6',
        _type: 'package',
        planName: 'Ascend Plus+',
        category: 'Graduates',
        categoryLabel: 'Graduates',
        price: '₹10,599',
        paymentButtonId: '', // Placeholder
        packageType: 'standard',
        subgroup: 'Graduates',
        features: [
            { text: 'Psychometric assessment', included: true },
            { text: '3 career counselling sessions', included: true },
            { text: 'Certificate/online course info', included: true },
            { text: 'CV reviews for jobs', included: true }
        ]
    },
    {
        _id: 'mp-3',
        _type: 'package',
        planName: 'Ascend Online',
        category: 'Working Professionals',
        categoryLabel: 'Working Professionals',
        price: '₹6,499',
        paymentButtonId: '', // Placeholder
        packageType: 'standard',
        subgroup: 'Working Professionals',
        features: [
            { text: 'Psychometric assessment', included: true },
            { text: '1 career counselling session', included: true },
            { text: 'Lifetime Knowledge Gateway access', included: true },
            { text: 'Pre-recorded webinars', included: true }
        ]
    },
    {
        _id: 'mp-2',
        _type: 'package',
        planName: 'Ascend Plus+',
        category: 'Working Professionals',
        categoryLabel: 'Working Professionals',
        price: '₹10,599',
        paymentButtonId: '', // Placeholder
        packageType: 'standard',
        subgroup: 'Working Professionals',
        features: [
            { text: 'Psychometric assessment', included: true },
            { text: '3 career counselling sessions', included: true },
            { text: 'Certificate/online course info', included: true },
            { text: 'CV reviews for jobs', included: true }
        ]
    }
];

const customPackages = [
    {
        _id: 'custom-career-report',
        _type: 'package',
        planName: 'Career Report',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹1,500',
        packageType: 'custom',
        features: [
            { text: 'Detailed report of psychometric assessment', included: true },
            { text: 'Scientific analysis of interests', included: true },
            { text: 'Potential future paths consideration', included: true }
        ]
    },
    {
        _id: 'custom-career-report-counselling',
        _type: 'package',
        planName: 'Career Report + Career Counselling',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹3,000',
        packageType: 'custom',
        features: [
            { text: 'Connect with India\'s top career coaches', included: true },
            { text: 'Analyse psychometric report', included: true },
            { text: 'Shortlist top three career paths', included: true }
        ]
    },
    {
        _id: 'custom-knowledge-gateway',
        _type: 'package',
        planName: 'Knowledge Gateway + Career Helpline Access',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹100',
        packageType: 'custom',
        features: [
            { text: 'Holistic information on career paths', included: true },
            { text: 'Direct access to Mentoria\'s experts', included: true },
            { text: 'Career Helpline access until job landing', included: true }
        ]
    },
    {
        _id: 'custom-one-to-one-session',
        _type: 'package',
        planName: 'One-to-One Session with a Career Expert',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹3,500',
        packageType: 'custom',
        features: [
            { text: 'Resolve career queries with an expert', included: true },
            { text: 'Glimpse into your future world', included: true },
            { text: 'Session with expert from chosen field', included: true }
        ]
    },
    {
        _id: 'custom-college-admission-planning',
        _type: 'package',
        planName: 'College Admission Planning',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹3,000',
        packageType: 'custom',
        features: [
            { text: 'Unbiased recommendations for colleges', included: true },
            { text: 'Details for India and abroad', included: true },
            { text: 'Organised in one resourceful planner', included: true }
        ]
    },
    {
        _id: 'custom-exam-stress-management',
        _type: 'package',
        planName: 'Exam Stress Management',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹1,000',
        packageType: 'custom',
        features: [
            { text: 'Expert guidance on tackling exam stress', included: true },
            { text: 'Planning study schedule & revision tips', included: true },
            { text: 'Guidance from India\'s top educators', included: true }
        ]
    },
    {
        _id: 'custom-cap-100',
        _type: 'package',
        planName: 'College Admissions Planner - 100 (CAP-100)',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹199',
        packageType: 'custom',
        features: [
            { text: 'Ranked list of top 100 colleges', included: true },
            { text: 'Expert-curated based on verified cut-offs', included: true },
            { text: 'Four tier classification (Ivy, Target, etc.)', included: true }
        ]
    }
];

async function updateSanity() {
    console.log('Clearing existing packages...');
    const existing = await client.fetch('*[_type == "package"]{_id}');
    const transaction = client.transaction();
    existing.forEach((doc: any) => transaction.delete(doc._id));
    await transaction.commit();

    console.log('Adding standard packages...');
    const stdTransaction = client.transaction();
    standardPackages.forEach(pkg => stdTransaction.createOrReplace(pkg));
    await stdTransaction.commit();

    console.log('Adding custom packages...');
    const customTransaction = client.transaction();
    customPackages.forEach(pkg => customTransaction.createOrReplace(pkg));
    await customTransaction.commit();

    console.log('Sanity updated successfully!');
}

updateSanity().catch(console.error);
