'use client';

import { useState } from 'react';
import { useData } from '@/lib/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Search, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function ParticipantsPage() {
  const { participants, addParticipant, updateParticipantStatus } = useData();
  const branchId = 'b1'; // Hardcoded for demo
  const branchParticipants = participants.filter(p => p.branch_id === branchId);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog state
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newParts, setNewParts] = useState(1);
  const [newAmount, setNewAmount] = useState(700);

  const filtered = branchParticipants.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addParticipant({
      id: `p${Date.now()}`,
      name: newName,
      branch_id: branchId,
      parts: newParts,
      payment_status: 'Paid',
      payment_amount: newAmount,
      wakalah_status: true,
      infaq_status: true
    });
    setOpen(false);
    setNewName('');
    setNewParts(1);
    setNewAmount(700);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Peserta & Bayaran</h1>
          <p className="text-sm text-slate-500">Pengurusan senarai peserta qurban cawangan anda</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Tambah Peserta</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Peserta Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nama Penuh</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Jumlah Bahagian</Label>
                <Input type="number" min={1} max={7} value={newParts} onChange={e => {
                  const parts = parseInt(e.target.value) || 1;
                  setNewParts(parts);
                  setNewAmount(parts * 700);
                }} required />
              </div>
              <div className="space-y-2">
                <Label>Jumlah Bayaran (RM)</Label>
                <Input type="number" value={newAmount} onChange={e => setNewAmount(parseInt(e.target.value) || 0)} required />
              </div>
              <Button type="submit" className="w-full">Simpan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex relative sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cari peserta..." 
              className="pl-8" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead className="text-center">Bahagian</TableHead>
                <TableHead className="text-right">Bayaran (RM)</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-center">{p.parts}</TableCell>
                  <TableCell className="text-right">{p.payment_amount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={p.payment_status === 'Paid' ? 'default' : p.payment_status === 'Partial' ? 'secondary' : 'destructive'} 
                      className={p.payment_status === 'Paid' ? 'bg-emerald-500' : ''}>
                      {p.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {p.payment_status !== 'Paid' && (
                      <Button variant="outline" size="sm" onClick={() => updateParticipantStatus(p.id, 'Paid')}>
                        Set Paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-slate-500">Tiada rekod ditemui</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
