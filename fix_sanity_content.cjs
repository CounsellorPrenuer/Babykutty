const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'xwphlsr2',
    dataset: 'production',
    useCdn: false,
    token: 'sknwdzZnkyfRqIjwSofszsDGxAOaME66GQvzMcfUYX3gWOVzLLcbGF9R66nNZEBUcorSjSbcYKc3O0ti6C4rIpqEn359jl9CAvWg54fclnTA7POjmM0BJLvK8kvS6CFFnq3UfYkIriAgvNFd9IzLHdZKy7wvgZ5Ej3C7Z5cpA0sSr0ddX3x7', // User provided token
    apiVersion: '2023-05-03'
});

const blogContent = `Choosing a career path is one of the most significant decisions you'll make in your life. In 2026, the landscape of work has shifted dramatically due to rapid technological advancements and changing economic priorities.

**The Psychometric Advantage**
At Mentoria, we believe that self-awareness is the foundation of any successful career. By using data-driven psychometric assessments, we help you uncover your innate strengths and interests.

**Key Steps to Finding Your Path:**
1. Self-Assessment: Understand your personality and aptitudes.
2. Market Research: Identify growing industries and future-proof roles.
3. Skill Mapping: Determine the gap between your current skills and your dream role.
4. Mentorship: Connect with professionals who can guide you.

Your journey to a fulfilling career starts with a single step. Let Career Compass be your guide to a brighter, more certain future.`;

async function main() {
    try {
        await client.patch('blog-1')
            .set({ content: blogContent })
            .commit();
        console.log("Blog content updated successfully!");
        
        // Update other potential blogs if needed
        const blogs = await client.fetch("*[_type == 'blog' && !defined(content)]");
        for (const blog of blogs) {
            await client.patch(blog._id)
                .set({ content: "Full blog content coming soon. Mentoria is working on bringing you the best career insights tailored to your needs." })
                .commit();
            console.log(`Updated placeholder for ${blog._id}`);
        }
    } catch (e) {
        console.error("Update failed: ", e.message);
    }
}

main();
