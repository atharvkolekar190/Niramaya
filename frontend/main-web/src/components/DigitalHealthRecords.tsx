import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, FileText, Shield, Cloud, Search, Download, Upload, Plus, Trash2, Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle, User, Stethoscope, Copy, Users, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { healthRecordsApi, type HealthRecord, type EHRFolder, type EHRShare, type User as ApiUser } from '../services/healthRecordsApi';
import { offlineStorage, type OfflineHealthRecord } from '../services/offlineStorage';
import { authService, type User as AuthUser } from '../services/authService';

interface DigitalHealthRecordsProps {
  onBack: () => void;
}

export default function DigitalHealthRecords({ onBack }: DigitalHealthRecordsProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [offlineRecords, setOfflineRecords] = useState<OfflineHealthRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState<HealthRecord[]>([]);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [patientIdInput, setPatientIdInput] = useState('');
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDoctorView, setIsDoctorView] = useState(false);
  const [folders, setFolders] = useState<EHRFolder[]>([]);
  const [showFamilyDialog, setShowFamilyDialog] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [shareFolder, setShareFolder] = useState<EHRFolder | null>(null);
  const [doctors, setDoctors] = useState<ApiUser[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [shareResult, setShareResult] = useState<{ access_key: string; expires_at: string } | null>(null);
  const [folderShares, setFolderShares] = useState<Record<string, EHRShare[]>>({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [deleteFolder, setDeleteFolder] = useState<EHRFolder | null>(null);
  const [confirmFolderArchive, setConfirmFolderArchive] = useState(false);
  const [deletingFolder, setDeletingFolder] = useState(false);

  // Check online status and API availability
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        checkApiHealth();
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Initialize token from authService if available
    const token = authService.getToken();
    if (token) {
      healthRecordsApi.setToken(token);
    }

    checkApiHealth();
    loadUserData();

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Load records after user data is loaded
  useEffect(() => {
    if (user && isLoggedIn && isApiAvailable && user.role === 'patient') {
      console.log('User logged in, loading records for:', user.id);
      loadRecords();
      loadFolders();
      // Always update unsynced count when user logs in
      updateUnsyncedCount();
    }
  }, [user, isLoggedIn, isApiAvailable]);

  // Retry loading records if they're still empty after a delay
  useEffect(() => {
    if (user && isLoggedIn && isApiAvailable && records.length === 0) {
      const retryTimer = setTimeout(() => {
        console.log('Retrying to load records...');
        loadRecords();
      }, 3000); // Retry after 3 seconds

      return () => clearTimeout(retryTimer);
    }
  }, [user, isLoggedIn, isApiAvailable, records.length]);

  // Fallback: Try to load records after a delay if user data is still not available
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!user && !isLoggedIn) {
        console.log('Fallback: Attempting to load records without user data');
        // Try to get user from authService directly
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsLoggedIn(true);
          loadRecords();
        }
      }
    }, 2000); // Wait 2 seconds before fallback

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Reset unsynced count when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setUnsyncedCount(0);
      setRecords([]);
      setOfflineRecords([]);
    }
  }, [isLoggedIn]);

  // Periodically check for unsynced items when online
  useEffect(() => {
    if (isApiAvailable && user && isLoggedIn) {
      const interval = setInterval(() => {
        updateUnsyncedCount();
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isApiAvailable, user, isLoggedIn]);

  // Filter records based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = records.filter(record =>
        record.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  }, [searchTerm, records]);

  // Monitor localStorage for selected patient ID changes
  useEffect(() => {
    const handleStorageChange = () => {
      const selectedPatientId = localStorage.getItem('selectedPatientId');
      if (selectedPatientId) {
        loadRecords(selectedPatientId);
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also check immediately
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkApiHealth = async () => {
    try {
      const isHealthy = await healthRecordsApi.checkApiHealth();
      setIsApiAvailable(isHealthy);
      if (isHealthy) {
        // API is available, update unsynced count
        updateUnsyncedCount();
      }
    } catch (error) {
      console.error('API health check error:', error);
      setIsApiAvailable(false);
    }
  };

  const updateUnsyncedCount = () => {
    if (user?.id) {
      const count = offlineStorage.getUnsyncedCount(user.id);
      setUnsyncedCount(count);
      console.log('Updated unsynced count for user', user.id, ':', count);
    }
  };

  const loadUserData = async () => {
    try {
      // First, try to get user from authService (if already logged in)
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
        // Set the token in healthRecordsApi for API calls
        const token = authService.getToken();
        if (token) {
          healthRecordsApi.setToken(token);
        }
        return;
      }

      if (isApiAvailable) {
        const response = await healthRecordsApi.getProfile();
        if (response.success && response.data) {
          // Convert ApiUser to AuthUser format
          const authUser: AuthUser = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            phone: response.data.user.phone,
            role: response.data.user.user_type === 'doctor' ? 'doctor' : 'patient',
            age: response.data.user.age,
            gender: response.data.user.gender,
            address: response.data.user.address,
            specialization: response.data.user.specialization,
            hospital: response.data.user.hospital,
            license_number: response.data.user.license_number
          };
          setUser(authUser);
          setIsLoggedIn(true);
        }
      } else {
        // Check offline storage first
        if (offlineStorage.isLoggedInOffline()) {
          const offlineUser = offlineStorage.getUserData();
          if (offlineUser) {
            // Convert OfflineUser to AuthUser
            const authUser: AuthUser = {
              id: offlineUser.id,
              name: offlineUser.name,
              email: offlineUser.email,
              phone: offlineUser.phone,
              role: 'patient', // Default to patient for offline users
              age: offlineUser.age,
              gender: offlineUser.gender,
              address: offlineUser.address
            };
            setUser(authUser);
            setIsLoggedIn(true);
          }
        } else {
          // No user data available in offline mode
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Fallback to offline user data
      const offlineUser = offlineStorage.getUserData();
      if (offlineUser) {
        // Convert OfflineUser to AuthUser
        const authUser: AuthUser = {
          id: offlineUser.id,
          name: offlineUser.name,
          email: offlineUser.email,
          phone: offlineUser.phone,
          role: 'patient', // Default to patient for offline users
          age: offlineUser.age,
          gender: offlineUser.gender,
          address: offlineUser.address
        };
        setUser(authUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    }
  };

  const loadRecords = async (patientId?: string) => {
    // Check for selected patient ID from DoctorDashboard
    const selectedPatientId = localStorage.getItem('selectedPatientId');
    const targetUserId = patientId || selectedPatientId || user?.id;
    
    if (!targetUserId) {
      console.log('No target user ID available for loading records');
      return;
    }
    
    console.log('Loading records for user ID:', targetUserId);
    setLoading(true);
    setError(null);

    try {
      if (isApiAvailable) {
        // Use the target user ID (either selected patient or current user)
        const userId = targetUserId;
        
        console.log('Fetching records from API for user:', userId);
        const response = await healthRecordsApi.getPatientRecords(userId);
        console.log('API response:', response);
        
        if (response.success) {
          // Convert API response format to frontend format
          const processedRecords = response.data.records.map((record: any) => ({
            record_id: record.record_id,
            patient_id: record.patient_id,
            uploaded_by: record.uploaded_by || record.patient_id,
            file_url: record.fileUrl,
            file_name: record.fileName,
            file_type: record.fileType,
            file_size: record.fileSize || 1024, // Default file size if not provided
            notes: record.notes || '',
            encrypted: record.encrypted || false,
            date: record.created_at,
            created_at: record.created_at,
            updated_at: record.updated_at
          }));
          
          console.log('Processed records:', processedRecords);
          setRecords(processedRecords);
          setCurrentPatientId(userId);
          // Update unsynced count after loading records
          updateUnsyncedCount();
        } else {
          console.error('Failed to load records:', response.message);
          setError(response.message || 'Failed to load health records');
        }
      } else {
        // Load offline records
        let userId = user?.id;
        if (!userId) {
          console.log('No user ID available for offline records');
          return;
        }
        
        console.log('Loading offline records for user:', userId);
        let offlineRecords = offlineStorage.getHealthRecords(userId);
        
        // If no offline records, create some demo records
        if (offlineRecords.length === 0 && user) {
          console.log('Creating demo records for offline mode');
          const demoRecords: OfflineHealthRecord[] = [
            {
              id: 'demo-record-1',
              patient_id: user.id,
              file_name: 'Blood Test Report.pdf',
              file_type: 'application/pdf',
              file_size: 245760,
              file_data: 'data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDIgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKNCAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVApxCjU5NSA4NDIgVGQKL0YxIDEyIFRmCihCbG9vZCBUZXN0IFJlcG9ydCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZg0KMDAwMDAwMDAwOSAwMDAwMCBuDQowMDAwMDAwMDU4IDAwMDAwIG4NCjAwMDAwMDAxMTUgMDAwMDAgbg0KMDAwMDAwMDI2NSAwMDAwMCBuDQowMDAwMDAwMzI0IDAwMDAwIG4NCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDE0CiUlRU9G',
              notes: 'Complete blood count and basic metabolic panel',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              uploaded_by: user.id,
              encrypted: false,
              synced: false,
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'demo-record-2',
              patient_id: user.id,
              file_name: 'X-Ray Chest.jpg',
              file_type: 'image/jpeg',
              file_size: 156789,
              file_data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
              notes: 'Chest X-ray for routine checkup',
              date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              uploaded_by: user.id,
              encrypted: false,
              synced: false,
              created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
          
          // Save demo records to offline storage
          demoRecords.forEach(record => {
            offlineStorage.saveHealthRecord(record);
          });
          
          offlineRecords = demoRecords;
        }
        
        console.log('Offline records loaded:', offlineRecords);
        setOfflineRecords(offlineRecords);
        setUnsyncedCount(offlineStorage.getUnsyncedCount(userId));
      }
    } catch (error) {
      console.error('Error loading records:', error);
      setError('Failed to load health records');
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    if (!user || user.role !== 'patient') return;
    setError(null);
    try {
      const response = await healthRecordsApi.getEHRFolders();
      if (!response.success || !response.data?.folders) {
        throw new Error(response.message || 'Unable to load EHR folders');
      }
      let loaded = response.data.folders;
      if (loaded.length === 0) {
        const created = await healthRecordsApi.createEHRFolder({
          name: user.name, member_type: 'account_holder',
          profile: { email: user.email, phone: user.phone, age: user.age, gender: user.gender }
        });
        if (!created.success || !created.data?.folder) {
          throw new Error(created.message || 'Unable to create the account-holder EHR folder');
        }
        // Reload so Firestore remains the source of truth and any server metadata is retained.
        const persisted = await healthRecordsApi.getEHRFolders();
        if (!persisted.success || !persisted.data?.folders) {
          throw new Error(persisted.message || 'Unable to reload EHR folders after creation');
        }
        loaded = persisted.data.folders;
      }
      setFolders(loaded);
      if (!selectedFolderId && loaded[0]) {
        setSelectedFolderId(loaded[0].folder_id);
        await viewFolderRecords(loaded[0]);
      }
      const shares = await Promise.all(loaded.map(async folder => {
        const result = await healthRecordsApi.getEHRShares(folder.folder_id);
        return [folder.folder_id, result.success ? result.data.shares : []] as const;
      }));
      setFolderShares(Object.fromEntries(shares));
    } catch (folderError) {
      console.error('Failed to load EHR folders:', folderError);
      setFolders([]);
      setError(folderError instanceof Error ? folderError.message : 'Unable to load EHR folders');
    }
  };

  const viewFolderRecords = async (folder: EHRFolder) => {
    setSelectedFolderId(folder.folder_id);
    const response = await healthRecordsApi.getEHRFolderRecords(folder.folder_id);
    if (!response.success) {
      setError(response.message || 'Unable to load this EHR folder');
      return;
    }
    setRecords(response.data.records.map((record: any) => ({
      ...record,
      uploaded_by: record.uploaded_by || record.patient_id,
      file_url: record.fileUrl,
      file_name: record.fileName || record.title || 'Health record',
      file_type: record.fileType,
      file_size: record.fileSize || 0,
      notes: record.notes || '',
      encrypted: record.encrypted || false,
      date: record.created_at
    })));
    setCurrentPatientId(folder.owner_patient_id);
  };

  const addFamilyFolder = async () => {
    if (!familyName.trim()) return;
    const response = await healthRecordsApi.createEHRFolder({ name: familyName.trim(), member_type: 'other' });
    if (!response.success) {
      setError(response.message || 'Unable to add family member');
      return;
    }
    setFamilyName('');
    setShowFamilyDialog(false);
    await loadFolders();
    setSuccess('Family member folder added');
  };

  const archiveFamilyFolder = async () => {
    if (!deleteFolder || deleteFolder.member_type === 'account_holder' || !confirmFolderArchive) return;
    setDeletingFolder(true);
    setError(null);
    try {
      const response = await healthRecordsApi.deleteEHRFolder(deleteFolder.folder_id, true);
      if (!response.success) {
        setError(response.message || 'Unable to archive this EHR folder');
        return;
      }
      setDeleteFolder(null);
      setConfirmFolderArchive(false);
      if (selectedFolderId === deleteFolder.folder_id) {
        setSelectedFolderId(null);
        setRecords([]);
      }
      await loadFolders();
      setSuccess(response.message || 'Family member folder archived');
    } catch (archiveError) {
      setError(archiveError instanceof Error ? archiveError.message : 'Unable to archive this EHR folder');
    } finally {
      setDeletingFolder(false);
    }
  };

  const openShareDialog = async (folder: EHRFolder) => {
    setShareFolder(folder);
    setShareResult(null);
    const response = await healthRecordsApi.getDoctors();
    if (response.success) setDoctors(response.data.doctors);
  };

  const createShare = async () => {
    if (!shareFolder || !selectedDoctorId) return;
    const response = await healthRecordsApi.shareEHRFolder(shareFolder.folder_id, selectedDoctorId);
    if (!response.success) {
      setError(response.message || 'Unable to share folder');
      return;
    }
    setShareResult({ access_key: response.data.access_key, expires_at: response.data.expires_at });
    setFolderShares(current => ({
      ...current,
      [shareFolder.folder_id]: [...(current[shareFolder.folder_id] || []), response.data.share]
    }));
  };

  const revokeShare = async (folder: EHRFolder, share: EHRShare) => {
    const response = await healthRecordsApi.revokeEHRShare(folder.folder_id, share.share_id);
    if (response.success) {
      setFolderShares(current => ({
        ...current,
        [folder.folder_id]: (current[folder.folder_id] || []).map(item =>
          item.share_id === share.share_id ? { ...item, status: 'revoked' } : item)
      }));
    } else {
      setError(response.message || 'Unable to revoke access');
    }
  };

  // Handle patient search
  const handlePatientSearch = async () => {
    if (!patientIdInput.trim()) {
      setError('Please enter a patient ID');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await loadRecords(patientIdInput.trim());
      setIsDoctorView(true);
      setShowPatientSearch(false);
      setSuccess(`Loaded records for patient ID: ${patientIdInput.trim()}`);
    } catch (err) {
      setError('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  // Reset to own records
  const resetToOwnRecords = () => {
    setIsDoctorView(false);
    setPatientIdInput('');
    setCurrentPatientId(null);
    loadRecords();
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !user || !selectedFolderId) {
      setError('Select the EHR folder that should receive this document.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isApiAvailable) {
        // Use the authenticated user's ID
        let userId = user.id;
        
        if (!userId) {
          setError('User not authenticated. Please log in first.');
          return;
        }
        const response = await healthRecordsApi.uploadRecord(
          selectedFile,
          userId,
          uploadNotes,
          false,
          selectedFolderId
        );
        
        if (response.success) {
          setSuccess('Health record uploaded successfully!');
          setShowUploadDialog(false);
          setSelectedFile(null);
          setUploadNotes('');
          loadRecords();
        } else {
          setError('The server did not accept this upload.');
        }
      } else {
        // Save offline
        const fileData = await offlineStorage.fileToBase64(selectedFile);
        // Use the authenticated user's ID for offline storage too
        let userId = user.id;
        if (!userId) {
          setError('User not authenticated. Please log in first.');
          return;
        }
        
        await offlineStorage.saveHealthRecord({
          patient_id: userId,
          folder_id: selectedFolderId,
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          file_data: fileData,
          notes: uploadNotes,
          date: new Date().toISOString(),
          uploaded_by: userId,
          encrypted: false
        });

        setSuccess('Health record saved offline! Will sync when online.');
        setShowUploadDialog(false);
        setSelectedFile(null);
        setUploadNotes('');
        loadRecords();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload record');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRecord = async (record: HealthRecord | OfflineHealthRecord) => {
    try {
      if ('file_url' in record) {
        // Online record
        const blob = await healthRecordsApi.downloadRecord(record.record_id);
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = record.file_name;
        a.style.display = 'none';
        document.body.appendChild(a);
        
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      } else {
        // Offline record
        offlineStorage.downloadOfflineFile(record);
      }
    } catch (error) {
      console.error('Download error:', error);
      setError(`Failed to download record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    setLoading(true);
    setError(null);

    try {
      if (isApiAvailable) {
        const response = await healthRecordsApi.deleteRecord(recordId);
        if (response.success) {
          setSuccess('Record deleted successfully!');
          loadRecords();
        } else {
          setError('Failed to delete record');
        }
      } else {
        const success = await offlineStorage.deleteHealthRecord(recordId);
        if (success) {
          setSuccess('Record deleted from offline storage!');
          loadRecords();
        } else {
          setError('Failed to delete record');
        }
      }
    } catch (error) {
      setError('Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  const syncOfflineRecords = async () => {
    if (!isApiAvailable) return;

    setLoading(true);
    try {
      const syncQueue = offlineStorage.getSyncQueue();
      const result = await healthRecordsApi.syncOfflineRecords(syncQueue);
      
      if (result.success) {
        offlineStorage.markRecordsAsSynced(result.synced);
        offlineStorage.clearSyncQueue();
        setSuccess(`Synced ${result.synced.length} records!`);
        loadRecords();
      }
    } catch (error) {
      setError('Failed to sync records');
    } finally {
      setLoading(false);
    }
  };

  const displayRecords = isApiAvailable ? filteredRecords : offlineRecords;
  
  // Debug logging
  console.log('Display records debug:', {
    isApiAvailable,
    recordsLength: records.length,
    filteredRecordsLength: filteredRecords.length,
    offlineRecordsLength: offlineRecords.length,
    displayRecordsLength: displayRecords.length,
    searchTerm
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please log in to access your digital health records
            </p>
            <Button onClick={onBack} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">Digital Health Records</h1>
                {currentPatientId && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Patient ID: {currentPatientId}
                    </Badge>
                    {isDoctorView && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={resetToOwnRecords}
                        className="h-5 px-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        View My Records
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Doctor Search Button */}
              {user?.role === 'doctor' && !isDoctorView && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPatientSearch(true)}
                  className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Stethoscope className="h-4 w-4" />
                  Search Patient
                </Button>
              )}
              
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isOnline && isApiAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {isOnline && isApiAvailable ? (
                  <>
                    <Wifi className="h-4 w-4" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4" />
                    Offline
                  </>
                )}
              </div>
              
              {/* Sync Button */}
              {isApiAvailable && unsyncedCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={syncOfflineRecords}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Sync ({unsyncedCount})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* User Info */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  {user?.role === 'doctor' ? (
                    <Stethoscope className="h-6 w-6 text-white" />
                  ) : (
                    <User className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {isDoctorView && currentPatientId ? 'Patient Records' : user?.name}
                  </h2>
                  <p className="text-gray-600">
                    {user?.role === 'doctor' ? 'Dr. ' : ''}
                    {user?.role === 'doctor' ? user.specialization : 'Patient'}
                    {user?.hospital && ` • ${user.hospital}`}
                  </p>
                   {user?.id && (
                     <p className="text-xs text-blue-600 mt-1 font-mono">
                       Patient ID: {user.id}
                     </p>
                   )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {displayRecords.length}
                </div>
                <p className="text-sm text-gray-600">Health Records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {user?.role === 'patient' && isApiAvailable && (
          <Card className="mb-8 border-indigo-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-600" />Family EHR folders</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Each folder is isolated and can be shared for 24 hours.</p>
              </div>
              <Button variant="outline" onClick={() => setShowFamilyDialog(true)}><Plus className="h-4 w-4 mr-2" />Add family member</Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {folders.map(folder => (
                <div key={folder.folder_id} className={`rounded-xl border p-4 ${selectedFolderId === folder.folder_id ? 'border-indigo-500' : 'border-indigo-100'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{folder.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{folder.member_type.replace('_', ' ')}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-mono text-sm tracking-widest text-indigo-700">{folder.sharing_code}</span>
                        <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(folder.sharing_code)} aria-label={`Copy ${folder.name}'s EHR sharing code`}><Copy className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => viewFolderRecords(folder)}>View records</Button>
                      <Button size="sm" variant="outline" onClick={() => openShareDialog(folder)}><Share2 className="h-4 w-4 mr-1" />Share with Doctor</Button>
                    </div>
                  </div>
                  {folder.member_type !== 'account_holder' && (
                    <div className="mt-3 flex justify-end border-t border-gray-100 pt-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                        title={`Delete ${folder.name}'s EHR folder`}
                        aria-label={`Delete ${folder.name}'s EHR folder`}
                        onClick={() => {
                          setDeleteFolder(folder);
                          setConfirmFolderArchive(false);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete folder
                      </Button>
                    </div>
                  )}
                  <div className="mt-3 space-y-2">
                    {(folderShares[folder.folder_id] || []).map(share => (
                      <div key={share.share_id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
                        <Badge variant="outline" className={share.status === 'active' ? 'text-green-700' : 'text-gray-600'}>{share.status}</Badge>
                        <span>Expires {new Date(share.expires_at).toLocaleString()}</span>
                        {share.status === 'active' && <Button size="sm" variant="ghost" onClick={() => revokeShare(folder, share)}>Revoke</Button>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Dialog open={showFamilyDialog} onOpenChange={setShowFamilyDialog}>
          <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto">
            <DialogHeader><DialogTitle>Add family member folder</DialogTitle><DialogDescription>Profile and records will remain separate from other folders.</DialogDescription></DialogHeader>
            <Input className="bg-white text-gray-900 placeholder:text-gray-400" value={familyName} onChange={event => setFamilyName(event.target.value)} placeholder="Family member name" />
            <Button onClick={addFamilyFolder}>Create folder</Button>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!deleteFolder}
          onOpenChange={open => {
            if (!open && !deletingFolder) {
              setDeleteFolder(null);
              setConfirmFolderArchive(false);
            }
          }}
        >
          <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Archive {deleteFolder?.name}'s EHR folder?</DialogTitle>
              <DialogDescription>
                This action cannot delete the account-holder folder. The selected family folder will be hidden from this account,
                its documents will be retained safely, and all active doctor access will be revoked. Old sharing keys and links will stop working.
              </DialogDescription>
            </DialogHeader>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={confirmFolderArchive}
                onChange={event => setConfirmFolderArchive(event.target.checked)}
                disabled={deletingFolder}
              />
              <span>I understand that this folder and its documents will be archived and no longer available through the EHR.</span>
            </label>
            <div className="mt-2 flex shrink-0 justify-end gap-2 border-t border-gray-200 pt-4">
              <Button variant="outline" onClick={() => setDeleteFolder(null)} disabled={deletingFolder}>Cancel</Button>
              <Button variant="outline-red-200" onClick={archiveFamilyFolder} disabled={!confirmFolderArchive || deletingFolder}>
                {deletingFolder ? 'Archiving...' : 'Confirm archive'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!shareFolder} onOpenChange={open => !open && setShareFolder(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Share {shareFolder?.name}'s EHR</DialogTitle><DialogDescription>Select one doctor. This folder's 10-character code is used only through an active 24-hour doctor grant.</DialogDescription></DialogHeader>
            {shareFolder && <div className="flex items-center gap-2 rounded-lg bg-indigo-50 p-3"><span className="text-sm text-indigo-900">Folder code:</span><span className="font-mono font-semibold tracking-widest text-indigo-700">{shareFolder.sharing_code}</span><Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(shareFolder.sharing_code)}><Copy className="h-4 w-4" /></Button></div>}
            {!shareResult ? (
              <>
                <select className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900" value={selectedDoctorId} onChange={event => setSelectedDoctorId(event.target.value)}>
                  <option value="">Select a doctor</option>
                  {doctors.map(doctor => <option key={doctor.id} value={doctor.id}>Dr. {doctor.name} {doctor.specialization ? `- ${doctor.specialization}` : ''}</option>)}
                </select>
                <Button onClick={createShare} disabled={!selectedDoctorId}>Generate secure access key</Button>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Share this key only with the selected doctor. It cannot be used for another doctor or folder.</p>
                <div className="flex gap-2"><Input className="bg-white text-gray-900 font-mono" readOnly value={shareResult.access_key} /><Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(shareResult.access_key)}><Copy className="h-4 w-4" /></Button></div>
                <p className="text-sm font-medium text-amber-700">Expires: {new Date(shareResult.expires_at).toLocaleString()}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Error and Success Messages */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">{success}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Upload */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search health records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Upload Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Upload Health Record</DialogTitle>
                <DialogDescription>
                  Upload your medical documents, test results, or health reports. Files will be securely stored and accessible offline.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => {
                      setSelectedFile(e.target.files?.[0] || null);
                    }}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        } else {
                          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                          if (fileInput) {
                            fileInput.click();
                          }
                        }
                      }}
                    >
                      Browse Files
                    </Button>
                  </div>
                  {selectedFile && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">
                          Selected: {selectedFile.name}
                        </span>
                        <span className="text-xs text-green-600">
                          ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination EHR folder
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    value={selectedFolderId || ''}
                    onChange={(event) => setSelectedFolderId(event.target.value)}
                    required
                  >
                    <option value="" disabled>Select the person whose EHR this belongs to</option>
                    {folders.map(folder => (
                      <option key={folder.folder_id} value={folder.folder_id}>{folder.name}</option>
                    ))}
                  </select>
                  {selectedFolderId && (
                    <p className="mt-2 text-xs text-blue-700">
                      Destination: {folders.find(folder => folder.folder_id === selectedFolderId)?.name || 'Selected EHR folder'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add notes about this record..."
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFileUpload}
                    disabled={!selectedFile || !selectedFolderId || loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Records List */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <FileText className="h-5 w-5" />
              Health Records
              {!isApiAvailable && (
                <Badge className="bg-orange-100 text-orange-800">
                  Offline Mode
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600">Loading records...</p>
              </div>
            ) : displayRecords.length > 0 ? (
              <div className="space-y-4">
                {displayRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{record.file_name}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(record.date || record.created_at).toLocaleDateString()} • 
                          {(record.file_size / 1024).toFixed(1)} KB
                        </p>
                        {record.notes && (
                          <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isApiAvailable && !('synced' in record ? record.synced : true) && (
                        <Badge className="bg-orange-100 text-orange-800">
                          Pending Sync
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadRecord(record)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {(!isDoctorView && user?.role !== 'doctor') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteRecord('record_id' in record ? record.record_id : record.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No health records found</p>
                <p className="text-sm text-gray-500 mt-2">
                  Upload your first health record to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offline Features Info */}
        {!isApiAvailable && (
          <Card className="mt-8 border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <WifiOff className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800 mb-2">Offline Mode Active</h3>
                  <p className="text-orange-700 text-sm mb-3">
                    You're currently working offline. Your records are saved locally and will sync automatically when you're back online.
                  </p>
                  <div className="text-sm text-orange-600">
                    <p>• Records are stored securely on your device</p>
                    <p>• Changes will sync when connection is restored</p>
                    <p>• You can still view and download your records</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <Card className="text-center border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">100% Secure</h3>
              <p className="text-gray-600 text-sm">Bank-level encryption and HIPAA compliance</p>
            </CardContent>
          </Card>

          <Card className="text-center border-indigo-200 bg-indigo-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Offline Access</h3>
              <p className="text-gray-600 text-sm">Access your records even without internet</p>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Easy Search</h3>
              <p className="text-gray-600 text-sm">Find any record in seconds</p>
            </CardContent>
          </Card>

          <Card className="text-center border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Easy Sharing</h3>
              <p className="text-gray-600 text-sm">Download and share with doctors</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Search Dialog */}
        <Dialog open={showPatientSearch} onOpenChange={setShowPatientSearch}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                Search Patient Records
              </DialogTitle>
              <DialogDescription>
                Enter the patient ID to view their health records
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Patient ID
                </label>
                <Input
                  placeholder="Enter patient ID"
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current Patient ID: {user?.id || 'Not logged in'}
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowPatientSearch(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePatientSearch}
                  disabled={loading || !patientIdInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}