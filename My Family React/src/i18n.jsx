import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    appName: "My Family",
    dashboard: "Dashboard Overview",
    directory: "Family Directory",
    tree: "Interactive Family Tree",
    totalMembers: "Total Members",
    demographics: "Demographics",
    male: "Male",
    female: "Female",
    roots: "Family Roots",
    recentlyAdded: "Recently Added Members",
    alive: "Alive",
    deceased: "Deceased",
    search: "Search members by name...",
    addMember: "Add Member",
    editFamilyMember: "Edit Family Member",
    addFamilyMember: "Add Family Member",
    edit: "Edit",
    delete: "Delete",
    save: "Save Member",
    cancel: "Cancel",
    fullName: "Full Name *",
    gender: "Gender *",
    dob: "Date of Birth",
    status: "Status",
    bio: "Biography / Details",
    relationships: "Relationships",
    selectParents: "Select Parents (Optional)",
    selectSpouse: "Select Spouse (Optional)",
    uploadPhoto: "Upload Photo",
    none: "None",
    spouse: "Spouse",
    unknown: "Unknown",
    present: "Present",
    holdCtrl: "Hold Ctrl/Cmd to select multiple",
    confirmDelete: "Are you sure you want to delete this family member?",
    noMembers: "No family members found.",
    noTreeData: "No family members to display. Go to Directory to add some!"
  },
  ms: {
    appName: "Keluarga Saya",
    dashboard: "Gambaran Keseluruhan",
    directory: "Direktori Keluarga",
    tree: "Salasilah Interaktif",
    totalMembers: "Jumlah Ahli",
    demographics: "Demografi",
    male: "Lelaki",
    female: "Perempuan",
    roots: "Akar Umbi Keluarga",
    recentlyAdded: "Ahli Baru Ditambah",
    alive: "Hidup",
    deceased: "Meninggal Dunia",
    search: "Cari ahli mengikut nama...",
    addMember: "Tambah Ahli",
    editFamilyMember: "Edit Ahli Keluarga",
    addFamilyMember: "Tambah Ahli Keluarga",
    edit: "Sunting",
    delete: "Padam",
    save: "Simpan Ahli",
    cancel: "Batal",
    fullName: "Nama Penuh *",
    gender: "Jantina *",
    dob: "Tarikh Lahir",
    status: "Status",
    bio: "Biografi / Butiran",
    relationships: "Hubungan",
    selectParents: "Pilih Ibu Bapa (Pilihan)",
    selectSpouse: "Pilih Pasangan (Pilihan)",
    uploadPhoto: "Muat Naik Gambar",
    none: "Tiada",
    spouse: "Pasangan",
    unknown: "Tidak Diketahui",
    present: "Kini",
    holdCtrl: "Tahan Ctrl/Cmd untuk pilih lebih dari satu",
    confirmDelete: "Adakah anda pasti mahu memadam ahli keluarga ini?",
    noMembers: "Tiada ahli keluarga dijumpai.",
    noTreeData: "Tiada ahli keluarga untuk dipaparkan. Pergi ke Direktori untuk menambah!"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('family_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('family_lang', lang);
  }, [lang]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ms' : 'en');
  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
