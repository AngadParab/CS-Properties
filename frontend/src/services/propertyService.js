/**
 * Localized client service wrapper for property operations.
 */
export const fetchProperties = async () => {
  // Simulate an asynchronous API call to mimic database query delays
  return new Promise((resolve) => {
    setTimeout(async () => {
      // Dynamically import properties mock JSON fixture
      const properties = await import('../mocks/properties.json');
      resolve(properties.default);
    }, 150); // small latency
  });
};
