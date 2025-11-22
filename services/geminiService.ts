
import { GoogleGenAI, Part } from "@google/genai";
import { FormData, ResearchResult, LogisticsFormData, LogisticsResult, TikTokShopLink, TikTokCreator, TikTokDiscoveryFilters, TradeCountry, TradeResearchResult, TradeChannel, Buyer, Language, CantonFairData } from "../types";

// Helper to ensure API Key exists and log debug info
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey.length < 10) {
    console.error("[Gemini Service] CRITICAL ERROR: API Key is missing or invalid.");
    console.error("[Gemini Service] Current Key Value:", apiKey ? "Present (Hidden)" : "Undefined/Null");
    // Throwing a user-friendly error that will be caught by the UI
    throw new Error("API Key is missing. Please check your application configuration.");
  }
  
  return new GoogleGenAI({ apiKey });
};

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeMarket = async (formData: FormData, lang: Language): Promise<ResearchResult> => {
  const ai = getAiClient();

  // Prepare image parts
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
      model: 'gemini-2.5-flash', // Using flash for speed and grounding capability
      contents: {
        parts: [
          ...imageParts,
          { text: promptText }
        ]
      },
      config: {
        tools: [{ googleSearch: {} }], // Enable Grounding
      }
    });

    const text = response.text || "";
    
    // Extract JSON from code blocks if present
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    let parsedData: any;

    if (jsonMatch && jsonMatch[1]) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      // Attempt to parse the raw text if it looks like JSON
      try {
        parsedData = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON response", e);
        throw new Error("The analysis failed to produce structured data. Please try again with a clear image.");
      }
    }

    // Extract Grounding Metadata Links if available
    const rawSearchLinks: string[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
        chunks.forEach((chunk: any) => {
            if (chunk.web?.uri) rawSearchLinks.push(chunk.web.uri);
        });
    }

    return {
      ...parsedData,
      rawSearchLinks
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const calculateLogistics = async (data: LogisticsFormData, lang: Language): Promise<LogisticsResult> => {
    const ai = getAiClient();
  
    const langInstruction = lang === 'zh' 
      ? "Respond in Simplified Chinese. (Currency can remain in USD)." 
      : "Respond in English.";

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
        contents: {
          parts: [{ text: promptText }]
        },
        config: {
          tools: [{ googleSearch: {} }], // Enable Grounding to find warehouses
        }
      });
  
      const text = response.text || "";
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      } else {
        // Fallback: try to parse raw text if clean
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse Logistics JSON", e);
           throw new Error("Failed to generate logistics calculation.");
        }
      }
    } catch (error) {
      console.error("Gemini Logistics API Error:", error);
      throw error;
    }
};

