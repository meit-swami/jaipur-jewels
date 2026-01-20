import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function generateProductDescription(
  productName: string,
  category: string,
  price: number,
  existingDetails?: string
): Promise<{ description: string; tags: string[] }> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback description if no API key
      return {
        description: `Experience the timeless elegance of this exquisite ${productName}. Handcrafted with meticulous attention to detail, this piece embodies luxury and sophistication. Perfect for those who appreciate fine craftsmanship and enduring beauty.`,
        tags: [category, "luxury", "handcrafted", "premium"],
      };
    }

    const prompt = `You are a luxury jewellery copywriter. Create a premium, elegant product description for a piece of jewellery.

Product Name: ${productName}
Category: ${category}
Price: $${price.toLocaleString()}
${existingDetails ? `Additional Details: ${existingDetails}` : ""}

Write a compelling, luxurious description (150-200 words) that:
- Emphasizes elegance, sophistication, and craftsmanship
- Uses evocative, premium language
- Highlights the piece's unique qualities
- Appeals to luxury buyers
- Avoids clichés but maintains a luxurious tone

Also generate 5-8 relevant tags (single words or short phrases) as a JSON array.

Return ONLY valid JSON in this format:
{
  "description": "...",
  "tags": ["tag1", "tag2", ...]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert luxury jewellery copywriter. Always return valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "";
    const parsed = JSON.parse(content);

    return {
      description: parsed.description || "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch (error) {
    console.error("Error generating AI description:", error);
    // Fallback description
    return {
      description: `Experience the timeless elegance of this exquisite ${productName}. Handcrafted with meticulous attention to detail, this piece embodies luxury and sophistication. Perfect for those who appreciate fine craftsmanship and enduring beauty.`,
      tags: [category, "luxury", "handcrafted", "premium"],
    };
  }
}
