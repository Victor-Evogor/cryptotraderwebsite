export function formatPrice(price: number): (string[] | string) {
    if (price >= 0.01) return price.toFixed(6);
    
    // Convert exponential notation to full decimal string
    const priceStr = price.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 });
    
    // Handle regular decimal format
    const match = priceStr.match(/^0\.0*([1-9][0-9]*)/);
    if (!match) return price.toFixed(6);
    
    const zeroCount = match[0].length - match[1].length - 2; // -2 for "0."
    return [String(zeroCount), match[1]]
  }