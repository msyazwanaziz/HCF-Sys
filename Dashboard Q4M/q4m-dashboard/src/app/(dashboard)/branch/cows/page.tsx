'use client';

import { useData } from '@/lib/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CowsPage() {
  const { cows, updateCowDeposit } = useData();
  const branchId = 'b1';
  const branchCows = cows.filter(c => c.branch_id === branchId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengurusan Lembu</h1>
          <p className="text-sm text-slate-500">Pantau status bahagian dan deposit lembu</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Senarai Lembu Cawangan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cow ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-center">Status 7/7</TableHead>
                <TableHead className="text-center">Deposit</TableHead>
                <TableHead className="text-right">Berat / Harga</TableHead>
                <TableHead className="text-center">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branchCows.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">#{c.id.toUpperCase()}</TableCell>
                  <TableCell>{c.supplier}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-center">
                      {[1,2,3,4,5,6,7].map(i => (
                        <div key={i} className={`h-4 w-4 rounded-sm border ${i <= c.status_7_7 ? 'bg-primary border-primary' : 'bg-slate-100 border-slate-300'}`}></div>
                      ))}
                    </div>
                    <div className="text-xs text-center text-slate-500 mt-1">{c.status_7_7}/7 Penuh</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={c.deposit_status === 'Paid' ? 'outline' : 'destructive'} 
                      className={c.deposit_status === 'Paid' ? 'border-emerald-500 text-emerald-700' : ''}>
                      {c.deposit_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>{c.weight}</div>
                    <div className="text-xs text-slate-500">RM {c.price}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    {c.deposit_status !== 'Paid' && (
                      <Button variant="outline" size="sm" onClick={() => updateCowDeposit(c.id, 'Paid')}>
                        Set Paid
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
