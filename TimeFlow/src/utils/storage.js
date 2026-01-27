// src/utils/storage.js
export const saveAvailability = (availability) => {
  localStorage.setItem("availability", JSON.stringify(availability));
};

export const loadAvailability = () => {
  try {
    const data = localStorage.getItem("availability");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load availability", e);
    return null;
  }
};

export const clearAvailability = () => {
  localStorage.removeItem("availability");
};
