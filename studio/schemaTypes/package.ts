export default {
    name: 'package',
    title: 'Pricing Package',
    type: 'document',
    fields: [
        {
            name: 'planName',
            title: 'Plan Name',
            type: 'string',
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
        },
        {
            name: 'categoryLabel',
            title: 'Category Label',
            type: 'string',
        },
        {
            name: 'price',
            title: 'Price',
            type: 'string',
        },
        {
            name: 'paymentButtonId',
            title: 'Razorpay Payment Button ID',
            type: 'string',
        },
        {
            name: 'packageType',
            title: 'Package Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Standard', value: 'standard' },
                    { title: 'Custom', value: 'custom' },
                ],
            },
        },
        {
            name: 'subgroup',
            title: 'Subgroup',
            type: 'string',
            description: 'Used for grouping standard packages',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'text',
                            title: 'Feature Text',
                            type: 'string',
                        },
                        {
                            name: 'included',
                            title: 'Is Included?',
                            type: 'boolean',
                        },
                    ],
                },
            ],
        },
    ],
};
