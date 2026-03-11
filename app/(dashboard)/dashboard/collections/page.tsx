"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight, Copy, Folders, Github, Plus, Power, RotateCw, Slack, Trash2, Trello, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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

function getIntegrationIcon(integration: string) {
  const normalized = integration.toLowerCase()

  if (normalized === "slack") {
    return <Slack className="h-4 w-4" />
  }

  if (normalized === "github") {
    return <Github className="h-4 w-4" />
  }

  if (normalized === "trello") {
    return <Trello className="h-4 w-4" />
  }

  if (normalized === "jira") {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-secondary text-[10px] font-semibold leading-none">
        J
      </span>
    )
  }

  return null
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
    const [loading, setLoading] = useState(true);
  const [collectionList, setCollectionList] = useState<CollectionItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)
  const [collectionsError, setCollectionsError] = useState<string | null>(null)
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  const [createCollectionError, setCreateCollectionError] = useState<string | null>(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const [editingCollectionName, setEditingCollectionName] = useState("")
  const [newDomain, setNewDomain] = useState("")
  const [isAddingDomain, setIsAddingDomain] = useState(false)
  const [domainUpdatingId, setDomainUpdatingId] = useState<string | null>(null)
  const [domainActionError, setDomainActionError] = useState<string | null>(null)
  const [isIntegrationPickerOpen, setIsIntegrationPickerOpen] = useState(false)
  const [isRotatingApiKey, setIsRotatingApiKey] = useState(false)
  const [apiKeyActionError, setApiKeyActionError] = useState<string | null>(null)
  const [isUpdatingCollectionStatus, setIsUpdatingCollectionStatus] = useState(false)
  const [collectionStatusError, setCollectionStatusError] = useState<string | null>(null)
  const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false)
  const [isDeletingCollection, setIsDeletingCollection] = useState(false)
  const [deleteCollectionError, setDeleteCollectionError] = useState<string | null>(null)

  const sortedCollections = [...collectionList].sort(
    (firstCollection, secondCollection) => secondCollection.createdAt - firstCollection.createdAt,
  )

  const selectedCollection = collectionList.find(
    (collection) => collection.id === selectedCollectionId,
  )

  useEffect(() => {
    let isMounted = true

    const loadCollections = async () => {
      if (!apiBaseUrl) {
        if (isMounted) {
          setCollectionsError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.")
          setIsLoadingCollections(false)
        }
        return
      }

      try {
        setIsLoadingCollections(true)
        setLoading(true)
        setCollectionsError(null)

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.access_token) {
          throw new Error("Authentication token not found.")
        }

        const response = await fetch(`${apiBaseUrl}/collections/`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Unable to load collections (${response.status}).`)
        }

        const payload = (await response.json()) as ApiCollection[]

        const mappedCollections = payload.map((collection, index) =>
          mapApiCollectionToView(collection, index),
        )

        if (isMounted) {
          setCollectionList(mappedCollections)
          setLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          setCollectionList([])
          setCollectionsError(
            error instanceof Error
              ? error.message
              : "An unexpected error happened while loading collections.",
          )
          setLoading(false)
        }
      } finally {
        if (isMounted) {
          setIsLoadingCollections(false)
        }
      }
    }

    loadCollections()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl border border-border p-8">
              <Skeleton className="h-6 w-52 mb-2" />
              <Skeleton className="h-4 w-80 max-w-full mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleCopy = async (collectionId: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopiedId(collectionId)
    setTimeout(() => {
      setCopiedId((current) => (current === collectionId ? null : current))
    }, 1500)
  }

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error("Authentication token not found.")
    }

    return session.access_token
  }

  const updateCollectionDomains = (
    collectionId: string,
    updater: (domains: DomainItem[]) => DomainItem[],
  ) => {
    setCollectionList((current) =>
      current.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              domains: updater(collection.domains),
            }
          : collection,
      ),
    )
  }

  const fetchCollectionDomains = async (collectionId: string) => {
    if (!apiBaseUrl) return

    const accessToken = await getAccessToken()
    const response = await fetch(`${apiBaseUrl}/domains/${collectionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Unable to load domains (${response.status}).`)
    }

    const payload = (await response.json()) as ApiDomain[]
    const mappedDomains = payload
      .map(mapApiDomainToView)
      .filter((domain): domain is DomainItem => Boolean(domain))

    updateCollectionDomains(collectionId, () => mappedDomains)
  }

  const handleCreateCollection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = newCollectionName.trim()

    if (!name || isCreatingCollection) return

    if (!apiBaseUrl) {
      setCreateCollectionError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.")
      return
    }

    try {
      setIsCreatingCollection(true)
      setCreateCollectionError(null)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error("Authentication token not found.")
      }

      const response = await fetch(`${apiBaseUrl}/collections/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        let message = `Unable to create collection (${response.status}).`
        try {
          const errorPayload = (await response.json()) as { detail?: string }
          if (typeof errorPayload.detail === "string" && errorPayload.detail) {
            message = errorPayload.detail
          }
        } catch {
          message = `Unable to create collection (${response.status}).`
        }
        throw new Error(message)
      }

      const createdCollection = (await response.json()) as ApiCollection
      const mappedCreatedCollection = mapApiCollectionToView(createdCollection)

      setCollectionList((current) => [mappedCreatedCollection, ...current])
      setNewCollectionName("")
      setIsCreateOpen(false)
    } catch (error) {
      setCreateCollectionError(
        error instanceof Error
          ? error.message
          : "An unexpected error happened while creating the collection.",
      )
    } finally {
      setIsCreatingCollection(false)
    }
  }

  const handleOpenCollection = async (collection: CollectionItem) => {
    setSelectedCollectionId(collection.id)
    setEditingCollectionName(collection.name)
    setNewDomain("")
    setDomainActionError(null)
    setApiKeyActionError(null)

    try {
      await fetchCollectionDomains(collection.id)
    } catch (error) {
      setDomainActionError(
        error instanceof Error
          ? error.message
          : "An unexpected error happened while loading domains.",
      )
    }
  }

  const handleUpdateCollectionName = () => {
    const name = editingCollectionName.trim()
    if (!selectedCollectionId || !name) return

    setCollectionList((current) =>
      current.map((collection) =>
        collection.id === selectedCollectionId ? { ...collection, name } : collection,
      ),
    )
  }

  const handleAddDomain = async () => {
    const domain = newDomain.trim()
    if (!selectedCollectionId || !domain || isAddingDomain) return
    if (!apiBaseUrl) {
      setDomainActionError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.")
      return
    }

    try {
      setIsAddingDomain(true)
      setDomainActionError(null)

      const accessToken = await getAccessToken()
      const response = await fetch(`${apiBaseUrl}/domains/${selectedCollectionId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      })

      if (!response.ok) {
        throw new Error(`Unable to add domain (${response.status}).`)
      }

      const createdDomain = mapApiDomainToView((await response.json()) as ApiDomain)
      if (!createdDomain) {
        throw new Error("Invalid domain payload from API.")
      }

      updateCollectionDomains(selectedCollectionId, (domains) => [...domains, createdDomain])
      setNewDomain("")
    } catch (error) {
      setDomainActionError(
        error instanceof Error
          ? error.message
          : "An unexpected error happened while adding the domain.",
      )
    } finally {
      setIsAddingDomain(false)
    }
  }

  const handleRemoveDomain = async (domainId: string) => {
    if (!selectedCollectionId || !domainId) return
    if (!apiBaseUrl) {
      setDomainActionError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.")
      return
    }

    try {
      setDomainUpdatingId(domainId)
      setDomainActionError(null)

      const accessToken = await getAccessToken()
      const response = await fetch(`${apiBaseUrl}/domains/${domainId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok && response.status !== 204) {
        throw new Error(`Unable to remove domain (${response.status}).`)
      }

      updateCollectionDomains(selectedCollectionId, (domains) =>
        domains.filter((domainItem) => domainItem.id !== domainId),
      )
    } catch (error) {
      setDomainActionError(
        error instanceof Error
          ? error.message
          : "An unexpected error happened while removing the domain.",
      )
    } finally {
      setDomainUpdatingId(null)
    }
  }

  const handleToggleDomainActive = async (domain: DomainItem) => {
    if (!selectedCollectionId || !domain.id) return
    if (!apiBaseUrl) {
      setDomainActionError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.")
      return
    }

    try {
      setDomainUpdatingId(domain.id)
      setDomainActionError(null)

      const accessToken = await getAccessToken()
      const action = domain.isActive ? "deactivate" : "activate"
      const response = await fetch(`${apiBaseUrl}/domains/${domain.id}/${action}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Unable to update domain status (${response.status}).`)
      }

      const updatedDomain = mapApiDomainToView((await response.json()) as ApiDomain)
      if (!updatedDomain) {
        throw new Error("Invalid domain payload from API.")
      }

      updateCollectionDomains(selectedCollectionId, (domains) =>
        domains.map((domainItem) =>
          domainItem.id === updatedDomain.id ? updatedDomain : domainItem,
        ),
      )
    } catch (error) {
      setDomainActionError(
        error instanceof Error
          ? error.message
          : "An unexpected error happened while updating domain status.",
      )
    } finally {
      setDomainUpdatingId(null)
    }
  }

  const handleAddIntegration = (providerName: string) => {
    if (!selectedCollectionId) return

    setCollectionList((current) =>
      current.map((collection) => {
        if (collection.id !== selectedCollectionId) return collection

        const alreadyExists = collection.integrations.some(
          (integration) => integration.toLowerCase() === providerName.toLowerCase(),
        )

        if (alreadyExists) return collection

        return {
          ...collection,
          integrations: [...collection.integrations, providerName],
        }
      }),
    )

    setIsIntegrationPickerOpen(false)
  }

  const handleRemoveIntegration = (integrationName: string) => {
    if (!selectedCollectionId) return

    setCollectionList((current) =>
      current.map((collection) =>
        collection.id === selectedCollectionId
          ? {
              ...collection,
              integrations: collection.integrations.filter(
                (integration) => integration !== integrationName,
              ),
            }
          : collection,
      ),
    )
  }

  const clearSelectedCollection = () => {
    setSelectedCollectionId(null)
    setEditingCollectionName("")
    setNewDomain("")
    setIsIntegrationPickerOpen(false)
    setApiKeyActionError(null)
    setCollectionStatusError(null)
    setIsDeleteCollectionOpen(false)
    setDeleteCollectionError(null)
  }

  const handleToggleCollectionStatus = async () => {
    if (!selectedCollectionId || isUpdatingCollectionStatus) return
    if (!apiBaseUrl) {
      setCollectionStatusError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.")
      return
    }

    const currentCollection = collectionList.find((collection) => collection.id === selectedCollectionId)
    if (!currentCollection) return

    const action = currentCollection.isActive ? "deactivate" : "activate"

    try {
      setIsUpdatingCollectionStatus(true)
      setCollectionStatusError(null)

      const accessToken = await getAccessToken()
      const response = await fetch(`${apiBaseUrl}/collections/${selectedCollectionId}/${action}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Unable to ${action} collection (${response.status}).`)
      }

      const payload = (await response.json()) as ApiCollection
      const nextIsActive = payload.is_active ?? action === "activate"

      setCollectionList((current) =>
        current.map((collection) =>
          collection.id === selectedCollectionId
            ? { ...collection, isActive: nextIsActive }
            : collection,
        ),
      )
    } catch (error) {
      setCollectionStatusError(
        error instanceof Error
          ? error.message
          : "An unexpected error happened while updating collection status.",
      )
    } finally {
      setIsUpdatingCollectionStatus(false)
    }
  }

  const handleDeleteCollection = async () => {
    if (!selectedCollectionId || isDeletingCollection) return
    if (!apiBaseUrl) {
      setDeleteCollectionError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.")
      return
    }

    try {
      setIsDeletingCollection(true)
      setDeleteCollectionError(null)

      const accessToken = await getAccessToken()
      const response = await fetch(`${apiBaseUrl}/collections/${selectedCollectionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok && response.status !== 204) {
        throw new Error(`Unable to delete collection (${response.status}).`)
      }

      setCollectionList((current) =>
        current.filter((collection) => collection.id !== selectedCollectionId),
      )
      clearSelectedCollection()
    } catch (error) {
      setDeleteCollectionError(
        error instanceof Error
          ? error.message
          : "An unexpected error happened while deleting the collection.",
      )
    } finally {
      setIsDeletingCollection(false)
    }
  }

  const handleRotateApiKey = async () => {
    if (!selectedCollectionId || isRotatingApiKey) return
    if (!apiBaseUrl) {
      setApiKeyActionError("API URL is not configured. Please set NEXT_PUBLIC_API_URL.")
      return
    }

    try {
      setIsRotatingApiKey(true)
      setApiKeyActionError(null)

      const accessToken = await getAccessToken()
      const rotateKeyUrl = `${apiBaseUrl}/collections/${selectedCollectionId}/rotate-key`

      let response = await fetch(rotateKeyUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.status === 405) {
        response = await fetch(rotateKeyUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }

      if (!response.ok) {
        throw new Error(`Unable to rotate API key (${response.status}).`)
      }

      const payload = (await response.json()) as ApiCollection
      const nextApiKey = payload.api_key ?? ""

      if (!nextApiKey) {
        throw new Error("API did not return a new key.")
      }

      setCollectionList((current) =>
        current.map((collection) =>
          collection.id === selectedCollectionId
            ? {
                ...collection,
                apiKey: nextApiKey,
                apiKeyPreview: maskApiKey(nextApiKey),
              }
            : collection,
        ),
      )
    } catch (error) {
      setApiKeyActionError(
        error instanceof Error
          ? error.message
          : "An unexpected error happened while rotating API key.",
      )
    } finally {
      setIsRotatingApiKey(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex max-w-5xl flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
              setIsCreateOpen(open)
              if (!open) {
                setCreateCollectionError(null)
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

      <div
        className="flex flex-col gap-6 xl:flex-row"
        onClick={clearSelectedCollection}
      >
        <div className="max-w-5xl flex-1 space-y-4" onClick={(event) => event.stopPropagation()}>
          {isLoadingCollections && (
            <Card className="py-0">
              <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
                <p className="text-sm text-muted-foreground">Loading collections...</p>
              </CardContent>
            </Card>
          )}

          {sortedCollections.map((collection) => (
            <Card
              key={collection.id}
              className="cursor-pointer py-0 transition-colors hover:bg-muted"
              onClick={() => router.push(`/dashboard/collections/${collection.id}`)}
            >
              <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-xl">{collection.name}</CardTitle>
                    <CardDescription className="mt-1 text-sm wrap-break-word">
                      {collection.domains.length > 0
                        ? collection.domains.map((domain) => domain.domain).join(" • ")
                        : "No domains added yet"}
                    </CardDescription>
                  </div>

                  <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-55">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={collection.isActive ? "secondary" : "outline"}>
                        {collection.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {collection.integrations.length > 0 ? (
                        collection.integrations.map((integration) => (
                          <Badge key={integration} variant="outline">
                            {getIntegrationIcon(integration)}
                            {integration}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">No integrations</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-65">
                    <span className="text-sm text-muted-foreground">API Key</span>
                    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                      <Input
                        value={collection.apiKeyPreview}
                        readOnly
                        className="font-mono"
                        onClick={(event) => event.stopPropagation()}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        disabled={!collection.apiKey}
                        onClick={(event) => {
                          event.stopPropagation()
                          handleCopy(collection.id, collection.apiKey)
                        }}
                      >
                        <Copy className="h-4 w-4" />
                        {copiedId === collection.id ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 self-end text-muted-foreground lg:self-center" />
                </div>
              </CardContent>
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

        {selectedCollection && (
          <Card className="h-fit w-full xl:sticky xl:top-6 xl:w-lg" onClick={(event) => event.stopPropagation()}>
            <CardContent className="space-y-6 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedCollection.name}</h2>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Collection settings</p>
                  <p className="text-sm text-muted-foreground">
                    Configure domains, integrations and collection details.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close collection settings"
                  onClick={clearSelectedCollection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

    

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">API Key</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Token:</span>{" "}
                        {selectedCollection.apiKey ? `${selectedCollection.apiKey.slice(0, 6)}...` : "N/A"}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!selectedCollection.apiKey}
                          onClick={() => handleCopy(selectedCollection.id, selectedCollection.apiKey)}
                        >
                          <Copy className="h-4 w-4" />
                          Copy API key
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          aria-label="Rotate API key"
                          disabled={isRotatingApiKey}
                          onClick={handleRotateApiKey}
                        >
                          <RotateCw className={`h-4 w-4 ${isRotatingApiKey ? "animate-spin" : ""}`} />
                        </Button>
                      </div>
                    </div>
                    {apiKeyActionError && (
                      <p className="text-sm text-destructive">{apiKeyActionError}</p>
                    )}
                  </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Add domain</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    
                  <Input
                    value={newDomain}
                    onChange={(event) => setNewDomain(event.target.value)}
                    placeholder="example.com"
                  />
                  <Button
                    type="button"
                    onClick={handleAddDomain}
                    disabled={!newDomain.trim() || isAddingDomain}
                    className="sm:shrink-0"
                  >
                    {isAddingDomain ? "Adding..." : "Add domain"}
                  </Button>
                </div>

                {domainActionError && (
                  <p className="text-sm text-destructive">{domainActionError}</p>
                )}

                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground mt-8">Collection's domains</p>
                  {selectedCollection.domains.length > 0 ? (
                    selectedCollection.domains.map((domain) => (
                      <div
                        key={domain.domain}
                        className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="space-y-2">
                          <p className="text-sm text-foreground">
                            <span className="font-semibold">Domain:</span> {domain.domain}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold text-foreground">Status:</span>{" "}
                            <span className="inline-flex items-center gap-2 text-muted-foreground">
                              <span>{domain.isActive ? "Active" : "Desactive"}</span>
                              <span
                                className={`h-1 w-1 rounded-full ${
                                  domain.isActive
                                    ? "bg-emerald-500 animate-ping shadow-[0_0_10px_3px_rgba(16,185,129,0.75)]"
                                    : "bg-destructive"
                                }`}
                              />
                            </span>
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={domainUpdatingId === domain.id}
                            onClick={() => handleToggleDomainActive(domain)}
                          >
                            {domain.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            aria-label={`Remove ${domain.domain}`}
                            disabled={domainUpdatingId === domain.id}
                            onClick={() => handleRemoveDomain(domain.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No domains configured yet.</p>
                  )}
                </div>
                {collectionStatusError && (
                  <p className="text-sm text-destructive">{collectionStatusError}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">Integrations</p>
                  <Popover open={isIntegrationPickerOpen} onOpenChange={setIsIntegrationPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button type="button" size="sm">
                        <Plus className="h-4 w-4" />
                        Add integration
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-56 p-2">
                      <div className="space-y-1">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                          onClick={() => handleAddIntegration("Slack")}
                        >
                          <Slack className="h-4 w-4" />
                          <span>Slack</span>
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                          onClick={() => handleAddIntegration("GitHub")}
                        >
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                          onClick={() => handleAddIntegration("Jira")}
                        >
                          <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-secondary text-[10px] font-semibold">
                            J
                          </span>
                          <span>Jira</span>
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
                          onClick={() => handleAddIntegration("Trello")}
                        >
                          <Trello className="h-4 w-4" />
                          <span>Trello</span>
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCollection.integrations.length > 0 ? (
                    selectedCollection.integrations.map((integration) => (
                      <div key={integration} className="inline-flex items-center gap-1 rounded-md border px-2 py-1">
                        <span className="inline-flex items-center gap-1 text-xs text-foreground">
                          {getIntegrationIcon(integration)}
                          {integration}
                        </span>
                        <button
                          type="button"
                          aria-label={`Remove ${integration}`}
                          className="inline-flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveIntegration(integration)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No integrations configured.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Dialog
                  open={isDeleteCollectionOpen}
                  onOpenChange={(open) => {
                    setIsDeleteCollectionOpen(open)
                    if (!open) {
                      setDeleteCollectionError(null)
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Delete collection permanently?</DialogTitle>
                      <DialogDescription>
                        This action is permanent. The selected collection and all saved domains
                        from this collection will be deleted.
                      </DialogDescription>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                      Please confirm that this token is not currently in use before deleting the
                      collection.
                    </p>

                    {deleteCollectionError && (
                      <p className="text-sm text-destructive">{deleteCollectionError}</p>
                    )}

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDeleteCollectionOpen(false)}
                        disabled={isDeletingCollection}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteCollection}
                        disabled={isDeletingCollection}
                      >
                        {isDeletingCollection ? "Deleting..." : "Delete permanently"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button type="button" size="sm">
                  Save changes
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleToggleCollectionStatus}
                  disabled={isUpdatingCollectionStatus}
                >
                  <Power className="h-4 w-4" />
                  {selectedCollection.isActive ? "Active" : "Desactive"}
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <span
                      className={`h-1 w-1 rounded-full ${
                        selectedCollection.isActive
                          ? "bg-emerald-500"
                          : "bg-destructive"
                      }`}
                    />
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
