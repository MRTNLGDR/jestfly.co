"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, XIcon, MusicIcon, CalendarIcon, ShoppingBagIcon, Disc3Icon, Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
  id: string
  name: string
  type: string
  image?: string
  description: string
  url: string
}

interface SearchResults {
  artists?: SearchResult[]
  albums?: SearchResult[]
  events?: SearchResult[]
  merchandise?: SearchResult[]
}

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults>({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults({})
        return
      }

      setIsLoading(true)

      try {
        const typeParam = activeTab !== "all" ? `&type=${activeTab}` : ""
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}${typeParam}`)

        if (!response.ok) {
          throw new Error("Search failed")
        }

        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, activeTab])

  const handleSelect = (url: string) => {
    router.push(url)
    setIsOpen(false)
  }

  const getResultCount = () => {
    let count = 0
    if (results.artists) count += results.artists.length
    if (results.albums) count += results.albums.length
    if (results.events) count += results.events.length
    if (results.merchandise) count += results.merchandise.length
    return count
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "artist":
        return <MusicIcon className="h-4 w-4" />
      case "album":
        return <Disc3Icon className="h-4 w-4" />
      case "event":
        return <CalendarIcon className="h-4 w-4" />
      case "merchandise":
        return <ShoppingBagIcon className="h-4 w-4" />
      default:
        return <SearchIcon className="h-4 w-4" />
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-between border-white/20 hover:border-white/40 text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center">
          <SearchIcon className="mr-2 h-4 w-4" />
          <span>Search...</span>
        </div>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-xs font-medium sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div
            ref={dialogRef}
            className="fixed left-[50%] top-[20%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-background border border-white/10 rounded-lg shadow-lg"
          >
            <div className="flex items-center border-b border-white/10 p-4">
              <SearchIcon className="h-5 w-5 mr-2 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for artists, albums, events, merchandise..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-white/10">
                <TabsList className="bg-transparent h-12 px-4">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white/5">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="artists" className="data-[state=active]:bg-white/5">
                    Artists
                  </TabsTrigger>
                  <TabsTrigger value="albums" className="data-[state=active]:bg-white/5">
                    Albums
                  </TabsTrigger>
                  <TabsTrigger value="events" className="data-[state=active]:bg-white/5">
                    Events
                  </TabsTrigger>
                  <TabsTrigger value="merchandise" className="data-[state=active]:bg-white/5">
                    Merch
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-0">
                <TabsContent value="all" className="m-0">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : query.trim() === "" ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Start typing to search...</p>
                    </div>
                  ) : getResultCount() === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No results found for "{query}"</p>
                    </div>
                  ) : (
                    <div>
                      {results.artists && results.artists.length > 0 && (
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Artists</h3>
                          <div className="space-y-1">
                            {results.artists.map((result) => (
                              <button
                                key={result.id}
                                className="w-full flex items-center p-2 rounded-md hover:bg-white/5 transition-colors text-left"
                                onClick={() => handleSelect(result.url)}
                              >
                                <div className="relative h-8 w-8 rounded-md overflow-hidden mr-3">
                                  {result.image ? (
                                    <Image
                                      src={result.image || "/placeholder.svg"}
                                      alt={result.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-white/10 flex items-center justify-center">
                                      <MusicIcon className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{result.name}</p>
                                  <p className="text-xs text-muted-foreground">{result.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.albums && results.albums.length > 0 && (
                        <div className="p-4 border-t border-white/10">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Albums</h3>
                          <div className="space-y-1">
                            {results.albums.map((result) => (
                              <button
                                key={result.id}
                                className="w-full flex items-center p-2 rounded-md hover:bg-white/5 transition-colors text-left"
                                onClick={() => handleSelect(result.url)}
                              >
                                <div className="relative h-8 w-8 rounded-md overflow-hidden mr-3">
                                  {result.image ? (
                                    <Image
                                      src={result.image || "/placeholder.svg"}
                                      alt={result.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-white/10 flex items-center justify-center">
                                      <Disc3Icon className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{result.name}</p>
                                  <p className="text-xs text-muted-foreground">{result.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.events && results.events.length > 0 && (
                        <div className="p-4 border-t border-white/10">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Events</h3>
                          <div className="space-y-1">
                            {results.events.map((result) => (
                              <button
                                key={result.id}
                                className="w-full flex items-center p-2 rounded-md hover:bg-white/5 transition-colors text-left"
                                onClick={() => handleSelect(result.url)}
                              >
                                <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center mr-3">
                                  <CalendarIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{result.name}</p>
                                  <p className="text-xs text-muted-foreground">{result.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.merchandise && results.merchandise.length > 0 && (
                        <div className="p-4 border-t border-white/10">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Merchandise</h3>
                          <div className="space-y-1">
                            {results.merchandise.map((result) => (
                              <button
                                key={result.id}
                                className="w-full flex items-center p-2 rounded-md hover:bg-white/5 transition-colors text-left"
                                onClick={() => handleSelect(result.url)}
                              >
                                <div className="relative h-8 w-8 rounded-md overflow-hidden mr-3">
                                  {result.image ? (
                                    <Image
                                      src={result.image || "/placeholder.svg"}
                                      alt={result.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-white/10 flex items-center justify-center">
                                      <ShoppingBagIcon className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{result.name}</p>
                                  <p className="text-xs text-muted-foreground">{result.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="artists" className="m-0">
                  {/* Similar content structure as "all" tab but filtered for artists */}
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : query.trim() === "" ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <MusicIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Search for artists...</p>
                    </div>
                  ) : !results.artists || results.artists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <MusicIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No artists found for "{query}"</p>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="space-y-1">
                        {results.artists.map((result) => (
                          <button
                            key={result.id}
                            className="w-full flex items-center p-2 rounded-md hover:bg-white/5 transition-colors text-left"
                            onClick={() => handleSelect(result.url)}
                          >
                            <div className="relative h-8 w-8 rounded-md overflow-hidden mr-3">
                              {result.image ? (
                                <Image
                                  src={result.image || "/placeholder.svg"}
                                  alt={result.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-white/10 flex items-center justify-center">
                                  <MusicIcon className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{result.name}</p>
                              <p className="text-xs text-muted-foreground">{result.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Similar TabsContent for albums, events, and merchandise */}
                <TabsContent value="albums" className="m-0">
                  {/* Albums content */}
                </TabsContent>

                <TabsContent value="events" className="m-0">
                  {/* Events content */}
                </TabsContent>

                <TabsContent value="merchandise" className="m-0">
                  {/* Merchandise content */}
                </TabsContent>
              </div>
            </Tabs>

            <div className="border-t border-white/10 p-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <div>
                  <span>Press </span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-xs font-medium">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                  <span> to open search, </span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-xs font-medium">
                    Esc
                  </kbd>
                  <span> to close</span>
                </div>
                <div>{getResultCount()} results</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

