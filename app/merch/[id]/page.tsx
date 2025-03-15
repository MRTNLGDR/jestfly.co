import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"
import Image from "next/image"
import { AddToCartButton } from "@/components/merch/add-to-cart-button"

export default async function MerchandiseDetailPage({ params }: { params: { id: string } }) {
  // Fetch merchandise data
  const merchandise = await prisma.merchandise.findUnique({
    where: {
      id: params.id,
    },
    include: {
      artist: true,
    },
  })

  if (!merchandise) {
    notFound()
  }

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <Button variant="outline" className="mb-8 border-white/20 hover:border-white/40" asChild>
          <Link href="/merch">Back to Store</Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <GlassCard className="p-6">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                {merchandise.imageUrl ? (
                  <Image
                    src={merchandise.imageUrl || "/placeholder.svg"}
                    alt={merchandise.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <ShoppingBagIcon className="h-16 w-16 text-iridescent-3" />
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-1">
            <GlassCard className="p-6">
              <h1 className="text-3xl font-bold mb-2">{merchandise.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">
                By{" "}
                <Link href={`/artists/${merchandise.artist.id}`} className="text-iridescent-1 hover:underline">
                  {merchandise.artist.stageName}
                </Link>
              </p>

              <div className="flex items-center justify-between mb-6">
                <p className="text-3xl font-bold text-iridescent-1">${merchandise.price.toFixed(2)}</p>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    merchandise.stock > 10
                      ? "bg-green-500/20 text-green-400"
                      : merchandise.stock > 0
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {merchandise.stock > 10
                    ? "In Stock"
                    : merchandise.stock > 0
                      ? `Only ${merchandise.stock} left`
                      : "Out of Stock"}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">{merchandise.description}</p>
              </div>

              <AddToCartButton
                merchandise={{
                  id: merchandise.id,
                  name: merchandise.name,
                  price: merchandise.price,
                  imageUrl: merchandise.imageUrl,
                  stock: merchandise.stock,
                }}
              />
            </GlassCard>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}

