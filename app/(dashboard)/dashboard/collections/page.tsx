"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight, Folders, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/client"

interface CollectionItem {
  id: string
  createdAt: number
  name: string
  domains: DomainItem[]
  isActive: boolean
  integrations: string[]
  apiKey: string
  apiKeyPreview: string
}

interface DomainItem {
  id: string
  domain: string
  isActive: boolean
  isVerified: boolean
}

interface ApiDomain {
  id: string
  domain?: string | null
  active?: boolean | null
  is_active?: boolean | null
  verified?: boolean | null
  is_verified?: boolean | null
}

interface ApiCollection {
  id: string
  name?: string | null
  api_key?: string | null
  is_active?: boolean | null
  created_at?: string | null
  domains?: Array<string | ApiDomain>
  integrations?: Array<string | { service?: string | null }>
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

function formatServiceName(service: string) {
  if (!service) return service
  return service.charAt(0).toUpperCase() + service.slice(1)
}

function maskApiKey(apiKey?: string | null) {
  if (!apiKey) return "Not available"
  if (apiKey.length <= 12) return apiKey
  return `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}`
}


function mapApiDomainToView(domain: ApiDomain): DomainItem | null {
  const domainName = domain.domain ?? ""
  if (!domainName) return null

  return {
    id: domain.id,
    domain: domainName,
    isActive: domain.is_active ?? domain.active ?? true,
    isVerified: domain.is_verified ?? domain.verified ?? false,
  }
}

function mapApiCollectionToView(collection: ApiCollection, fallbackOrder = 0): CollectionItem {
  const domains = Array.isArray(collection.domains)
    ? collection.domains
        .map((domain) => {
          if (typeof domain === "string") {
            return {
              id: `local-${domain}`,
              domain,
              isActive: true,
              isVerified: false,
            }
          }

          return mapApiDomainToView(domain)
        })
        .filter((domain): domain is DomainItem => Boolean(domain))
    : []

  const integrations = Array.isArray(collection.integrations)
    ? collection.integrations
        .map((integration) =>
          typeof integration === "string" ? integration : (integration.service ?? ""),
        )
        .filter(Boolean)
        .map(formatServiceName)
    : []

  const parsedCreatedAt = collection.created_at ? new Date(collection.created_at).getTime() : NaN

  return {
    id: collection.id,
    createdAt: Number.isFinite(parsedCreatedAt) ? parsedCreatedAt : Date.now() - fallbackOrder,
    name: collection.name || "Untitled collection",
    domains,
    isActive: collection.is_active ?? true,
    integrations,
    apiKey: collection.api_key ?? "",
    apiKeyPreview: maskApiKey(collection.api_key),
  }
}

export default function CollectionsPage() {
  const router = useRouter();
  const [collectionList, setCollectionList] = useState<CollectionItem[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [createCollectionError, setCreateCollectionError] = useState<string | null>(null);

  const sortedCollections = [...collectionList].sort(
    (firstCollection, secondCollection) => secondCollection.createdAt - firstCollection.createdAt,
  );

  useEffect(() => {
    let isMounted = true;
    const loadCollections = async () => {
      if (!apiBaseUrl) {
        if (isMounted) {
          setCollectionsError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.");
          setIsLoadingCollections(false);
        }
        return;
      }
      try {
        setIsLoadingCollections(true);
        setCollectionsError(null);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error("Authentication token not found.");
        }
        const response = await fetch(`${apiBaseUrl}/collections/`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!response.ok) {
          throw new Error(`Unable to load collections (${response.status}).`);
        }
        const payload = (await response.json()) as ApiCollection[];
        const mappedCollections = payload.map((collection, index) =>
          mapApiCollectionToView(collection, index),
        );
        if (isMounted) {
          setCollectionList(mappedCollections);
        }
      } catch (error) {
        if (isMounted) {
          setCollectionList([]);
          setCollectionsError(
            error instanceof Error
              ? error.message
              : "An unexpected error happened while loading collections."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingCollections(false);
        }
      }
    };
    loadCollections();
    return () => {
      isMounted = false;
    };
  }, []);
  // Função handleCreateCollection duplicada e bloco de renderização solto removidos
//render

  // Funções não utilizadas e referências removidas
  const handleCreateCollection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newCollectionName.trim();
    if (!name || isCreatingCollection) return;
    if (!apiBaseUrl) {
      setCreateCollectionError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.");
      return;
    }
    try {
      setIsCreatingCollection(true);
      setCreateCollectionError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Authentication token not found.");
      }
      const response = await fetch(`${apiBaseUrl}/collections/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        let message = `Unable to create collection (${response.status}).`;
        try {
          const errorPayload = (await response.json()) as { detail?: string };
          if (typeof errorPayload.detail === "string" && errorPayload.detail) {
            message = errorPayload.detail;
          }
        } catch {
          message = `Unable to create collection (${response.status}).`;
        }
        throw new Error(message);
      }
      const createdCollection = (await response.json()) as ApiCollection;
      const mappedCreatedCollection = mapApiCollectionToView(createdCollection);
      setCollectionList((current) => [mappedCreatedCollection, ...current]);
      setNewCollectionName("");
      setIsCreateOpen(false);
    } catch (error) {
      setCreateCollectionError(
        error instanceof Error
          ? error.message
          : "An unexpected error happened while creating the collection."
      );
    } finally {
      setIsCreatingCollection(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mt-16 mb-8 flex max-w-5xl flex-col gap-4 md:flex-row md:items-start md:justify-between pl-2 sm:pl-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Collections</h1>
          <p className="text-muted-foreground mt-2">
            Organize domains and integrations for each collection.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:items-center">
          <Dialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) {
                setCreateCollectionError(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create collection</DialogTitle>
                <DialogDescription>
                  Create a collection to group allowed domains and integrations.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Collection name</label>
                  <Input
                    value={newCollectionName}
                    onChange={(event) => setNewCollectionName(event.target.value)}
                    placeholder="Ex: Product Team"
                    autoFocus
                    disabled={isCreatingCollection}
                  />
                </div>
                {createCollectionError && (
                  <p className="text-sm text-destructive">{createCollectionError}</p>
                )}
                <DialogFooter>
                  <Button type="submit" disabled={!newCollectionName.trim() || isCreatingCollection}>
                    {isCreatingCollection ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="max-w-5xl flex-1 space-y-4">
          {isLoadingCollections && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-border p-8"
                  style={{ minHeight: 120 }}
                >
                  <div className="mb-2">
                    <Skeleton className="h-6 w-52 mb-1" />
                    <Skeleton className="h-4 w-64 mb-4" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-32 rounded-md" />
                    <Skeleton className="h-8 w-28 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {sortedCollections.map((collection) => (
            <Card
              key={collection.id}
              className="bg-white rounded-xl border border-border p-8 cursor-pointer transition-colors hover:bg-muted"
              onClick={() => router.push(`/dashboard/collections/${collection.id}`)}
            >
              <div className="mb-2">
                <CardTitle className="text-xl mb-1">{collection.name}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4">Coleção de domínios e integrações</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={collection.isActive ? "secondary" : "outline"}>
                    {collection.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              
              </div>
            </Card>
          ))}
          {!isLoadingCollections && sortedCollections.length === 0 && (
            <div className="pt-6">
              <Empty className="border border-dashed bg-card">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Folders className="h-5 w-5" />
                  </EmptyMedia>
                  <EmptyTitle>No collections found</EmptyTitle>
                  <EmptyDescription>
                    {collectionsError ||
                      "Create your first collection to configure domains and integrations."}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Create collection
                  </Button>
                </EmptyContent>
              </Empty>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

