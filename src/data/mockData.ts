// Kenya Coffee Intelligence Platform - Mock Data

export const auctionData = [
  { date: "2024-01", gradeAA: 42500, gradeAB: 35200, gradePB: 31800, gradeC: 22100, volume: 12400 },
  { date: "2024-02", gradeAA: 43100, gradeAB: 35800, gradePB: 32200, gradeC: 22500, volume: 11800 },
  { date: "2024-03", gradeAA: 44200, gradeAB: 36500, gradePB: 33100, gradeC: 23200, volume: 13200 },
  { date: "2024-04", gradeAA: 43800, gradeAB: 36100, gradePB: 32600, gradeC: 22800, volume: 12900 },
  { date: "2024-05", gradeAA: 45100, gradeAB: 37200, gradePB: 33800, gradeC: 23600, volume: 14100 },
  { date: "2024-06", gradeAA: 46300, gradeAB: 38100, gradePB: 34500, gradeC: 24100, volume: 13600 },
  { date: "2024-07", gradeAA: 47200, gradeAB: 38900, gradePB: 35200, gradeC: 24800, volume: 15200 },
  { date: "2024-08", gradeAA: 46800, gradeAB: 38500, gradePB: 34800, gradeC: 24500, volume: 14800 },
  { date: "2024-09", gradeAA: 48100, gradeAB: 39600, gradePB: 35900, gradeC: 25200, volume: 16100 },
  { date: "2024-10", gradeAA: 49500, gradeAB: 40800, gradePB: 37100, gradeC: 26000, volume: 15600 },
  { date: "2024-11", gradeAA: 50200, gradeAB: 41500, gradePB: 37800, gradeC: 26500, volume: 16800 },
  { date: "2024-12", gradeAA: 51800, gradeAB: 42600, gradePB: 38900, gradeC: 27200, volume: 17200 },
];

export const forecastData = [
  { date: "2025-01", actual: null, predicted: 52400, lower: 50100, upper: 54700 },
  { date: "2025-02", actual: null, predicted: 53200, lower: 50800, upper: 55600 },
  { date: "2025-03", actual: null, predicted: 54800, lower: 52100, upper: 57500 },
  { date: "2025-04", actual: null, predicted: 53900, lower: 51200, upper: 56600 },
  { date: "2025-05", actual: null, predicted: 55600, lower: 52800, upper: 58400 },
  { date: "2025-06", actual: null, predicted: 57200, lower: 54100, upper: 60300 },
];

export const countyProduction = [
  { county: "Nyeri", production: 18500, forecast: 19200, change: 3.8, rainfall: 1200 },
  { county: "Kirinyaga", production: 15200, forecast: 16100, change: 5.9, rainfall: 1150 },
  { county: "Murang'a", production: 12800, forecast: 13400, change: 4.7, rainfall: 1080 },
  { county: "Kiambu", production: 11200, forecast: 11800, change: 5.4, rainfall: 980 },
  { county: "Embu", production: 9800, forecast: 10500, change: 7.1, rainfall: 1100 },
  { county: "Meru", production: 14500, forecast: 15300, change: 5.5, rainfall: 1180 },
  { county: "Machakos", production: 6200, forecast: 6500, change: 4.8, rainfall: 780 },
  { county: "Bungoma", production: 5800, forecast: 6100, change: 5.2, rainfall: 1350 },
];

export const weatherData = [
  { month: "Jan", rainfall: 45, temp: 22.5, humidity: 65 },
  { month: "Feb", rainfall: 38, temp: 23.1, humidity: 60 },
  { month: "Mar", rainfall: 120, temp: 22.8, humidity: 72 },
  { month: "Apr", rainfall: 280, temp: 21.5, humidity: 82 },
  { month: "May", rainfall: 180, temp: 20.8, humidity: 78 },
  { month: "Jun", rainfall: 42, temp: 19.5, humidity: 62 },
  { month: "Jul", rainfall: 28, temp: 18.8, humidity: 58 },
  { month: "Aug", rainfall: 35, temp: 19.2, humidity: 60 },
  { month: "Sep", rainfall: 48, temp: 20.5, humidity: 63 },
  { month: "Oct", rainfall: 150, temp: 21.2, humidity: 75 },
  { month: "Nov", rainfall: 220, temp: 21.8, humidity: 80 },
  { month: "Dec", rainfall: 95, temp: 22.2, humidity: 70 },
];

