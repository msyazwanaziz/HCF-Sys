'use client';

import { useData } from '@/lib/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function HQBranchesPage() {
  const { branches } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = branches.filter(b => b.negeri.toLowerCase().includes(searchQuery.toLowerCase()));

  const getStatusBadge = (color: string) => {
    switch(color) {
      case 'green': return <Badge className="bg-emerald-500">Selesai</Badge>;
      case 'yellow': return <Badge className="bg-yellow-500">Hampir Penuh</Badge>;
      case 'red': return <Badge variant="destructive">Perlu Perhatian</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Senarai Cawangan</h1>
          <p className="text-sm text-slate-500">Pantau prestasi jualan setiap cawangan secara terperinci</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex relative sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cari negeri/cawangan..." 
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
                <TableHead>Negeri</TableHead>
                <TableHead className="text-center">Bahagian Terjual</TableHead>
                <TableHead className="text-center">Target</TableHead>
                <TableHead className="text-center">Ekor Lembu</TableHead>
                <TableHead className="text-right">Jumlah Kutipan (RM)</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.negeri}</TableCell>
                  <TableCell className="text-center">{b.current}</TableCell>
                  <TableCell className="text-center">{b.target}</TableCell>
                  <TableCell className="text-center">{b.cows}</TableCell>
                  <TableCell className="text-right">{b.collections.toLocaleString()}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(b.statusColor)}</TableCell>
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
