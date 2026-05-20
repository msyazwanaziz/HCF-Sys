'use client';

import { useData } from '@/lib/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function HQReportsPage() {
  const { reports, branches } = useData();

  const getBranchName = (id: string) => {
    return branches.find(b => b.id === id)?.negeri || id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan Nasional</h1>
          <p className="text-sm text-slate-500">Muat turun laporan yang telah disahkan oleh cawangan</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download All</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Senarai Laporan Cawangan</CardTitle>
          <CardDescription>Laporan akhir agihan dan kewangan dari setiap negeri</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fail</TableHead>
                <TableHead>Jenis Laporan</TableHead>
                <TableHead>Cawangan</TableHead>
                <TableHead className="text-center">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.file_url.split('/').pop()}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{getBranchName(r.branch_id)}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => window.open(r.file_url, '_blank')}>
                      <Download className="h-4 w-4 text-slate-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-slate-500">Tiada laporan ditemui</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