export const searchTikTokShop = async (shopName: string): Promise<TikTokShopLink[]> => {
  const ai = getAiClient();

  const promptText = `
    Act as a Social Media Researcher.
    
    Target: Find TikTok content for the brand or shop "${shopName}".

    Instructions:
    1. Perform a Google Search using the STRICT query: site:tiktok.com ${shopName}
    2. This is required to filter out official websites and only see TikTok pages.
    3. Look for the official account (e.g. @${shopName.replace(/\s/g, '')}) and popular videos.
    
    Return the list of TikTok URLs found.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: promptText }] },
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const links: TikTokShopLink[] = [];

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          if (chunk.web.uri.toLowerCase().includes('tiktok.com')) {
              links.push({
                title: chunk.web.title || "TikTok Result",
                url: chunk.web.uri
              });
          }
        }
      });
    }

    const uniqueLinks = Array.from(new Map(links.map(item => [item.url, item])).values());

    const sortedLinks = uniqueLinks.sort((a, b) => {
        const aIsProfile = a.url.includes('/@') && !a.url.includes('/video/');
        const bIsProfile = b.url.includes('/@') && !b.url.includes('/video/');
        
        if (aIsProfile && !bIsProfile) return -1;
        if (!aIsProfile && bIsProfile) return 1;
        return 0;
    });

    return sortedLinks.slice(0, 20); 

  } catch (error) {
    console.error("TikTok Search API Error:", error);
    throw error;
  }
};

export const discoverTikTokCreators = async (filters: TikTokDiscoveryFilters, lang: Language): Promise<TikTokCreator[]> => {
  const ai = getAiClient();

  const langInstruction = lang === 'zh' 
  ? "Respond in Simplified Chinese (except for handle)." 
  : "Respond in English.";

  const promptText = `
    Act as a Social Media Scout.
    
    Find 5-10 TikTok creators/influencers in the "${filters.topic}" niche/category.
    
    They must match these criteria:
    - Average Video Views: ${filters.views}
    - Follower Count: ${filters.followers}

    Use Google Search to verify they exist and fit the description.
    
    Output Requirement:
    Return a JSON object wrapped in \`\`\`json code blocks.
    ${langInstruction}

    Structure:
    [
      { "handle": "@username", "name": "Creator Name", "followers": "e.g. 12.5K", "avgViews": "e.g. 20K", "description": "Short description of their content" }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: promptText }] },
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    } else {
        try {
            return JSON.parse(text);
        } catch(e) {
             return [];
        }
    }

  } catch (error) {
    console.error("TikTok Discover API Error:", error);
    throw error;
  }
};

export const analyzeTradeMarket = async (country: TradeCountry, niche: string, lang: Language): Promise<TradeResearchResult> => {
  const ai = getAiClient();

  const langInstruction = lang === 'zh' 
    ? "Respond in Simplified Chinese." 
    : "Respond in English.";

  const promptText = `
    Act as an International Trade Consultant specializing in offline/physical retail markets.

    Target Market: ${country}
    Niche/Product Category: "${niche}"

    Task:
    Evaluate the potential of this niche in the OFFLINE (Brick and Mortar) market of the target country.
    Provide scores from 1 to 10 for the following metrics:
    1. Offline Market Match (How well does this product fit physical retail in this country?)
    2. Offline Market Demand (How high is the consumer demand in physical stores?)
    3. Offline Market Development/Maturity (How developed is the supply chain/retail infrastructure for this niche? 10 = Highly developed/Easy to enter, 1 = Underdeveloped/Difficult).

    Output Requirement:
    Return a JSON object wrapped in \`\`\`json code blocks.
    ${langInstruction}

    Structure:
    {
      "matchScore": number (1-10),
      "demandScore": number (1-10),
      "developmentScore": number (1-10),
      "reasoning": "A brief explanation (max 50 words) of why these scores were given."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: promptText }] },
    });

    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    
    let result: any;
    if (jsonMatch && jsonMatch[1]) {
       result = JSON.parse(jsonMatch[1]);
    } else {
       try {
         result = JSON.parse(text);
       } catch(e) {
         console.error("Parsing failed, using default", e);
         throw new Error("Failed to analyze trade market.");
       }
    }

    // Calculate average
    const average = (result.matchScore + result.demandScore + result.developmentScore) / 3;

    return {
        ...result,
        averageScore: parseFloat(average.toFixed(1))
    };

  } catch (error) {
    console.error("Trade Research API Error:", error);
    throw error;
  }
};

export const findTradeBuyers = async (country: TradeCountry, channel: TradeChannel, niche: string, lang: Language): Promise<Buyer[]> => {
  const ai = getAiClient();

  const langInstruction = lang === 'zh' 
    ? "Respond in Simplified Chinese." 
    : "Respond in English.";

  const promptText = `
    Act as a B2B Sales Director.
    
    Target Country: ${country}
    Target Channel: ${channel}
    Product Category: "${niche}"

    Task:
    Find 5-10 specific potential buyers, retailers, or distributor companies in ${country} that operate in the ${channel} sector and would likely stock ${niche}.
    
    Instructions:
    1. Use Google Search to find REAL existing companies.
    2. Focus on major chains or prominent players in that specific channel.
    3. For example, if channel is 'Supermarket' in 'UK', look for Tesco, Sainsbury's, etc. if relevant to the product.
    4. If channel is 'Vending Machine', look for vending machine operators or distributors.

    Output Requirement:
    Return a JSON object wrapped in \`\`\`json code blocks.
    ${langInstruction}
    
    Structure:
    [
      { 
        "name": "Company Name", 
        "type": "e.g. Supermarket Chain / Distributor", 
        "description": "Brief description of who they are and why they are a match.",
        "website": "Website URL if found"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: promptText }] },
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    } else {
       try {
         return JSON.parse(text);
       } catch(e) {
         return [];
       }
    }

  } catch (error) {
    console.error("Find Trade Buyers API Error:", error);
    throw error;
  }
};

export const searchCantonFairDatabase = async (country: string, product: string, year: string): Promise<CantonFairData[]> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const mockData: CantonFairData[] = [
    {
      id: 1,
      buyerName: `Global ${product} Imports Ltd`,
      country: country === 'United Kingdom' ? 'United Kingdom' : 'United States',
      products: `${product}, General Merchandise`,
      contactInfo: "purchasing@globalimports.example.com",
      sessionDate: `${year} Spring`
    },
    {
      id: 2,
      buyerName: `${country === 'United Kingdom' ? 'London' : 'New York'} Retail Group`,
      country: country === 'United Kingdom' ? 'United Kingdom' : 'United States',
      products: `Home Goods, ${product}`,
      contactInfo: "info@retailgroup.example.com",
      sessionDate: `${year} Autumn`
    },
    {
      id: 3,
      buyerName: "Apex Sourcing Solutions",
      country: country === 'United Kingdom' ? 'United Kingdom' : 'United States',
      products: `${product}, Electronics`,
      contactInfo: "agents@apexsourcing.example.com",
      sessionDate: `${year} Spring`
    },
    {
        id: 4,
        buyerName: "Direct Trade Partners",
        country: country === 'United Kingdom' ? 'United Kingdom' : 'United States',
        products: `Textiles, ${product}`,
        contactInfo: "contact@directtrade.example.com",
        sessionDate: `${year} Autumn`
    }
  ];

  return mockData;
}
