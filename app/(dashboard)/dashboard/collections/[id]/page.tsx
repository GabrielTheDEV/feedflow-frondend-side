"use client"

import { Trash2 } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from '@/components/ui/dialog'

import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { Globe, Puzzle, Layers, Settings, Info, Power } from 'lucide-react'
import { LoopSpinner } from '@/components/ui/loop-spinner'

export default function CollectionManagerPage() {
          const [domainLoading, setDomainLoading] = useState<{ [id: string]: 'toggle' | 'delete' | null }>({});
        const [newDomain, setNewDomain] = useState("");
        const [isAddingDomain, setIsAddingDomain] = useState(false);
        const [addDomainError, setAddDomainError] = useState<string | null>(null);
      const [domains, setDomains] = useState<any[]>([]);
      const [domainsLoading, setDomainsLoading] = useState(false);
      const [deleteDomainModal, setDeleteDomainModal] = useState<{ open: boolean, domainId?: string } | null>(null);
      const [isDeletingDomain, setIsDeletingDomain] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const collectionId = params?.id;
  const [activeTab, setActiveTab] = useState('info');
  const [collection, setCollection] = useState<any>(null);
  const [isTogglingToken, setIsTogglingToken] = useState(false);
    // Função para ativar/desativar token (status da collection)
    async function handleToggleToken() {
      if (!apiBaseUrl || !collectionId) return;
      setIsTogglingToken(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const action = (collection?.is_active ?? collection?.isActive) ? 'deactivate' : 'activate';
        const res = await fetch(`${apiBaseUrl}/collections/${collectionId}/${action}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCollection((prev: any) => ({ ...prev, ...data }));
        }
      } finally {
        setIsTogglingToken(false);
      }
    }
  const [collectionLoading, setCollectionLoading] = useState(true);  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (activeTab !== 'dominios' || !collectionId || !apiBaseUrl) return;
    setDomainsLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.access_token) return setDomainsLoading(false);
      fetch(`${apiBaseUrl}/domains/${collectionId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => setDomains(Array.isArray(data) ? data : []))
        .finally(() => setDomainsLoading(false));
    });
  }, [activeTab, collectionId, apiBaseUrl]);

  useEffect(() => {
    async function fetchCollection(id: string) {
      if (!apiBaseUrl || !id) return;
      setCollectionLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) return;
        const res = await fetch(`${apiBaseUrl}/collections/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) {
          setCollection(null);
          setCollectionLoading(false);
          console.log('API response not ok:', res.status);
          return;
        }

        const data = await res.json();
        setCollection(data);
      } catch (err) {
        setCollection(null);
        console.log('Collection fetch error:', err);
      }
      
      setCollectionLoading(false);
    }
    if (collectionId) fetchCollection(collectionId as string);
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
          {collectionLoading || !collection?.name ? (
            <LoopSpinner size={28} color="var(--primary)" />
          ) : collection.name}
        </h1>
        {/* O LoopSpinner já cobre o estado de carregamento, bloco de debug removido */}

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
              <Card className="max-w-xl mb-6">
                <CardContent className="py-6 px-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{collection?.name || <LoopSpinner size={20} color="var(--primary)" />}</span>
                      <Badge variant={collection?.is_active ?? collection?.isActive ? 'secondary' : 'outline'}>
                        {(collection?.is_active ?? collection?.isActive) ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold">ID:</span> <span className="font-mono">{collectionId}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold">Status:</span> {(collection?.is_active ?? collection?.isActive) ? 'Ativo' : 'Inativo'}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold">Token (API Key):</span>
                      <Input
                        value={collection?.api_key || collection?.apiKey || ''}
                        readOnly
                        className="font-mono"
                        style={{ maxWidth: 340 }}
                      />
                    </div>
                    {/* Refresh token se existir */}
                    {collection?.refresh_token && (
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold">Refresh Token:</span>
                        <Input
                          value={collection.refresh_token}
                          readOnly
                          className="font-mono"
                          style={{ maxWidth: 340 }}
                        />
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={(collection?.is_active ?? collection?.isActive) ? 'destructive' : 'secondary'}
                        onClick={handleToggleToken}
                        disabled={isTogglingToken}
                      >
                        <Power className="h-4 w-4 mr-1" />
                        {(collection?.is_active ?? collection?.isActive) ? 'Desativar Token' : 'Ativar Token'}
                        <span className="inline-flex items-center gap-2 text-muted-foreground ml-2">
                          <span
                            className={`h-1 w-1 rounded-full ${
                              (collection?.is_active ?? collection?.isActive)
                                ? 'bg-emerald-500'
                                : 'bg-destructive'
                            }`}
                          />
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === 'dominios' && (
            <div>
              <Card className="max-w-xl mb-6"> 
                <CardContent className="py-6 px-6">
                  <h2 className="text-2xl font-bold mb-4">Domain Whitelist</h2>
                  <p className="text-muted-foreground mb-6">Specify which domains can use your widget</p>
                  <form
                    className="flex gap-2 items-center"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAddDomainError(null);
                      const domain = newDomain.trim();
                      if (!domain || !collectionId || !apiBaseUrl) return;
                      setIsAddingDomain(true);
                      try {
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session?.access_token) throw new Error("No session");
                        const res = await fetch(`${apiBaseUrl}/domains/${collectionId}`, {
                          method: 'POST',
                          headers: {
                            Authorization: `Bearer ${session.access_token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ domain }),
                        });
                        if (!res.ok) {
                          let msg = 'Failed to add domain.';
                          try {
                            const err = await res.json();
                            if (err && err.detail) msg = err.detail;
                          } catch {}
                          throw new Error(msg);
                        }
                        setNewDomain("");
                        // Atualiza lista
                        fetch(`${apiBaseUrl}/domains/${collectionId}`, {
                          headers: { Authorization: `Bearer ${session.access_token}` },
                        })
                          .then(res => res.ok ? res.json() : [])
                          .then(data => setDomains(Array.isArray(data) ? data : []));
                      } catch (err: any) {
                        setAddDomainError(err?.message || 'Failed to add domain.');
                      } finally {
                        setIsAddingDomain(false);
                      }
                    }}
                  >
                    {isAddingDomain && (
                      <span className="pl-1"><LoopSpinner size={22} color="var(--primary)" /></span>
                    )}
                    <Input
                      placeholder="example.com"
                      className="flex-1"
                      value={newDomain}
                      onChange={e => setNewDomain(e.target.value)}
                      disabled={isAddingDomain}
                    />
                    <Button
                      type="submit"
                      className="whitespace-nowrap"
                      disabled={isAddingDomain || !newDomain.trim()}
                    >
                      {isAddingDomain ? 'Adding...' : 'Add Domain'}
                    </Button>
                  </form>
                  {addDomainError && (
                    <div className="text-destructive text-xs mt-2">{addDomainError}</div>
                  )}
                </CardContent>
              </Card>
              <div className="space-y-2 max-w-xl">
                {domainsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoopSpinner size={32} color="var(--primary)" />
                  </div>
                ) : domains.length === 0 ? (
                  <div className="text-muted-foreground text-sm">No domains registered.</div>
                ) : (
                  domains.map(domain => (
                    <Card key={domain.id} className="p-4">
                      <div className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:gap-6 sm:justify-center">
                        <span className="text-base flex items-center gap-2">
                          {domainLoading[domain.id] && <LoopSpinner size={18} color="var(--primary)" />}
                          <span className="font-bold">Domain:</span> {domain.domain}
                        </span>
                        <span className="text-xs text-muted-foreground">Status: {domain.is_active ? 'Active' : 'Inactive'}</span>
                        <span className="text-xs text-muted-foreground">Verified: {domain.is_verified ? 'Yes' : 'No'}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            title={domain.is_active ? 'Deactivate' : 'Activate'}
                            disabled={!!domainLoading[domain.id]}
                            onClick={async () => {
                              if (!apiBaseUrl || !domain.id) return;
                              const action = domain.is_active ? 'deactivate' : 'activate';
                              setDomainLoading((prev) => ({ ...prev, [domain.id]: 'toggle' }));
                              const { data: { session } } = await supabase.auth.getSession();
                              if (!session?.access_token) {
                                setDomainLoading((prev) => ({ ...prev, [domain.id]: null }));
                                return;
                              }
                              await fetch(`${apiBaseUrl}/domains/${domain.id}/${action}`, {
                                method: 'PATCH',
                                headers: { Authorization: `Bearer ${session.access_token}` },
                              });
                              // Atualiza lista
                              fetch(`${apiBaseUrl}/domains/${collectionId}`, {
                                headers: { Authorization: `Bearer ${session.access_token}` },
                              })
                                .then(res => res.ok ? res.json() : [])
                                .then(data => setDomains(Array.isArray(data) ? data : []))
                                .finally(() => setDomainLoading((prev) => ({ ...prev, [domain.id]: null })));
                            }}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Delete"
                            disabled={!!domainLoading[domain.id]}
                            onClick={() => setDeleteDomainModal({ open: true, domainId: domain.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
              {/* Modal de confirmação de delete de domínio */}
              <Dialog open={!!deleteDomainModal?.open} onOpenChange={open => setDeleteDomainModal(open ? deleteDomainModal : null)}>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>Remove Domain</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Are you sure you want to remove this domain? Please make sure there are no widgets currently using this domain. This action cannot be undone.
                  </DialogDescription>
                  <DialogFooter className="flex gap-2 justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDomainModal(null)}
                      disabled={isDeletingDomain}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (!apiBaseUrl || !deleteDomainModal?.domainId) return;
                        setIsDeletingDomain(true);
                        setDomainLoading((prev) => ({ ...prev, [deleteDomainModal.domainId!]: 'delete' }));
                        try {
                          const { data: { session } } = await supabase.auth.getSession();
                          if (!session?.access_token) return;
                          const res = await fetch(`${apiBaseUrl}/domains/${deleteDomainModal.domainId}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${session.access_token}` },
                          });
                          if (res.status === 204) {
                            setDeleteDomainModal(null);
                            // Atualiza lista
                            fetch(`${apiBaseUrl}/domains/${collectionId}`, {
                              headers: { Authorization: `Bearer ${session.access_token}` },
                            })
                              .then(res => res.ok ? res.json() : [])
                              .then(data => setDomains(Array.isArray(data) ? data : []));
                          }
                        } finally {
                          setIsDeletingDomain(false);
                          setDomainLoading((prev) => ({ ...prev, [deleteDomainModal.domainId!]: null }));
                        }
                      }}
                      disabled={isDeletingDomain}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
              <Button
                variant="destructive"
                onClick={() => setDeleteModalOpen(true)}
                className="mt-2"
              >
                Delete Collection
              </Button>
              <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>Delete Collection</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Are you sure you want to delete this collection? This action is <span className="font-bold text-destructive">permanent</span> and cannot be undone.
                  </DialogDescription>
                  <DialogFooter className="flex gap-2 justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteModalOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (!apiBaseUrl || !collectionId) return;
                        setIsDeleting(true);
                        try {
                          const { data: { session } } = await supabase.auth.getSession();
                          if (!session?.access_token) return;
                          const res = await fetch(`${apiBaseUrl}/collections/${collectionId}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${session.access_token}` },
                          });
                          if (res.status === 204) {
                            setDeleteModalOpen(false);
                            router.push('/dashboard/collections');
                          }
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
