export default {
    name: 'blog',
    title: 'Blog Post',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        },
        {
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
        },
        {
            name: 'date',
            title: 'Date',
            type: 'date',
        },
        {
            name: 'readTime',
            title: 'Read Time',
            type: 'string',
        },
        {
            name: 'gradient',
            title: 'Gradient',
            type: 'string',
        },
        {
            name: 'featured',
            title: 'Is Featured?',
            type: 'boolean',
        },
        {
            name: 'mainImage',
            title: 'Main image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
    ],
};
