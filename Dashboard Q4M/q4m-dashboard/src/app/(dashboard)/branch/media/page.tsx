'use client';

import { useData } from '@/lib/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UploadCloud, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function MediaPage() {
  const { media, addMedia } = useData();
  const branchId = 'b1';
  const branchMedia = media.filter(m => m.branch_id === branchId);

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('Sebelum Korban');

  const handleUpload = () => {
    addMedia({
      id: `m${Date.now()}`,
      branch_id: branchId,
      category,
      file_url: `/media/sample-${Date.now()}.jpg`
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Media & Galeri</h1>
          <p className="text-sm text-slate-500">Muat naik gambar dan video program</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Galeri Media</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><UploadCloud className="h-4 w-4 mr-2" /> Upload</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Media Baru</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Kategori Media</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sebelum Korban">Sebelum Korban</SelectItem>
                        <SelectItem value="Hari Korban">Hari Korban</SelectItem>
                        <SelectItem value="Agihan">Agihan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center bg-slate-50">
                    <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                    <p className="font-medium text-slate-700">Pilih fail atau drag ke sini</p>
                  </div>
                  <Button onClick={handleUpload} className="w-full">Simpan Media</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {branchMedia.map(m => (
                <div key={m.id} className="relative aspect-video bg-slate-100 rounded-md border border-slate-200 flex flex-col items-center justify-center p-2">
                  <span className="text-xs text-slate-400 mb-2">{m.file_url}</span>
                  <Badge variant="secondary" className="text-[10px]">{m.category}</Badge>
                </div>
              ))}
            </div>
            {branchMedia.length === 0 && (
              <div className="text-center py-10 text-slate-500">Tiada media dimuat naik</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 text-primary" />
              Media Guideline
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <div>
              <div className="font-semibold text-emerald-600 flex items-center mb-1">
                <CheckCircle2 className="h-3 w-3 mr-1" /> DIBOLEHKAN
              </div>
              <ul className="list-disc pl-4 text-slate-600 space-y-1">
                <li>Gambar lembu sihat</li>
                <li>Gambar agihan kepada mualaf</li>
                <li>Aktiviti sukarelawan</li>
                <li>Proses packing daging</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-red-500 flex items-center mb-1">
                <X className="h-3 w-3 mr-1" /> ELAKKAN
              </div>
              <ul className="list-disc pl-4 text-slate-600 space-y-1">
                <li>Close-up darah / sembelihan jelas</li>
                <li>Organ dalaman</li>
                <li>Gambar ekstrem / mengerikan</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
