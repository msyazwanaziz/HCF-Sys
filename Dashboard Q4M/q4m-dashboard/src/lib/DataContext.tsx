'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockBranches, mockParticipants, mockCows, mockRecipients, mockMedia, mockReports } from './mockData';
import { toast } from 'sonner';

type DataContextType = {
  branches: typeof mockBranches;
  participants: typeof mockParticipants;
  cows: typeof mockCows;
  recipients: typeof mockRecipients;
  media: typeof mockMedia;
  reports: typeof mockReports;
  addParticipant: (participant: any) => void;
  updateParticipantStatus: (id: string, status: string) => void;
  updateCowDeposit: (id: string, status: string) => void;
  updateRecipientStatus: (id: string, status: string) => void;
  addMedia: (mediaItem: any) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState(mockBranches);
  const [participants, setParticipants] = useState(mockParticipants);
  const [cows, setCows] = useState(mockCows);
  const [recipients, setRecipients] = useState(mockRecipients);
  const [media, setMedia] = useState(mockMedia);
  const [reports, setReports] = useState(mockReports);

  // Load from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('qfm_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setBranches(parsed.branches || mockBranches);
      setParticipants(parsed.participants || mockParticipants);
      setCows(parsed.cows || mockCows);
      setRecipients(parsed.recipients || mockRecipients);
      setMedia(parsed.media || mockMedia);
      setReports(parsed.reports || mockReports);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('qfm_data', JSON.stringify({
      branches, participants, cows, recipients, media, reports
    }));
  }, [branches, participants, cows, recipients, media, reports]);

  const addParticipant = (participant: any) => {
    setParticipants(prev => [...prev, participant]);
    toast.success('Peserta berjaya ditambah');
  };

  const updateParticipantStatus = (id: string, status: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, payment_status: status } : p));
    toast.success('Status bayaran dikemaskini');
  };

  const updateCowDeposit = (id: string, status: string) => {
    setCows(prev => prev.map(c => c.id === id ? { ...c, deposit_status: status } : c));
    toast.success('Status deposit lembu dikemaskini');
  };

  const updateRecipientStatus = (id: string, status: string) => {
    setRecipients(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success('Status agihan dikemaskini');
  };

  const addMedia = (mediaItem: any) => {
    setMedia(prev => [...prev, mediaItem]);
    toast.success('Media berjaya dimuat naik');
  };

  return (
    <DataContext.Provider value={{
      branches, participants, cows, recipients, media, reports,
      addParticipant, updateParticipantStatus, updateCowDeposit, updateRecipientStatus, addMedia
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
