'use client';

import { useData } from '@/lib/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function DistributionPage() {
  const { recipients, updateRecipientStatus } = useData();
  const branchId = 'b1';
  const branchRecipients = recipients.filter(r => r.branch_id === branchId);

  const completed = branchRecipients.filter(r => r.status === 'Delivered').length;
  const progressPercent = branchRecipients.length > 0 ? (completed / branchRecipients.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Agihan Daging</h1>
          <p className="text-sm text-slate-500">Status penghantaran daging qurban</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Agihan</CardTitle>
          <CardDescription>Status penghantaran kepada asnaf dan mualaf</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2 text-sm font-medium">
              <span>Agihan Keseluruhan</span>
              <span>{progressPercent.toFixed(1)}% Selesai</span>
            </div>
            <Progress value={progressPercent} className="h-2.5" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lokasi / Nama Penerima</TableHead>
                <TableHead className="text-center">Jumlah Pek</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branchRecipients.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-center">{r.packs}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={r.status === 'Delivered' ? 'bg-emerald-500' : 'bg-yellow-500'}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {r.status !== 'Delivered' && (
                      <Button variant="outline" size="sm" onClick={() => updateRecipientStatus(r.id, 'Delivered')}>
                        Set Delivered
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
