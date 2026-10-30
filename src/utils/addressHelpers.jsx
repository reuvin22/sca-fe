// Philippine address: { region, province, city, barangay, street }. Places are { code, name };
// province is null for regions without provinces (NCR).
export const emptyAddress = {
  region: null,
  province: null,
  city: null,
  barangay: null,
  street: "",
};

// Region, city and barangay are required (province is required only when the region has provinces)
export const isAddressComplete = (address) =>
  Boolean(address?.region && address.city && address.barangay);

// "Blk 1 Lot 2, Bagong Buhay I, City of San Jose del Monte, Bulacan, Central Luzon"
export function formatAddress(address) {
  if (!address) return "";
  return [
    address.street,
    address.barangay?.name,
    address.city?.name,
    address.province?.name,
    address.region?.name,
  ]
    .filter(Boolean)
    .join(", ");
}

// 09XXXXXXXXX or +639XXXXXXXXX (spaces and dashes allowed), same rule as the backend
export const isMobileNumber = (value) =>
  /^(\+63|0)9\d{9}$/.test(value.replace(/[\s-]/g, ""));

export const MOBILE_ERROR = "Enter a mobile number like 0917 123 4567.";
