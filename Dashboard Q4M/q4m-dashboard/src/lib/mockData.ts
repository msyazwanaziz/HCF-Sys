export const mockUsers = [
  { id: '1', name: 'HQ Admin', email: 'hq@hcf.org', role: 'hq', branch_id: null },
  { id: '2', name: 'Branch Admin Selangor', email: 'selangor@hcf.org', role: 'branch', branch_id: 'b1' },
  { id: '3', name: 'Branch Admin KL', email: 'kl@hcf.org', role: 'branch', branch_id: 'b2' },
];

export const mockBranches = [
  { id: 'b1', negeri: 'Selangor', status: 'Active', target: 50, current: 35, cows: 5, collections: 24500, statusColor: 'yellow' },
  { id: 'b2', negeri: 'Kuala Lumpur', status: 'Active', target: 30, current: 30, cows: 5, collections: 21000, statusColor: 'green' },
  { id: 'b3', negeri: 'Johor', status: 'Active', target: 40, current: 15, cows: 3, collections: 10500, statusColor: 'red' },
  { id: 'b4', negeri: 'Penang', status: 'Active', target: 20, current: 18, cows: 3, collections: 12600, statusColor: 'yellow' },
  { id: 'b5', negeri: 'Perak', status: 'Active', target: 30, current: 5, cows: 1, collections: 3500, statusColor: 'red' }
];

export const mockParticipants = [
  { id: 'p1', name: 'Ahmad Ali', branch_id: 'b1', parts: 1, payment_status: 'Paid', payment_amount: 700, wakalah_status: true, infaq_status: true },
  { id: 'p2', name: 'Siti Aminah', branch_id: 'b1', parts: 2, payment_status: 'Partial', payment_amount: 500, wakalah_status: true, infaq_status: false },
  { id: 'p3', name: 'Abu Bakar', branch_id: 'b1', parts: 1, payment_status: 'Pending', payment_amount: 0, wakalah_status: false, infaq_status: false },
  { id: 'p4', name: 'Omar Osman', branch_id: 'b2', parts: 1, payment_status: 'Paid', payment_amount: 700, wakalah_status: true, infaq_status: true },
];

export const mockCows = [
  { id: 'c1', branch_id: 'b1', supplier: 'Ladang A', status_7_7: 7, deposit_status: 'Paid', weight: '250kg', price: 4500, image: 'cow1.jpg' },
  { id: 'c2', branch_id: 'b1', supplier: 'Ladang A', status_7_7: 5, deposit_status: 'Pending', weight: '240kg', price: 4400, image: 'cow2.jpg' },
  { id: 'c3', branch_id: 'b2', supplier: 'Ladang B', status_7_7: 7, deposit_status: 'Paid', weight: '260kg', price: 4600, image: 'cow3.jpg' },
];

export const mockRecipients = [
  { id: 'r1', branch_id: 'b1', name: 'Kg Mualaf Gombak', status: 'Pending', packs: 50, recipients_count: 50 },
  { id: 'r2', branch_id: 'b1', name: 'Pusat Jagaan Kasih', status: 'Delivered', packs: 30, recipients_count: 30 },
  { id: 'r3', branch_id: 'b2', name: 'Komuniti Mualaf Chow Kit', status: 'Pending', packs: 100, recipients_count: 100 },
];

export const mockMedia = [
  { id: 'm1', branch_id: 'b1', category: 'Sebelum Korban', file_url: '/media/lembu1.jpg' },
  { id: 'm2', branch_id: 'b1', category: 'Hari Korban', file_url: '/media/sembelihan.mp4' },
];

export const mockReports = [
  { id: 'rp1', branch_id: 'b1', type: 'Laporan Agihan', file_url: '/reports/agihan-selangor.pdf' },
  { id: 'rp2', branch_id: 'b1', type: 'Laporan Kewangan', file_url: '/reports/kewangan-selangor.pdf' },
];
