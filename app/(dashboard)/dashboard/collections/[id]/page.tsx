"use client"
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase/client'
import { Globe, Puzzle, Layers, Settings, Info } from 'lucide-react'
import { LoopSpinner } from '@/components/ui/loop-spinner'

export default function CollectionManagerPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params?.id;
  const [activeTab, setActiveTab] = useState('info');
  const [collectionName, setCollectionName] = useState('');
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    async function fetchCollectionName(id: string) {
      if (!apiBaseUrl || !id) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const res = await fetch(`${apiBaseUrl}/collections/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setCollectionName(data.name || 'Collection');
      } catch {
        setCollectionName('Collection');
      }
    }
    if (collectionId) fetchCollectionName(collectionId as string);
  }, [collectionId, apiBaseUrl]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name?: string|null, email?: string|null, image?: string|null } | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (!mounted) return;
      if (!data?.user) {
        router.push('/login');
        return;
      }
      setUser({
        name: data.user.user_metadata?.name || data.user.email,
        email: data.user.email,
        image: data.user.user_metadata?.avatar_url || null,
      });
      setLoading(false);
    });
    return () => { mounted = false };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 border-r border-border bg-background" />
        <main className="flex-1 p-8">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-8 w-80 mb-4" />
          <Skeleton className="h-40 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar user={user} />
      <main className="flex-1 p-8">
        {/* Botão de retorno */}
        <Button variant="outline" className="mb-6" onClick={() => router.push('/dashboard/collections')}>
          ← Voltar para Collections
        </Button>

        {/* Nome da Collection */}
        <h1 className="text-3xl font-bold mb-2">
          {collectionName
            ? collectionName
            : <LoopSpinner size={28} color="var(--primary)" />}
        </h1>

        {/* Top Bar */}
        <div className="border-b border-border mb-8">
          <nav className="flex gap-4 text-sm font-medium text-muted-foreground">
            <button
              className={`flex items-center gap-2 px-5 py-2 pb-2 border-b-2 transition-colors ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent hover:text-foreground'}`}
              style={{ minWidth: '120px' }}
              onClick={() => setActiveTab('info')}
            >
              <Info className="w-4 h-4" /> Info
            </button>
            <button
              className={`flex items-center gap-2 px-5 py-2 pb-2 border-b-2 transition-colors ${activeTab === 'dominios' ? 'border-primary text-primary' : 'border-transparent hover:text-foreground'}`}
              style={{ minWidth: '120px' }}
              onClick={() => setActiveTab('dominios')}
            >
              <Globe className="w-4 h-4" /> Domínios
            </button>
            <button
              className={`flex items-center gap-2 px-5 py-2 pb-2 border-b-2 transition-colors ${activeTab === 'widget' ? 'border-primary text-primary' : 'border-transparent hover:text-foreground'}`}
              style={{ minWidth: '120px' }}
              onClick={() => setActiveTab('widget')}
            >
              <Puzzle className="w-4 h-4" /> Widget
            </button>
            <button
              className={`flex items-center gap-2 px-5 py-2 pb-2 border-b-2 transition-colors ${activeTab === 'integrations' ? 'border-primary text-primary' : 'border-transparent hover:text-foreground'}`}
              style={{ minWidth: '120px' }}
              onClick={() => setActiveTab('integrations')}
            >
              <Layers className="w-4 h-4" /> Integrations
            </button>
            <button
              className={`flex items-center gap-2 px-5 py-2 pb-2 border-b-2 transition-colors ${activeTab === 'config' ? 'border-primary text-primary' : 'border-transparent hover:text-foreground'}`}
              style={{ minWidth: '120px' }}
              onClick={() => setActiveTab('config')}
            >
              <Settings className="w-4 h-4" /> Config
            </button>
          </nav>
        </div>

        {/* Conteúdo da aba ativa */}
        <div>
          {activeTab === 'info' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Informações da Collection</h2>
              {/* Conteúdo da aba Info */}
            </div>
          )}
          {activeTab === 'dominios' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Gerenciar Domínios</h2>
              <p>ID da Collection: <span className="font-mono">{collectionId}</span></p>
              {/* Conteúdo de domínios */}
            </div>
          )}
          {activeTab === 'widget' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Widget</h2>
              {/* Conteúdo do widget */}
            </div>
          )}
          {activeTab === 'integrations' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Integrações</h2>
              {/* Conteúdo das integrações */}
            </div>
          )}
          {activeTab === 'config' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Configurações</h2>
              {/* Conteúdo das configurações */}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
