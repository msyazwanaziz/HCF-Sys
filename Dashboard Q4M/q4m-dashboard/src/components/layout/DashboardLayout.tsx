'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  FileText,
  MapPin,
  Image as ImageIcon,
  CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  if (!user) return null;

  const isHQ = user.role === 'hq';

  const navigation = [
    { name: 'Dashboard', href: isHQ ? '/hq' : '/branch', icon: LayoutDashboard },
    ...(isHQ ? [
      { name: 'Negeri/Cawangan', href: '/hq/branches', icon: MapPin },
      { name: 'Semua Peserta', href: '/hq/participants', icon: Users },
      { name: 'Laporan Nasional', href: '/hq/reports', icon: FileText },
    ] : [
      { name: 'Peserta & Payment', href: '/branch/participants', icon: Users },
      { name: 'Pengurusan Lembu', href: '/branch/cows', icon: FileText },
      { name: 'Agihan Daging', href: '/branch/distribution', icon: MapPin },
      { name: 'Media & Galeri', href: '/branch/media', icon: ImageIcon },
      { name: 'Checklist Operasi', href: '/branch/checklist', icon: CheckSquare },
    ]),
    { name: 'SOP & Guideline', href: '/sop', icon: FileText },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <span className="font-bold text-primary text-xs">QfM</span>
          </div>
          <span className="text-lg font-bold text-slate-800">HCF Qurban</span>
          <button 
            className="ml-auto lg:hidden text-slate-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <div className="flex items-center mb-4 px-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold mr-3">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 sticky top-0 z-30">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center ml-auto">
            <div className="hidden sm:block text-sm text-slate-500 mr-4">
              Status: <span className="text-primary font-medium">Active</span>
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
