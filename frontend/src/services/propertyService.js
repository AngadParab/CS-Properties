/**
 * Localized client service wrapper for property operations.
 */
export const fetchProperties = async () => {
  // Simulate an asynchronous API call to mimic database query delays
  return new Promise((resolve) => {
    setTimeout(async () => {
      // Dynamically import properties JSON fixture from centralized data
      const properties = await import('../data/properties.json');
      resolve(properties.default);
    }, 150); // small latency
  });
};