export const globalMarketData = [
  { date: "2024-01", arabica: 185.2, robusta: 98.5, kenyan: 245.8 },
  { date: "2024-02", arabica: 188.6, robusta: 101.2, kenyan: 248.3 },
  { date: "2024-03", arabica: 192.1, robusta: 103.8, kenyan: 255.1 },
  { date: "2024-04", arabica: 190.5, robusta: 102.1, kenyan: 252.6 },
  { date: "2024-05", arabica: 195.8, robusta: 105.6, kenyan: 260.2 },
  { date: "2024-06", arabica: 198.3, robusta: 108.2, kenyan: 265.8 },
  { date: "2024-07", arabica: 202.1, robusta: 110.5, kenyan: 272.3 },
  { date: "2024-08", arabica: 199.8, robusta: 109.1, kenyan: 268.5 },
  { date: "2024-09", arabica: 205.6, robusta: 112.8, kenyan: 278.1 },
  { date: "2024-10", arabica: 210.2, robusta: 115.3, kenyan: 285.6 },
  { date: "2024-11", arabica: 213.8, robusta: 117.9, kenyan: 290.2 },
  { date: "2024-12", arabica: 218.5, robusta: 120.6, kenyan: 298.8 },
];

export const aiInsights = [
  {
    id: 1,
    type: "bullish" as const,
    title: "Grade AA Price Surge Expected",
    description: "AI models predict a 12% increase in Grade AA prices over the next 30 days due to reduced supply from Nyeri county and increasing global demand.",
    confidence: 87,
    timeframe: "30 days",
  },
  {
    id: 2,
    type: "warning" as const,
    title: "Kirinyaga Drought Risk",
    description: "Weather models indicate below-average rainfall in Kirinyaga county for the next 60 days, potentially reducing Q2 2025 production by 8-12%.",
    confidence: 72,
    timeframe: "60 days",
  },
  {
    id: 3,
    type: "bullish" as const,
    title: "Export Demand Growth",
    description: "European specialty coffee import demand is forecast to grow 15% YoY, creating favorable conditions for Kenyan premium grades.",
    confidence: 81,
    timeframe: "90 days",
  },
  {
    id: 4,
    type: "neutral" as const,
    title: "Seasonal Production Cycle",
    description: "Main crop harvest expected to begin in October with normal yields. Early indicators suggest production within historical averages.",
    confidence: 90,
    timeframe: "6 months",
  },
  {
    id: 5,
    type: "bearish" as const,
    title: "Global Arabica Oversupply Risk",
    description: "Brazilian arabica production forecast exceeds expectations, which may put downward pressure on global prices affecting Kenyan exports.",
    confidence: 65,
    timeframe: "90 days",
  },
];

export const kpiData = {
  avgPrice: { value: 49850, change: 8.2, label: "Avg. Auction Price (KES/bag)" },
  totalProduction: { value: 94000, change: 5.1, label: "Total Production (MT)" },
  exportVolume: { value: 42500, change: 12.3, label: "Export Volume (MT)" },
  marketShare: { value: 2.8, change: -0.3, label: "Global Market Share (%)" },
};

export const demandTrends = [
  { month: "Jan", domestic: 4200, export: 8500 },
  { month: "Feb", domestic: 4100, export: 8200 },
  { month: "Mar", domestic: 4500, export: 9100 },
  { month: "Apr", domestic: 4300, export: 8800 },
  { month: "May", domestic: 4600, export: 9500 },
  { month: "Jun", domestic: 4800, export: 10200 },
  { month: "Jul", domestic: 5000, export: 10800 },
  { month: "Aug", domestic: 4900, export: 10500 },
  { month: "Sep", domestic: 5200, export: 11200 },
  { month: "Oct", domestic: 5400, export: 11800 },
  { month: "Nov", domestic: 5600, export: 12100 },
  { month: "Dec", domestic: 5800, export: 12500 },
];
