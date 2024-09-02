import { Rental } from "../type/rental";
import authService from './authService';

const API_URL = 'http://localhost:3000/api/rentals';

export const fetchRentals = async (): Promise<Rental[]> => {
  try {
    const token = authService.getToken();

    if (!token) {
      throw new Error("Token is missing or invalid");
    }

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const rentals = data.map((r: any) => ({
      id: r.id,
      propertyId: r.propertyid,
      cost: r.cost,
      status: r.status
    })) as Rental[];

    return rentals;
  } catch (error) {
      console.error('Error fetching rentals:', error);
    throw error;
  }
};
