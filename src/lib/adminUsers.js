import { apiRequest } from "./api";

export async function fetchRegisteredUsers() {
  const response = await apiRequest("/vendor/users");
  return response.users ?? [];
}
