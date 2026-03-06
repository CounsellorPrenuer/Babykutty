
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
        _id: 'career-report',
        _type: 'package',
        planName: 'Career Report',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹1,500',
        packageType: 'custom',
        subgroup: 'Custom',
        description: 'Get a detailed report of your psychometric assessment for a scientific analysis of your interests. Find out where your interests lie and which future paths you can potentially consider.',
        features: []
    },
    {
        _id: 'career-report-counselling',
        _type: 'package',
        planName: 'Career Report + Career Counselling',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹3,000',
        packageType: 'custom',
        subgroup: 'Custom',
        description: 'Connect with India\'s top career coaches to analyse your psychometric report and shortlist the top three career paths you\'re most likely to enjoy and excel at.',
        features: []
    },
    {
        _id: 'knowledge-gateway',
        _type: 'package',
        planName: 'Knowledge Gateway + Career Helpline Access',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹100',
        packageType: 'custom',
        subgroup: 'Custom',
        description: 'Unlock holistic information on your career paths and get direct access to Mentoria\'s experts, who will resolve your career-related queries through our dedicated Career Helpline. Validate your career decisions from now until you land a job you love.',
        features: []
    },
    {
        _id: 'one-to-one-session',
        _type: 'package',
        planName: 'One-to-One Session with a Career Expert',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹3,500',
        packageType: 'custom',
        subgroup: 'Custom',
        description: 'Resolve your career queries and glimpse into your future world through a one-on-one session with an expert from your chosen field.',
        features: []
    },
    {
        _id: 'college-admission-planning',
        _type: 'package',
        planName: 'College Admission Planning',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹3,000',
        packageType: 'custom',
        subgroup: 'Custom',
        description: 'Get unbiased recommendations and details on your future college options in India and abroad, organised in one resourceful planner.',
        features: []
    },
    {
        _id: 'exam-stress-management',
        _type: 'package',
        planName: 'Exam Stress Management',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹1,000',
        packageType: 'custom',
        subgroup: 'Custom',
        description: 'Get expert guidance on tackling exam stress, planning your study schedule, revision tips and more from India\'s top educators. Increase your chances of acing exams with a calm and clear mind.',
        features: []
    },
    {
        _id: 'cap-100',
        _type: 'package',
        planName: 'College Admissions Planner - 100 (CAP-100)',
        category: 'Custom',
        categoryLabel: 'Custom',
        price: '₹199',
        packageType: 'custom',
        subgroup: 'Custom',
        description: '₹199 for a ranked list of the top 100 colleges in your course. Get an expert-curated list of colleges based on verified cut-offs. CAP-100 ranks the top 100 colleges into four tiers to help you plan smarter: Indian Ivy League, Target, Smart Backup, and Safe Bet colleges. You can then shortlist colleges based on where you stand!',
        features: []
    }
];

const blogs = [
    {
        _id: 'blog-1',
        _type: 'blog',
        title: 'How to Choose the Right Career Path in 2026',
        excerpt: 'Navigating the modern job market requires a blend of self-awareness and data-driven insights. Learn how Mentoria\'s psychometric approach helps you find your "North Star".',
        category: 'Career Guidance',
        date: 'March 5, 2026',
        readTime: '5 min read',
        gradient: 'from-blue-500 to-indigo-600',
        featured: true
    },
    {
        _id: 'blog-2',
        _type: 'blog',
        title: 'Beating Exam Stress: A Student\'s Guide',
        excerpt: 'Exam season doesn\'t have to be overwhelming. Discover proven techniques for stress management, effective revision, and maintaining peak mental performance.',
        category: 'Education',
        date: 'March 4, 2026',
        readTime: '4 min read',
        gradient: 'from-orange-400 to-red-500',
        featured: true
    },
    {
        _id: 'blog-3',
        _type: 'blog',
        title: 'The Future of AI in Modern Careers',
        excerpt: 'Artificial Intelligence is reshaping every industry. Understand how you can leverage AI tools and which "human-only" skills will remain high in demand.',
        category: 'Technology',
        date: 'March 3, 2026',
        readTime: '6 min read',
        gradient: 'from-emerald-400 to-teal-600',
        featured: true
    }
];

async function updateSanity() {
    console.log('Clearing existing data...');
    const existing = await client.fetch('*[_type in ["package", "blog"]]{_id}');
    const transaction = client.transaction();
    existing.forEach((doc: any) => transaction.delete(doc._id));
    await transaction.commit();

    console.log('Adding packages...');
    const pkgTransaction = client.transaction();
    [...standardPackages, ...customPackages].forEach(pkg => pkgTransaction.createOrReplace(pkg));
    await pkgTransaction.commit();

    console.log('Adding blog posts...');
    const blogTransaction = client.transaction();
    blogs.forEach(blog => blogTransaction.createOrReplace(blog));
    await blogTransaction.commit();

    console.log('Sanity updated successfully!');
}

updateSanity().catch(console.error);
