'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, MapPin, Image as ImageIcon, CheckSquare, AlertCircle } from 'lucide-react';
import { useData } from '@/lib/DataContext';
import Link from 'next/link';

export default function BranchDashboard() {
  const { branches } = useData();
  const branchId = 'b1'; // Hardcoded for demo to Selangor
  const branch = branches.find(b => b.id === branchId);

  if (!branch) return <div>Branch not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Cawangan: {branch.negeri}</h1>
          <p className="text-sm text-slate-500">Ringkasan Operasi Qurban for Mualaf HCF</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-slate-500">Terjual</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">{branch.current}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-slate-500">Available</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">{branch.target - branch.current}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-slate-500">Lembu</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">{branch.cows}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-slate-500">Kutipan</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">RM {(branch.collections/1000).toFixed(1)}k</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
            <CardTitle className="text-xs font-medium text-slate-500">Penerima</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">80</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tindakan Pantas Operasi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/branch/participants">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <span>Urus Peserta</span>
              </Button>
            </Link>
            <Link href="/branch/cows">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span>Status Lembu</span>
              </Button>
            </Link>
            <Link href="/branch/distribution">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                <span>Agihan Daging</span>
              </Button>
            </Link>
            <Link href="/branch/media">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col items-center gap-2">
                <ImageIcon className="h-6 w-6 text-primary" />
                <span>Upload Media</span>
              </Button>
            </Link>
            <Link href="/branch/checklist" className="col-span-2">
              <Button variant="outline" className="w-full h-auto py-4 flex items-center justify-center gap-2 bg-slate-50">
                <CheckSquare className="h-5 w-5 text-primary" />
                <span>Checklist Operasi Qurban</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
              Notifikasi & Tindakan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 p-3 bg-red-50 text-red-900 rounded-lg text-sm">
              <div className="font-medium">Penting:</div>
              <div>Pastikan bayaran deposit lembu dilunaskan selewatnya Jumaat ini.</div>
            </div>
            <div className="flex gap-3 p-3 bg-yellow-50 text-yellow-900 rounded-lg text-sm">
              <div className="font-medium">Peringatan:</div>
              <div>Kemaskini gambar sebelum sembelihan untuk 2 ekor lembu lagi.</div>
            </div>
            <div className="flex gap-3 p-3 bg-blue-50 text-blue-900 rounded-lg text-sm">
              <div className="font-medium">Status:</div>
              <div>Agihan kepada Pusat Jagaan Kasih telah selesai.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
