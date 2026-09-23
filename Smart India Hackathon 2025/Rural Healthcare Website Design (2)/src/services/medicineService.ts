// Medicine Service - API integration for Nabha Medicine Availability Tracker

const API_BASE_URL = 'http://localhost:5001';

export interface MedicineInfo {
  generic_name?: string;
  purpose?: string;
  dosage?: string;
  indications?: string;
  warnings?: string;
  source?: string;
  category?: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export interface MedicineAvailability {
  medicine: string;
  pharmacy: Pharmacy;
  stock: number;
  price: number;
  lastUpdated: string;
  inStock: boolean;
}

export interface MedicineSearchResult {
  medicine: string;
  info: MedicineInfo;
  availability: MedicineAvailability[];
  totalPharmacies: number;
  inStockPharmacies: number;
}

export interface PharmacyData {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export interface PharmacyInventory {
  pharmacy_id: number;
  pharmacy_name: string;
  pharmacy_location: string;
  inventory: Array<{
    medicine_name: string;
    quantity: number;
    last_updated: string;
  }>;
}

export interface StockUpdate {
  pharmacy_id: number;
  medicine_name: string;
  quantity: number;
}

export interface PharmacyResponse {
  pharmacies: PharmacyData[];
  total: number;
}

class MedicineService {
  private async fetchAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MedicineService API Error:', error);
      throw error;
    }
  }

  private async fetchAPIWithAuth<T>(endpoint: string, token: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MedicineService API Error:', error);
      throw error;
    }
  }

  async searchMedicine(medicineName: string): Promise<MedicineSearchResult> {
    return this.fetchAPI<MedicineSearchResult>('/api/search', { medicine: medicineName });
  }

  async getAllPharmacies(): Promise<PharmacyResponse> {
    const data = await this.fetchAPI<PharmacyData[]>('/api/pharmacies');
    return {
      pharmacies: data,
      total: data.length
    };
  }

  async getMedicineInfo(medicineName: string): Promise<MedicineInfo> {
    try {
      const response = await this.searchMedicine(medicineName);
      return response.info;
    } catch (error) {
      console.error('Failed to fetch medicine info:', error);
      return {
        generic_name: medicineName,
        purpose: 'Medicine information not available',
        category: 'Unknown'
      };
    }
  }

  async getCommonMedicines(): Promise<string[]> {
    // Return common medicines that are likely to be in stock
    return [
      'Paracetamol',
      'Aspirin',
      'Ibuprofen',
      'Amoxicillin',
      'Cetirizine',
      'Omeprazole',
      'Metformin',
      'Amlodipine',
      'Atorvastatin',
      'Losartan',
      'Metoprolol',
      'Lisinopril'
    ];
  }

  async updatePharmacyStock(pharmacyId: number, medicine: string, stock: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pharmacy/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pharmacy_id: pharmacyId,
          medicine_name: medicine,
          quantity: stock
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update stock: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to update pharmacy stock:', error);
      throw error;
    }
  }

  async getPharmacyStock(pharmacyId: number): Promise<Record<string, number>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pharmacy/inventory/${pharmacyId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pharmacy stock: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // Convert the inventory array to a simple key-value object
      const stock: Record<string, number> = {};
      if (data.inventory) {
        data.inventory.forEach((item: any) => {
          stock[item.medicine_name] = item.quantity;
        });
      }
      return stock;
    } catch (error) {
      console.error('Failed to fetch pharmacy stock:', error);
      return {};
    }
  }

  async getPharmacyInventory(pharmacyId: number): Promise<PharmacyInventory> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pharmacy/inventory/${pharmacyId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pharmacy inventory: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data; // Return the full response with inventory array
    } catch (error) {
      console.error('Failed to fetch pharmacy inventory:', error);
      return { inventory: [] };
    }
  }

  // New function for pharmacist inventory with authentication
  async getPharmacistInventory(token: string): Promise<PharmacyInventory> {
    try {
      const data = await this.fetchAPIWithAuth<PharmacyInventory>('/api/pharmacist/inventory', token);
      return data;
    } catch (error) {
      console.error('Failed to fetch pharmacist inventory:', error);
      return { 
        pharmacy_id: 0, 
        pharmacy_name: '', 
        pharmacy_location: '', 
        inventory: [] 
      };
    }
  }

  // Update pharmacist stock with authentication
  async updatePharmacistStock(token: string, medicineName: string, quantity: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pharmacist/update-stock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicine_name: medicineName,
          quantity: quantity
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update stock: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to update pharmacist stock:', error);
      throw error;
    }
  }

  // Get pharmacist profile with authentication
  async getPharmacistProfile(token: string): Promise<any> {
    try {
      const data = await this.fetchAPIWithAuth<any>('/api/pharmacist/profile', token);
      return data;
    } catch (error) {
      console.error('Failed to fetch pharmacist profile:', error);
      throw error;
    }
  }

  // Create delivery request (gracefully degrades to offline queue if API not available)
  async requestDelivery(payload: {
    pharmacy_id: number;
    pharmacy_name: string;
    medicine_name: string;
    quantity: number;
    customer_name: string;
    customer_phone: string;
    address: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; id?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/delivery/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Delivery API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.warn('Delivery request failed, saving to offline queue:', error?.message || error);
      const queueKey = 'offline_delivery_queue';
      const queue = JSON.parse(localStorage.getItem(queueKey) || '[]');
      const queued = {
        id: `offline_${Date.now()}`,
        created_at: new Date().toISOString(),
        payload
      };
      queue.push(queued);
      localStorage.setItem(queueKey, JSON.stringify(queue));
      return { success: true, message: 'Saved offline. Will sync when online.', id: queued.id };
    }
  }
}

export const medicineService = new MedicineService();
