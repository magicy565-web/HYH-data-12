import { GoogleGenAI, Part } from "@google/genai";
import { FormData, ResearchResult, LogisticsFormData, LogisticsResult, TikTokShopLink, TikTokCreator, TikTokDiscoveryFilters, TradeCountry, TradeResearchResult, TradeChannel, Buyer, Language, CantonFairData, BuyerSize } from "../types";

// Helper to ensure API Key exists and log debug info
const getAiClient = () => {
  // 1. Safe access to process.env (prevents ReferenceError in browser)
  const safeProcess = typeof process !== 'undefined' ? process : { env: {} as any };
  
  // 2. Prioritize Vite standard import.meta.env, fallback to process.env
  // We use 'as any' to avoid TypeScript complaining if types aren't perfectly set up
  const viteKey = (import.meta as any).env?.VITE_API_KEY;
  const processKey = safeProcess.env?.API_KEY;
  
  const apiKey = viteKey || processKey;
  
  if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
    console.error("[Gemini Service] CRITICAL ERROR: API Key is missing or invalid.");
    console.log("Debug Info - Vite Key Exists:", !!viteKey);
    console.log("Debug Info - Process Key Exists:", !!processKey);
    throw new Error("API Key is missing. Please check your Vercel Environment Variables (VITE_API_KEY).");
  }
  
  return new GoogleGenAI({ apiKey: apiKey as string });
};

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeMarket = async (formData: FormData, lang: Language): Promise<ResearchResult> => {
  const ai = getAiClient();

  const imageParts: Part[] = await Promise.all(
    formData.images.map(async (file) => {
      const base64Data = await convertFileToBase64(file);
      return {
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      };
    })
  );

  const langInstruction = lang === 'zh' 
    ? "IMPORTANT: The content of the JSON values (marketSummary, trendAnalysis, swot, competitor features, etc.) MUST be in Simplified Chinese." 
    : "The content MUST be in English.";

  const promptText = `
    Act as a Senior Market Research Analyst specializing in the ${formData.market} market.
    
    My Company: ${formData.companyName} (${formData.companyType})
    ${formData.companyWebsite ? `Website: ${formData.companyWebsite}` : ''}
    Product: ${formData.productName}
    
    Task:
    1. Analyze the attached product images and the product details.
    2. Use Google Search to find the TOP 5 real competing products currently listed on Google Shopping or major e-commerce sites in the ${formData.market}. Focus on products that look visually similar or serve the same function.
    3. Analyze the market trends for this product category over the last 5 years (2020-2024) and project 2025.
    4. Perform a SWOT analysis for launching my product in this market.
    5. Estimate the market share of the top 5 competitors found.

    Output Requirement:
    You MUST return a valid JSON object wrapped in \`\`\`json code blocks. 
    ${langInstruction}
    
    The structure must strictly match this schema:

    {
      "marketSummary": "A comprehensive paragraph summarizing the 5-year market changes, potential opportunities, and the general landscape.",
      "fiveYearTrendAnalysis": "Detailed text explaining the specific trends observed in the graph.",
      "swot": {
        "strengths": ["point 1", "point 2"],
        "weaknesses": ["point 1", "point 2"],
        "opportunities": ["point 1", "point 2"],
        "threats": ["point 1", "point 2"]
      },
      "competitors": [
        { "name": "Product Name - Brand", "features": "Key features summary", "price": "Price found", "website": "Link URL found via search" }
      ],
      "chartData": {
        "trends": [
          { "year": "2020", "marketSize": 45 },
          { "year": "2021", "marketSize": 50 },
          { "year": "2022", "marketSize": 55 },
          { "year": "2023", "marketSize": 60 },
          { "year": "2024", "marketSize": 75 },
          { "year": "2025", "marketSize": 85 }
        ],
        "shares": [
          { "name": "Competitor A", "share": 30 },
          { "name": "Competitor B", "share": 25 },
          { "name": "Competitor C", "share": 20 },
          { "name": "Competitor D", "share": 15 },
          { "name": "Others", "share": 10 }
        ]
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          ...imageParts,
          { text: promptText }
        ]
      },
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    let parsedData: any;

    if (jsonMatch && jsonMatch[1]) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      try {
        parsedData = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON response", e);
        throw new Error("The analysis failed to produce structured data. Please try again with a clear image.");
      }
    }

    const rawSearchLinks: string[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
        chunks.forEach((chunk: any) => {
            if (chunk.web?.uri) rawSearchLinks.push(chunk.web.uri);
        });
    }

    // Return safe structure
    return {
      marketSummary: parsedData.marketSummary || "",
      fiveYearTrendAnalysis: parsedData.fiveYearTrendAnalysis || "",
      swot: parsedData.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      competitors: parsedData.competitors || [],
      chartData: parsedData.chartData || { trends: [], shares: [] },
      rawSearchLinks
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const calculateLogistics = async (data: LogisticsFormData, lang: Language): Promise<LogisticsResult> => {
    const ai = getAiClient();
    const langInstruction = lang === 'zh' ? "Respond in Simplified Chinese. (Currency can remain in USD)." : "Respond in English.";
    const promptText = `
      Act as a Logistics Expert for international trade.
      Product Dimensions: Length ${data.length}cm, Width ${data.width}cm, Height ${data.height}cm.
      ${data.weight ? `Product Weight: ${data.weight}kg.` : ''}
      ${data.unitsPerCbm ? `Units per CBM: ${data.unitsPerCbm}.` : ''}
      Target Market: ${data.market}.
      Origin: Assume shipment from a major port in China (e.g., Shenzhen/Shanghai) to ${data.market}.
      Task:
      1. Calculate the Volumetric Weight.
      2. Estimate current SEA FREIGHT costs (LCL). Provide a cost range per CBM and an estimated cost per unit.
      3. Estimate current AIR FREIGHT costs. Provide a cost range per KG and an estimated cost per unit.
      4. Provide professional logistics advice for this product type (e.g. packaging tips to save volume, incoterms advice).
      5. Use Google Search to recommend 1-2 popular and reputable Overseas Warehouses (3PL) in ${data.market} (names only).
      Output Requirement:
      You MUST return a valid JSON object wrapped in \`\`\`json code blocks.
      ${langInstruction}
      Structure:
      {
        "seaFreightCost": { "perCbm": "$X - $Y USD", "perUnit": "$A - $B USD" },
        "airFreightCost": { "perKg": "$X - $Y USD", "perUnit": "$A - $B USD" },
        "advice": "Your logistics strategy advice here...",
        "warehouses": ["Warehouse Name 1", "Warehouse Name 2"]
      }
    `;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: promptText }] },
        config: { tools: [{ googleSearch: {} }] }
      });
      const text = response.text || "";
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) return JSON.parse(jsonMatch[1]);
      else try { return JSON.parse(text); } catch (e) { throw new Error("Failed to generate logistics calculation."); }
    } catch (error) {
      console.error("Gemini Logistics API Error:", error);
      throw error;
    }
};

