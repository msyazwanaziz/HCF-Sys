'use client';

import { useData } from '@/lib/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function HQParticipantsPage() {
  const { participants, branches } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = participants.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getBranchName = (id: string) => {
    return branches.find(b => b.id === id)?.negeri || id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Senarai Semua Peserta</h1>
          <p className="text-sm text-slate-500">Pangkalan data seluruh peserta Qurban HCF Nasional</p>
        </div>
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
                <TableHead>Cawangan</TableHead>
                <TableHead className="text-center">Bahagian</TableHead>
                <TableHead className="text-right">Bayaran (RM)</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Wakalah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{getBranchName(p.branch_id)}</TableCell>
                  <TableCell className="text-center">{p.parts}</TableCell>
                  <TableCell className="text-right">{p.payment_amount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={p.payment_status === 'Paid' ? 'default' : p.payment_status === 'Partial' ? 'secondary' : 'destructive'} 
                      className={p.payment_status === 'Paid' ? 'bg-emerald-500' : ''}>
                      {p.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {p.wakalah_status ? <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" /> : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-slate-500">Tiada rekod ditemui</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
