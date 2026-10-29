// Fake network delay for mock services.
export const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))