export const searchTikTokShop = async (shopName: string): Promise<TikTokShopLink[]> => {
  const ai = getAiClient();
  const promptText = `Act as a Social Media Researcher. Target: Find TikTok content for the brand or shop "${shopName}". Instructions: 1. Search Google using: site:tiktok.com ${shopName} 2. Return TikTok URLs.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: promptText }] },
      config: { tools: [{ googleSearch: {} }] }
    });
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const links: TikTokShopLink[] = [];
    if (chunks) chunks.forEach((chunk: any) => { if (chunk.web?.uri && chunk.web.uri.toLowerCase().includes('tiktok.com')) links.push({ title: chunk.web.title || "TikTok Result", url: chunk.web.uri }); });
    const uniqueLinks = Array.from(new Map(links.map(item => [item.url, item])).values());
    return uniqueLinks.slice(0, 20); 
  } catch (error) { console.error("TikTok Search API Error:", error); throw error; }
};

export const discoverTikTokCreators = async (filters: TikTokDiscoveryFilters, lang: Language): Promise<TikTokCreator[]> => {
  const ai = getAiClient();
  const langInstruction = lang === 'zh' ? "Respond in Simplified Chinese (except for handle)." : "Respond in English.";
  const promptText = `Act as a Social Media Scout. Find 5-10 TikTok creators in "${filters.topic}" niche. Criteria: Views ${filters.views}, Followers ${filters.followers}. Output JSON: [{ "handle": "@username", "name": "Creator Name", "followers": "12.5K", "avgViews": "20K", "description": "desc" }] ${langInstruction}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: promptText }] },
      config: { tools: [{ googleSearch: {} }] }
    });
    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) return JSON.parse(jsonMatch[1]);
    else try { return JSON.parse(text); } catch(e) { return []; }
  } catch (error) { console.error("TikTok Discover API Error:", error); throw error; }
};

export const analyzeTradeMarket = async (country: TradeCountry, niche: string, lang: Language): Promise<TradeResearchResult> => {
  const ai = getAiClient();
  const langInstruction = lang === 'zh' ? "Respond in Simplified Chinese." : "Respond in English.";
  const promptText = `Act as an International Trade Consultant. Target: ${country}, Niche: "${niche}". Evaluate OFFLINE market. Scores 1-10: Match, Demand, Development. Output JSON: { "matchScore": 5, "demandScore": 5, "developmentScore": 5, "reasoning": "..." } ${langInstruction}`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [{ text: promptText }] } });
    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    let result: any;
    if (jsonMatch && jsonMatch[1]) result = JSON.parse(jsonMatch[1]);
    else try { result = JSON.parse(text); } catch(e) { throw new Error("Failed to analyze trade market."); }
    const average = (result.matchScore + result.demandScore + result.developmentScore) / 3;
    return { ...result, averageScore: parseFloat(average.toFixed(1)) };
  } catch (error) { console.error("Trade Research API Error:", error); throw error; }
};

export const findTradeBuyers = async (country: TradeCountry, channel: TradeChannel, niche: string, size: BuyerSize, distChannels: string, lang: Language): Promise<Buyer[]> => {
  const ai = getAiClient();
  const langInstruction = lang === 'zh' ? "Respond in Simplified Chinese." : "Respond in English.";
  const promptText = `Act as B2B Sales Director. Country: ${country}, Channel: ${channel}, Product: "${niche}", Size: ${size}, Dist: ${distChannels}. Find 5-10 buyers. Output JSON: [{ "name": "Co Name", "type": "Type", "description": "Desc", "website": "URL" }] ${langInstruction}`;
  try {
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [{ text: promptText }] }, config: { tools: [{ googleSearch: {} }] } });
    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) return JSON.parse(jsonMatch[1]);
    else try { return JSON.parse(text); } catch(e) { return []; }
  } catch (error) { console.error("Find Trade Buyers API Error:", error); throw error; }
};

export const searchCantonFairDatabase = async (country: string, product: string, year: string): Promise<CantonFairData[]> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  const mockData: CantonFairData[] = [
    { id: 1, buyerName: `Global ${product} Imports Ltd`, country: country, products: `${product}, General`, contactInfo: "purchasing@global.example.com", sessionDate: `${year} Spring` },
    { id: 2, buyerName: `Retail Group ${country}`, country: country, products: `Home, ${product}`, contactInfo: "info@retail.example.com", sessionDate: `${year} Autumn` }
  ];
  return mockData;
};
