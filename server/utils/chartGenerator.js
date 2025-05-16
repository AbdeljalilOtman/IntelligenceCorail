/**
 * Generate chart data from price comparison data
 * @param {Array} data - Price comparison data
 * @returns {Object} - Structured chart data for frontend
 */
export function generateCharts(data) {
  return {
    retailerData: generateRetailerChartData(data),
    productData: generateProductChartData(data),
    trendData: generateTrendChartData(data)
  };
}

/**
 * Generate data for retailer comparison chart
 * @param {Array} data - Price comparison data 
 * @returns {Object} - Chart data for retailer comparison
 */
function generateRetailerChartData(data) {
  // Group by retailer and calculate average prices
  const retailerPrices = {};
  
  data.forEach(item => {
    if (!retailerPrices[item.retailer]) {
      retailerPrices[item.retailer] = { total: 0, count: 0 };
    }
    retailerPrices[item.retailer].total += item.averagePrice;
    retailerPrices[item.retailer].count++;
  });
  
  // Calculate averages and prepare chart data
  const labels = [];
  const prices = [];
  
  Object.entries(retailerPrices).forEach(([retailer, stats]) => {
    labels.push(retailer);
    prices.push((stats.total / stats.count).toFixed(2));
  });
  
  return { labels, prices };
}

/**
 * Generate data for product price distribution chart
 * @param {Array} data - Price comparison data
 * @returns {Array} - Chart data for product distribution
 */
function generateProductChartData(data) {
  // Group by category
  const categories = {};
  
  data.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    
    categories[item.category].push({
      x: item.averagePrice,
      y: parseFloat(item.priceDifference.replace('%', ''))
    });
  });
  
  // Prepare scatter plot data
  return Object.entries(categories).map(([category, prices]) => ({
    label: category,
    data: prices
  }));
}

/**
 * Generate data for price trend chart
 * @param {Array} data - Price comparison data
 * @returns {Object} - Chart data for trends
 */
function generateTrendChartData(data) {
  // Get unique retailers and categories
  const retailers = [...new Set(data.map(item => item.retailer))];
  const categories = [...new Set(data.map(item => item.category))];
  
  // Create synthetic trend data (in a real app, this would use historical data)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Generate dataset for each retailer
  const datasets = retailers.map((retailer, index) => {
    const retailerData = data.filter(item => item.retailer === retailer);
    const avgPrice = retailerData.reduce((sum, item) => sum + item.averagePrice, 0) / retailerData.length;
    
    // Create synthetic price trend with some variation
    const trendData = months.map((_, i) => {
      // Add some variation to create synthetic trends
      const variation = Math.sin(i / 2) * (0.05 + Math.random() * 0.03);
      return (avgPrice * (1 + variation)).toFixed(2);
    });
    
    return {
      label: retailer,
      data: trendData
    };
  });
  
  return {
    labels: months,
    datasets
  };
}
