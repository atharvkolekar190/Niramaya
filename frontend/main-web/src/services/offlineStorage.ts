// Offline Storage Service for Rural Patients
// Provides local storage capabilities when internet is not available

export interface OfflineHealthRecord {
  id: string;
  patient_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_data: string; // Base64 encoded file data
  notes: string;
  date: string;
  uploaded_by: string;
  encrypted: boolean;
  synced: boolean; // Whether this record has been synced to server
  created_at: string;
}

export interface OfflineUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: string;
  user_type: 'patient' | 'doctor';
  specialization?: string;
  hospital?: string;
  license_number?: string;
}

class OfflineStorageService {
  private readonly STORAGE_KEYS = {
    HEALTH_RECORDS: 'offline_health_records',
    USER_DATA: 'offline_user_data',
    SYNC_QUEUE: 'offline_sync_queue',
    LAST_SYNC: 'last_sync_timestamp'
  };

  // Check if browser supports required storage APIs
  isSupported(): boolean {
    return typeof Storage !== 'undefined' && 'indexedDB' in window;
  }

  // Save health record offline
  async saveHealthRecord(record: Omit<OfflineHealthRecord, 'id' | 'created_at' | 'synced'>): Promise<OfflineHealthRecord> {
    const newRecord: OfflineHealthRecord = {
      ...record,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      synced: false
    };

    console.log('Saving offline record:', {
      id: newRecord.id,
      file_name: newRecord.file_name,
      has_file_data: !!newRecord.file_data,
      file_data_length: newRecord.file_data?.length,
      keys: Object.keys(newRecord)
    });

    const existingRecords = this.getHealthRecords();
    existingRecords.push(newRecord);
    
    localStorage.setItem(this.STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(existingRecords));
    
    console.log('Saved to localStorage. Total records:', existingRecords.length);
    
    // Add to sync queue
    this.addToSyncQueue('CREATE_RECORD', newRecord);
    
    return newRecord;
  }

  // Get all health records for a patient
  getHealthRecords(patientId?: string): OfflineHealthRecord[] {
    try {
      const records = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.HEALTH_RECORDS) || '[]');
      console.log('Retrieved offline records from localStorage:', records);
      console.log('Records count:', records.length);
      
      if (records.length > 0) {
        console.log('First record structure:', {
          id: records[0].id,
          file_name: records[0].file_name,
          has_file_data: !!records[0].file_data,
          file_data_length: records[0].file_data?.length,
          keys: Object.keys(records[0])
        });
      }
      
      const filteredRecords = patientId ? records.filter((record: OfflineHealthRecord) => record.patient_id === patientId) : records;
      console.log('Filtered records for patient:', patientId, filteredRecords);
      
      return filteredRecords;
    } catch (error) {
      console.error('Error retrieving offline records:', error);
      return [];
    }
  }

  // Get a specific health record
  getHealthRecord(recordId: string): OfflineHealthRecord | null {
    const records = this.getHealthRecords();
    return records.find(record => record.id === recordId) || null;
  }

  // Update health record
  async updateHealthRecord(recordId: string, updates: Partial<OfflineHealthRecord>): Promise<boolean> {
    const records = this.getHealthRecords();
    const index = records.findIndex(record => record.id === recordId);
    
    if (index === -1) return false;
    
    records[index] = { ...records[index], ...updates };
    localStorage.setItem(this.STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(records));
    
    // Add to sync queue
    this.addToSyncQueue('UPDATE_RECORD', records[index]);
    
    return true;
  }

  // Delete health record
  async deleteHealthRecord(recordId: string): Promise<boolean> {
    const records = this.getHealthRecords();
    const filteredRecords = records.filter(record => record.id !== recordId);
    
    if (filteredRecords.length === records.length) return false;
    
    localStorage.setItem(this.STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(filteredRecords));
    
    // Add to sync queue
    this.addToSyncQueue('DELETE_RECORD', { id: recordId });
    
    return true;
  }

  // Save user data offline
  saveUserData(user: OfflineUser): void {
    localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  // Get user data
  getUserData(): OfflineUser | null {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USER_DATA) || 'null');
    } catch {
      return null;
    }
  }

  // Check if user is logged in offline
  isLoggedInOffline(): boolean {
    return this.getUserData() !== null;
  }

  // Add operation to sync queue
  private addToSyncQueue(operation: string, data: any): void {
    const queue = this.getSyncQueue();
    queue.push({
      operation,
      data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(this.STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  }

  // Get sync queue
  getSyncQueue(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SYNC_QUEUE) || '[]');
    } catch {
      return [];
    }
  }

  // Clear sync queue
  clearSyncQueue(): void {
    localStorage.removeItem(this.STORAGE_KEYS.SYNC_QUEUE);
  }

  // Get unsynced records count
  getUnsyncedCount(patientId?: string): number {
    const records = this.getHealthRecords(patientId);
    return records.filter(record => !record.synced).length;
  }

  // Mark records as synced
  markRecordsAsSynced(recordIds: string[]): void {
    const records = this.getHealthRecords();
    records.forEach(record => {
      if (recordIds.includes(record.id)) {
        record.synced = true;
      }
    });
    localStorage.setItem(this.STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(records));
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number; percentage: number } {
    const used = JSON.stringify(localStorage).length;
    const available = 5 * 1024 * 1024; // 5MB typical limit
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  }

  // Clear all offline data
  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Convert file to base64 for offline storage
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Convert base64 to blob for download
  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // Download file from offline storage
  downloadOfflineFile(record: OfflineHealthRecord): void {
    console.log('Downloading offline file:', record);
    console.log('Record ID:', record.id);
    console.log('Record file_name:', record.file_name);
    console.log('Record file_type:', record.file_type);
    console.log('Record file_data exists:', !!record.file_data);
    console.log('Record file_data type:', typeof record.file_data);
    console.log('Record file_data length:', record.file_data?.length);
    console.log('All record keys:', Object.keys(record));
    
    if (!record.file_data) {
      console.error('No file data found for offline record:', record.id);
      
      // Try to create a simple text file as fallback
      console.log('Creating fallback text file...');
      const fileName = record.file_name || 'health_record';
      const fallbackContent = `Health Record: ${fileName}\n\nNotes: ${record.notes || 'No notes available'}\n\nDate: ${record.date || 'Unknown date'}\n\nThis is a fallback file because the original file data is not available.`;
      const blob = new Blob([fallbackContent], { type: 'text/plain' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (fileName.includes('.') ? fileName.replace(/\.[^/.]+$/, '') : fileName) + '_fallback.txt';
      a.style.display = 'none';
      document.body.appendChild(a);
      
      console.log('Triggering fallback download...');
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Fallback download cleanup completed');
      }, 100);
      
      return;
    }
    
    try {
      const blob = this.base64ToBlob(record.file_data, record.file_type);
      console.log('Created blob:', blob);
      console.log('Blob size:', blob.size);
      console.log('Blob type:', blob.type);
      
      const url = URL.createObjectURL(blob);
      console.log('Created object URL:', url);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = record.file_name;
      a.style.display = 'none';
      document.body.appendChild(a);
      
      console.log('Triggering download...');
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Offline download cleanup completed');
      }, 100);
    } catch (error) {
      console.error('Error downloading offline file:', error);
      alert('Failed to download file: ' + error.message);
    }
  }
}

export const offlineStorage = new OfflineStorageService();
