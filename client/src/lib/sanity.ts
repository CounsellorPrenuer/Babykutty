import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    projectId: "xwphlsr2",
    dataset: "production",
    useCdn: false, // Set to false for real-time updates
    apiVersion: "2024-03-04",
    token: "sknwdzZnkyfRqIjwSofszsDGxAOaME66GQvzMcfUYX3gWOVzLLcbGF9R66nNZEBUcorSjSbcYKc3O0ti6C4rIpqEn359jl9CAvWg54fclnTA7POjmM0BJLvK8kvS6CFFnq3UfYkIriAgvNFd9IzLHdZKy7wvgZ5Ej3C7Z5cpA0sSr0ddX3x7",
});
