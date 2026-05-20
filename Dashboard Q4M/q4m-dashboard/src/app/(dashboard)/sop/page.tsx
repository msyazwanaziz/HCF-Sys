import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

export default function SOPPage() {
  const documents = [
    { title: 'SOP Pelaksanaan Qurban HCF', category: 'Operasi', size: '2.4 MB' },
    { title: 'SOP Media & Fotografi Qurban', category: 'Media', size: '1.1 MB' },
    { title: 'SOP Agihan kepada Asnaf/Mualaf', category: 'Agihan', size: '1.8 MB' },
    { title: 'Template Laporan Akhir (Cawangan)', category: 'Laporan', size: '500 KB' },
    { title: 'Template Poster Promosi (Canva/PSD)', category: 'Pemasaran', size: '15 MB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">SOP & Guideline</h1>
          <p className="text-sm text-slate-500">Pusat rujukan dokumen operasi Qurban for Mualaf</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {doc.category}
                </span>
              </div>
              <CardTitle className="text-lg mt-4 leading-tight">{doc.title}</CardTitle>
              <CardDescription>{doc.size}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download File
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
