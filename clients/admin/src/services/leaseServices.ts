import { Lease } from "../type/lease";
import authService from './authService';

const API_URL = 'http://localhost:3000/api/leases';

export const fetchLeases = async (): Promise<Lease[]> => {
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

    const leases = data.map((l: any) => ({
      id: l.id,
      rentalId: l.rentalid,
      tenantId: l.tenantid,
      startDate: l.startdate,
      endDate: l.enddate,
      rentAmount: l.rentamount
    })) as Lease[];

    return leases;
  } catch (error) {
    console.error('Error fetching leases:', error);
    throw error;
  }
};
