const random4 = () => String(Math.floor(Math.random() * 10000)).padStart(4, '0')

// e.g. CASE#1234-9808
export const generateCaseNumber = () => `CASE#${random4()}-${random4()}`

// e.g. INV-1234
export const generateRecordId = () => `INV-${random4()}`

// e.g. APT-1234
export const generateAppointmentId = () => `APT-${random4()}`

// e.g. TASK-1234
export const generateTaskId = () => `TASK-${random4()}`
