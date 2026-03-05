export default {
    name: 'coupon',
    title: 'Coupon Code',
    type: 'document',
    fields: [
        {
            name: 'code',
            title: 'Coupon Code',
            type: 'string',
            description: 'The code users will enter (e.g., SUMMER50, EARLYBIRD). Case-insensitive.',
            validation: (Rule: any) => Rule.required().uppercase(),
        },
        {
            name: 'discountType',
            title: 'Discount Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Percentage Off', value: 'percentage' },
                    { title: 'Flat Amount Off', value: 'flat' },
                ],
                layout: 'radio',
            },
            validation: (Rule: any) => Rule.required(),
            initialValue: 'percentage',
        },
        {
            name: 'discountValue',
            title: 'Discount Value',
            type: 'number',
            description: 'Enter the percentage (e.g., 50 for 50%) or the flat amount in ₹ (e.g., 500 for ₹500 off).',
            validation: (Rule: any) => Rule.required().positive(),
        },
        {
            name: 'isActive',
            title: 'Is Active',
            type: 'boolean',
            description: 'Turn this off to disable the coupon without deleting it.',
            initialValue: true,
        },
    ],
    preview: {
        select: {
            title: 'code',
            type: 'discountType',
            value: 'discountValue',
            active: 'isActive',
        },
        prepare({ title, type, value, active }: any) {
            const discountText = type === 'percentage' ? `${value}% OFF` : `₹${value} OFF`;
            const statusIcon = active ? '✅' : '🔴';
            return {
                title: title,
                subtitle: `${discountText} ${statusIcon}`,
            };
        },
    },
};
