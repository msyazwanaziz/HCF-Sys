'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export default function ChecklistPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Checklist Operasi</h1>
          <p className="text-sm text-slate-500">Pastikan semua perkara diselesaikan mengikut fasa.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Senarai Semak</CardTitle>
          <CardDescription>Tandakan kotak setelah selesai tugasan berkaitan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                <Badge className="mr-2 bg-primary">Fasa 1</Badge> Sebelum Korban
              </h3>
              <div className="space-y-3 pl-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="c1" defaultChecked />
                  <label htmlFor="c1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Lokasi sembelihan disahkan (Permit JPV jika perlu)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c2" defaultChecked />
                  <label htmlFor="c2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Sukarelawan mencukupi (Minimum 10 orang)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c3" />
                  <label htmlFor="c3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Peralatan logistik (Pisau, plastik, penimbang, khemah) siap sedia
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c4" defaultChecked />
                  <label htmlFor="c4" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Banner program dicetak dan dipasang
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                <Badge className="mr-2 bg-slate-300 text-slate-800">Fasa 2</Badge> Hari Korban
              </h3>
              <div className="space-y-3 pl-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="c5" />
                  <label htmlFor="c5" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Ambil gambar lembu sebelum sembelih
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c6" />
                  <label htmlFor="c6" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Ambil video rakaman lafaz niat wakalah semasa sembelihan
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c7" />
                  <label htmlFor="c7" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Proses timbang dan packing daging selesai (Anggaran 1-2kg/pek)
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                <Badge className="mr-2 bg-slate-300 text-slate-800">Fasa 3</Badge> Selepas Korban
              </h3>
              <div className="space-y-3 pl-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="c8" />
                  <label htmlFor="c8" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Agihan daging kepada penerima sasaran selesai
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c9" />
                  <label htmlFor="c9" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Sijil pelaksanaan dihantar kepada peserta
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c10" />
                  <label htmlFor="c10" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Laporan akhir diserahkan ke HQ
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
