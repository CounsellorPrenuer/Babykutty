import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface BlogGenerationParams {
  topic: string;
  keywords?: string;
  tone: string;
  length: string;
}

interface GeneratedBlog {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
}

export async function generateBlogPost(params: BlogGenerationParams): Promise<GeneratedBlog> {
  const { topic, keywords, tone, length } = params;
  
  const wordCount = length === "short" ? "800-1000" : length === "medium" ? "1500-2000" : "2500-3000";
  const keywordsText = keywords ? `\nKeywords to include: ${keywords}` : "";
  
  const prompt = `You are an expert career counseling blog writer. Generate a professional, engaging blog post on the following topic:

Topic: ${topic}${keywordsText}
Tone: ${tone}
Length: ${wordCount} words

Please provide the output in JSON format with the following structure:
{
  "title": "An engaging, SEO-friendly title (60-70 characters)",
  "excerpt": "A compelling 2-3 sentence summary that hooks the reader (150-160 characters)",
  "content": "The full blog post content in HTML format with proper headings (h2, h3), paragraphs, bold text for emphasis, and bullet points or numbered lists where appropriate. Make it engaging, informative, and valuable for readers seeking career guidance.",
  "category": "One of: Career Tips, Student Guide, Professional Development, Career Change",
  "readTime": "Estimated read time (e.g., '5 min read', '8 min read')"
}

Make the content professional, actionable, and specific to career counseling. Include practical tips, real-world examples, and actionable advice.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor and professional blog writer specializing in career guidance, educational planning, and professional development. You write engaging, informative content that helps people navigate their career journeys."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || "Untitled Blog Post",
      excerpt: result.excerpt || "No excerpt available",
      content: result.content || "<p>No content available</p>",
      category: result.category || "Career Tips",
      readTime: result.readTime || "5 min read",
    };
  } catch (error: any) {
    throw new Error(`Failed to generate blog post: ${error.message}`);
  }
}

export async function improveBlogContent(content: string): Promise<string> {
  const prompt = `You are an expert editor specializing in career counseling content. Improve the following blog post content while maintaining its core message and structure. Make it more engaging, professional, and valuable for readers.

Current content:
${content}

Please provide the improved content in HTML format with proper headings (h2, h3), paragraphs, bold text for emphasis, and bullet points or numbered lists where appropriate. Keep the improvements subtle but impactful.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert content editor specializing in career counseling and professional development content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 8192,
    });

    return response.choices[0].message.content || content;
  } catch (error: any) {
    throw new Error(`Failed to improve content: ${error.message}`);
  }
}
