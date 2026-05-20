'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, ArrowDownToLine, Download, FileText, Image as ImageIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockBranches } from '@/lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import Link from 'next/link';

export default function HQDashboard() {
  const totalTarget = mockBranches.reduce((sum, b) => sum + b.target, 0);
  const totalCurrent = mockBranches.reduce((sum, b) => sum + b.current, 0);
  const totalCows = mockBranches.reduce((sum, b) => sum + b.cows, 0);
  const totalCollections = mockBranches.reduce((sum, b) => sum + b.collections, 0);
  const completionPercent = Math.round((totalCurrent / totalTarget) * 100);

  const chartData = [
    { name: 'Terjual', value: totalCurrent, color: '#10b981' },
    { name: 'Available', value: totalTarget - totalCurrent, color: '#e2e8f0' }
  ];

  const getStatusBadge = (color: string) => {
    switch(color) {
      case 'green': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Selesai</Badge>;
      case 'yellow': return <Badge className="bg-yellow-500 hover:bg-yellow-600">Hampir Penuh</Badge>;
      case 'red': return <Badge variant="destructive">Perlu Perhatian</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">HQ Dashboard Nasional</h1>
          <p className="text-sm text-slate-500">Ringkasan operasi Qurban for Mualaf 2026</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-slate-500">Total Bahagian</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">{totalCurrent}/{totalTarget}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-slate-500">Jumlah Lembu</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">{totalCows} Ekor</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-slate-500">Total Kutipan</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">RM {(totalCollections/1000).toFixed(1)}k</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-slate-500">Peserta</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">142</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-slate-500">Penerima</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">540</div>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-primary-foreground/80">Nasional</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold">{completionPercent}%</div>
            <p className="text-xs text-primary-foreground/80">Completion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Charts */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Progress Jualan Nasional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium">Progress Agihan</span>
                  <span className="text-slate-500">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium">Media Uploads</span>
                  <span className="text-slate-500">20%</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branch Performance */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Prestasi Cawangan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Negeri</TableHead>
                    <TableHead className="text-center">Bahagian</TableHead>
                    <TableHead className="text-center">Lembu</TableHead>
                    <TableHead className="text-right">Kutipan (RM)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBranches.map((branch) => (
                    <TableRow key={branch.id} className="cursor-pointer hover:bg-slate-50">
                      <TableCell className="font-medium">{branch.negeri}</TableCell>
                      <TableCell className="text-center">
                        {branch.current}/{branch.target}
                      </TableCell>
                      <TableCell className="text-center">{branch.cows}</TableCell>
                      <TableCell className="text-right">{branch.collections.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(branch.statusColor)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Panel */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
              Alerts & Isu Semasa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 p-3 bg-red-50 text-red-900 rounded-lg text-sm">
              <div className="font-medium">Perak:</div>
              <div>Jualan sangat rendah (5/30 bahagian). Perlukan promosi agresif.</div>
            </div>
            <div className="flex gap-3 p-3 bg-yellow-50 text-yellow-900 rounded-lg text-sm">
              <div className="font-medium">Johor:</div>
              <div>5 bayaran deposit lembu masih pending ke supplier.</div>
            </div>
            <div className="flex gap-3 p-3 bg-blue-50 text-blue-900 rounded-lg text-sm">
              <div className="font-medium">Selangor:</div>
              <div>Media agihan belum diupload sepenuhnya untuk 2 lokasi.</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Tindakan Pantas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/hq/reports">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <ArrowDownToLine className="h-5 w-5 text-primary" />
                  <span className="text-sm">Download Laporan</span>
                </Button>
              </Link>
              <Link href="/hq/participants">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">View Semua Peserta</span>
                </Button>
              </Link>
              <Link href="/hq/branches">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm">Senarai Cawangan</span>
                </Button>
              </Link>
              <Link href="/sop">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm">SOP & Guidelines</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
