import { TargetMarket, CompanyType, TradeCountry, TradeChannel } from "./types";

export const translations = {
  en: {
    nav: {
      title: "HYH Data analysis",
      online: "Online Research",
      trade: "Trade Research",
      logistics: "Logistics Calculator",
      tiktok: "TikTok Discover",
      langName: "English"
    },
    online: {
      title: "Global Market Strategy",
      subtitle: "AI-powered strategic analysis for UK & US markets.",
      sectionCompany: "Core Identity",
      sectionStrategy: "Strategic Context",
      companyName: "Company Name",
      productName: "Product Name",
      targetMarket: "Target Market",
      companyType: "Business Model",
      website: "Website (Optional)",
      audience: "Target Audience",
      usps: "Key Selling Points (USPs)",
      price: "Target Price Range",
      images: "Product Images",
      upload: "Upload Image",
      start: "Analyze Market",
      analyzing: "Analyzing...",
      markets: {
        [TargetMarket.UK]: "United Kingdom",
        [TargetMarket.US]: "United States",
      },
      types: {
        [CompanyType.MANUFACTURER]: "Manufacturer",
        [CompanyType.TRADER]: "Trader",
        [CompanyType.AGENT]: "Agent",
      }
    },
    results: {
      title: "Market Analysis Results",
      summary: "Executive Summary",
      sentiment: "Consumer Sentiment",
      pricing: "Pricing Strategy",
      channels: "Marketing Channels",
      action: "Action Plan",
      competitors: "Top Competitors",
      swot: "SWOT Analysis",
      trends: "Market Trends (5 Years)",
      shares: "Est. Market Share",
      visit: "Visit"
    },
    // ... Keep existing translations for other modules ...
    trade: {
      title: "Offline Trade Research",
      subtitle: "Evaluate physical market potential and find buyers.",
      tabs: { evaluation: "Evaluation", buyers: "Buyer Match", canton: "Canton Fair" },
      country: "Country", niche: "Niche/Product", analyze: "Analyze", analyzing: "Analyzing...",
      verdict: "Score", match: "Match", demand: "Demand", maturity: "Maturity",
      legend1: "Low", legend2: "Medium", legend3: "High",
      statusLow: "Not Recommended", statusMid: "Neutral", statusHigh: "Recommended",
      countries: { [TradeCountry.UK]: "UK", [TradeCountry.US]: "USA", [TradeCountry.DE]: "Germany", [TradeCountry.IT]: "Italy", [TradeCountry.FR]: "France", [TradeCountry.ES]: "Spain" },
      buyer: {
        title: "Find Buyers", subtitle: "Connect with retailers.", channel: "Channel", size: "Size", distChannels: "Distribution",
        distChannelsPlaceholder: "e.g. Online", sizes: { 'Small': "Small", 'Medium': "Medium", 'Large': "Large", 'Any': "Any" },
        channels: { [TradeChannel.SUPERMARKET]: "Supermarket", [TradeChannel.RETAIL_STORE]: "Retail", [TradeChannel.HYPERMARKET]: "Hypermarket", [TradeChannel.VENDING_MACHINE]: "Vending" },
        find: "Find", finding: "Searching...", resultsTitle: "Buyers", colName: "Name", colType: "Type", colDesc: "Desc", noBuyers: "No buyers found."
      },
      canton: { title: "Canton Fair DB", subtitle: "Search 2023-2024 data.", year: "Year", search: "Search", searching: "Searching...", results: "Results", colBuyer: "Buyer", colCountry: "Country", colProduct: "Product", colContact: "Contact", colSession: "Session", noData: "No data." }
    },
    logistics: { title: "Logistics", subtitle: "Sea/Air Estimator", dimensions: "Dimensions", targetMarket: "Market", weight: "Weight", units: "Units/CBM", optional: "(Opt)", unitsDesc: "", calculate: "Calculate", ready: "Ready", readyDesc: "Enter dims", analyzing: "Calculating...", analyzingDesc: "", sea: "Sea", air: "Air", costCbm: "Cost/CBM", costUnit: "Cost/Unit", costKg: "Cost/KG", advice: "Advice", warehouse: "Warehouses" },
    tiktok: { title: "TikTok", subtitle: "Search & Discover", brandSearch: "Brand Search", brandLabel: "Brand", brandPlaceholder: "Brand Name", brandDesc: "Find videos", noResults: "No results", searchedFor: "Searched:", tips: "Tips:", tip1: "Spelling", tip2: "Spaces", tip3: "Suffixes", creatorFinder: "Creator Finder", filter: "Filter", topic: "Topic", topicPlaceholder: "Niche", avgViews: "Views", followers: "Followers", discover: "Discover", noCreators: "No creators." },
    report: { addToReport: "Add", added: "Added", builderTitle: "Cart", empty: "Empty", generate: "Generate PPT", items: "Items", remove: "Remove", commentPlaceholder: "Note...", type: { "chart-line": "Trend", "chart-bar": "Share", "swot": "SWOT", "text": "Text" } }
  },
  zh: {
    nav: {
      title: "鸿亿鸿客户数据分析",
      online: "线上市场研究",
      trade: "线下贸易研究",
      logistics: "物流计算器",
      tiktok: "TikTok 探索",
      langName: "中文"
    },
    online: {
      title: "全球市场战略分析",
      subtitle: "基于 AI 的全方位出海产品调研与策略制定。",
      sectionCompany: "核心信息",
      sectionStrategy: "战略定位",
      companyName: "公司名称",
      productName: "产品名称",
      targetMarket: "目标市场",
      companyType: "企业类型",
      website: "公司官网 (选填)",
      audience: "目标受众",
      usps: "核心卖点 (USP)",
      price: "目标价格带",
      images: "产品图片",
      upload: "上传图片",
      start: "开始深度分析",
      analyzing: "正在生成策略报告...",
      markets: {
        [TargetMarket.UK]: "英国",
        [TargetMarket.US]: "美国",
      },
      types: {
        [CompanyType.MANUFACTURER]: "制造商",
        [CompanyType.TRADER]: "贸易商",
        [CompanyType.AGENT]: "代理商",
      }
    },
    results: {
      title: "市场分析报告",
      summary: "执行摘要",
      sentiment: "消费者舆情",
      pricing: "定价策略建议",
      channels: "营销渠道推荐",
      action: "行动计划",
      competitors: "核心竞争对手",
      swot: "SWOT 分析",
      trends: "5年市场趋势",
      shares: "预估市场份额",
      visit: "访问"
    },
    // ... Keep existing translations for other modules ...
    trade: {
      title: "线下贸易研究", subtitle: "评估线下潜力并匹配买家。",
      tabs: { evaluation: "市场评估", buyers: "采购商匹配", canton: "广交会数据" },
      country: "目标国家", niche: "利基/产品", analyze: "分析", analyzing: "分析中...",
      verdict: "评分", match: "匹配度", demand: "需求度", maturity: "成熟度",
      legend1: "低", legend2: "中", legend3: "高",
      statusLow: "不推荐", statusMid: "一般", statusHigh: "推荐",
      countries: { [TradeCountry.UK]: "英国", [TradeCountry.US]: "美国", [TradeCountry.DE]: "德国", [TradeCountry.IT]: "意大利", [TradeCountry.FR]: "法国", [TradeCountry.ES]: "西班牙" },
      buyer: {
        title: "寻找采购商", subtitle: "匹配零售商资源。", channel: "渠道", size: "规模", distChannels: "现有渠道",
        distChannelsPlaceholder: "如：线上", sizes: { 'Small': "小型", 'Medium': "中型", 'Large': "大型", 'Any': "不限" },
        channels: { [TradeChannel.SUPERMARKET]: "超市", [TradeChannel.RETAIL_STORE]: "零售店", [TradeChannel.HYPERMARKET]: "大卖场", [TradeChannel.VENDING_MACHINE]: "售货机" },
        find: "匹配", finding: "搜索中...", resultsTitle: "买家列表", colName: "名称", colType: "类型", colDesc: "简介", noBuyers: "未找到。"
      },
      canton: { title: "广交会数据", subtitle: "查询23-24年数据。", year: "年份", search: "搜索", searching: "查询中...", results: "结果", colBuyer: "采购商", colCountry: "国家", colProduct: "产品", colContact: "联系", colSession: "届数", noData: "无数据。" }
    },
    logistics: { title: "物流计算器", subtitle: "海空运费估算", dimensions: "尺寸", targetMarket: "市场", weight: "重量", units: "装箱数", optional: "(选填)", unitsDesc: "", calculate: "计算", ready: "准备就绪", readyDesc: "输入尺寸", analyzing: "计算中...", analyzingDesc: "", sea: "海运", air: "空运", costCbm: "费用/CBM", costUnit: "费用/单件", costKg: "费用/KG", advice: "建议", warehouse: "海外仓" },
    tiktok: { title: "TikTok", subtitle: "搜索与发现", brandSearch: "品牌搜索", brandLabel: "品牌", brandPlaceholder: "品牌名", brandDesc: "查找视频", noResults: "无结果", searchedFor: "搜索词:", tips: "提示:", tip1: "拼写", tip2: "空格", tip3: "后缀", creatorFinder: "达人搜索", filter: "筛选", topic: "话题", topicPlaceholder: "类目", avgViews: "播放量", followers: "粉丝", discover: "发现", noCreators: "无结果。" },
    report: { addToReport: "添加", added: "已添加", builderTitle: "购物车", empty: "空", generate: "生成 PPT", items: "项", remove: "删除", commentPlaceholder: "备注...", type: { "chart-line": "趋势", "chart-bar": "份额", "swot": "SWOT", "text": "文本" } }
  },
};
