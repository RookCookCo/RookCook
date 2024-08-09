// reportWebVitals function that captures and reports web performance metrics
const reportWebVitals = onPerfEntry => {
  // Check if onPerfEntry is provided and is a function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the web-vitals library
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Call each of the web-vital functions, passing the onPerfEntry callback
      getCLS(onPerfEntry);  // Cumulative Layout Shift - measures visual stability
      getFID(onPerfEntry);  // First Input Delay - measures input responsiveness
      getFCP(onPerfEntry);  // First Contentful Paint - measures page load speed
      getLCP(onPerfEntry);  // Largest Contentful Paint - measures loading performance
      getTTFB(onPerfEntry); // Time to First Byte - measures server responsiveness
    });
  }
};

export default reportWebVitals;
