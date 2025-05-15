
// Utility functions for localStorage

/**
 * Load data from localStorage
 * @param key The localStorage key
 * @param defaultValue Default value if key doesn't exist
 * @returns The parsed data or default value
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

/**
 * Save data to localStorage
 * @param key The localStorage key
 * @param data The data to save
 */
export const saveToStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};
