"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"


const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
const apiProdBaseUrl = process.env.NEXT_PUBLIC_API_URL_PROD

// Utilitário para decidir qual base usar para endpoints específicos
function getApiUrl(endpoint: string) {
  // Endpoints que devem ir para produção
  if (
    apiProdBaseUrl &&
    (
      endpoint.startsWith("/integrations/") &&
      (
        /\/oauth\/.+\/authorize/.test(endpoint) || // authorize
        /^\/integrations\/[^/]+$/.test(endpoint)   // context (list)
      )
    )
  ) {
    return apiProdBaseUrl + endpoint
  }
  return apiBaseUrl + endpoint
}

interface ApiCollection {
  id: string
  name?: string | null
}

interface ApiIntegration {
  id: string
  service: string
  collection_id?: string
}

type Provider = "slack" | "jira" | "trello"

interface IntegrationDef {
  provider: Provider
  label: string
  description: string
  iconBg: string
  icon: React.ReactNode
}

const INTEGRATIONS: IntegrationDef[] = [
  {
    provider: "slack",
    label: "Slack",
    description: "Get instant notifications when users report bugs.",
    iconBg: "bg-[#4A154B]",
    icon: (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 122.8 122.8">
        <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A"/>
        <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0"/>
        <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D"/>
        <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E"/>
      </svg>
    ),
  },
  {
    provider: "jira",
    label: "Jira",
    description: "Turn incoming feedback into Jira issues automatically.",
    iconBg: "bg-[#0052CC]",
    icon: (
      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.537 11.176h-.006c-1.196 0-2.168.972-2.168 2.168v7.292a1.902 1.902 0 0 0 3.249 1.345 1.889 1.889 0 0 0 .55-1.345v-7.292c0-1.196-.972-2.168-2.168-2.168Zm0-9.812c-1.196 0-2.168.972-2.168 2.168v7.292c0 1.196.972 2.168 2.168 2.168h.006a2.168 2.168 0 0 0 2.168-2.168V3.532c0-1.196-.972-2.168-2.168-2.168h-.006Zm7.29 7.999h-7.293c-1.196 0-2.168.972-2.168 2.168v.006c0 1.196.972 2.168 2.168 2.168h7.293a1.902 1.902 0 0 0 1.345-3.249 1.889 1.889 0 0 0-1.345-.55Zm-9.818 0H1.716a1.902 1.902 0 1 0 0 3.804h7.293a2.168 2.168 0 0 0 2.168-2.168v-.006a2.168 2.168 0 0 0-2.168-2.168Z" />
      </svg>
    ),
  },
  {
    provider: "trello",
    label: "Trello",
    description: "Send user reports to Trello boards and lists.",
    iconBg: "bg-[#0052CC]",
    icon: (
      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.5 4.75A2.25 2.25 0 0 1 4.75 2.5h14.5a2.25 2.25 0 0 1 2.25 2.25v14.5a2.25 2.25 0 0 1-2.25 2.25H4.75A2.25 2.25 0 0 1 2.5 19.25V4.75Zm4.25 1.5a.75.75 0 0 0-.75.75v5.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-5.5a.75.75 0 0 0-.75-.75h-3.5Zm0 8a.75.75 0 0 0-.75.75v2c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 0-.75-.75h-3.5Zm7-8a.75.75 0 0 0-.75.75v10c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75h-3.5Z" />
      </svg>
    ),
  },
]

export default function IntegrationsPage() {
  const [collections, setCollections] = useState<ApiCollection[]>([])
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("")
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false)
  const [connectingProvider, setConnectingProvider] = useState<Provider | null>(null)
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const getAccessToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) throw new Error("Authentication token not found.")
    return session.access_token
  }

  // Load collections on mount
  useEffect(() => {
    const loadCollections = async () => {
      if (!apiBaseUrl) return
      try {
        const token = await getAccessToken()
        const res = await fetch(`${apiBaseUrl}/collections/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error()
        const data = (await res.json()) as ApiCollection[]
        setCollections(data)
        if (data.length > 0) setSelectedCollectionId(data[0].id)
      } catch {
        // silently fail — no collections to show
      } finally {
        setIsLoadingCollections(false)
      }
    }
    loadCollections()
  }, [])

  // Load integrations when collection changes
  useEffect(() => {
    if (!selectedCollectionId || !apiBaseUrl) return


    const loadIntegrations = async () => {
      try {
        setIsLoadingIntegrations(true)
        setActionError(null)
        const token = await getAccessToken()
        const url = getApiUrl(`/integrations/${selectedCollectionId}`)
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error(`Unable to load integrations (${res.status}).`)
        const data = (await res.json()) as ApiIntegration[]
        setIntegrations(data)
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "Failed to load integrations.")
        setIntegrations([])
      } finally {
        setIsLoadingIntegrations(false)
      }
    }

    loadIntegrations()
  }, [selectedCollectionId])

  const handleConnect = async (provider: Provider) => {
    if (!selectedCollectionId || !apiBaseUrl || connectingProvider) return
    try {
      setConnectingProvider(provider)
      setActionError(null)
      const token = await getAccessToken()

      // Use redirect=false to get the URL, então navega
      const url = getApiUrl(`/integrations/${selectedCollectionId}/oauth/${provider}/authorize?redirect=false`)
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        throw new Error(`Unable to start ${provider} authorization (${res.status}).`)
      }

      const { authorization_url } = (await res.json()) as { authorization_url: string }
      if (!authorization_url) throw new Error("No authorization URL returned.")

      window.location.href = authorization_url
    } catch (err) {
      setActionError(err instanceof Error ? err.message : `Failed to connect ${provider}.`)
      setConnectingProvider(null)
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    if (!selectedCollectionId || !apiBaseUrl || disconnectingId) return
    try {
      setDisconnectingId(integrationId)
      setActionError(null)
      const token = await getAccessToken()
      const res = await fetch(
        `${apiBaseUrl}/integrations/${selectedCollectionId}/${integrationId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      )
      if (!res.ok && res.status !== 204) {
        throw new Error(`Unable to remove integration (${res.status}).`)
      }
      setIntegrations((current) => current.filter((i) => i.id !== integrationId))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to disconnect integration.")
    } finally {
      setDisconnectingId(null)
    }
  }

  const getConnectedIntegration = (provider: Provider) =>
    integrations.find((i) => i.service.toLowerCase() === provider)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex max-w-5xl flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect FeedFlow with your favorite tools.
          </p>
        </div>

        <div className="w-full md:w-64">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Collection</label>
          {isLoadingCollections ? (
            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
          ) : collections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No collections found.</p>
          ) : (
            <Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.name ?? "Untitled collection"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {actionError && (
        <p className="mb-6 max-w-5xl text-sm text-destructive">{actionError}</p>
      )}

      <div className="grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((def) => {
          const connected = getConnectedIntegration(def.provider)
          const isConnecting = connectingProvider === def.provider
          const isDisconnecting = disconnectingId === connected?.id

          return (
            <Card key={def.provider} className="py-0">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground">{def.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{def.description}</p>
                  </div>
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${def.iconBg}`}
                  >
                    {def.icon}
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {isLoadingIntegrations
                      ? "Loading..."
                      : connected
                        ? "Connected"
                        : "Not connected"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isDisconnecting || !selectedCollectionId}
                      onClick={() => handleDisconnect(connected.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDisconnecting ? "Removing..." : "Disconnect"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={isConnecting || !selectedCollectionId || isLoadingCollections}
                      onClick={() => handleConnect(def.provider)}
                    >
                      {isConnecting ? "Redirecting..." : `Connect ${def.label}`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
