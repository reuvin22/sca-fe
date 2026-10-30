const random4 = () => String(Math.floor(Math.random() * 10000)).padStart(4, '0')

// e.g. TASK-1234 (To Do cards). Case, record and appointment IDs are made by the backend.
export const generateTaskId = () => `TASK-${random4()}`
