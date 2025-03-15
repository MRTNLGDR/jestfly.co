import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { prisma } from "@/lib/db"
import { MerchandiseCard } from "@/components/artist/merchandise-card"
import { ShoppingBagIcon } from "lucide-react"

export default async function MerchPage() {
  // Fetch available merchandise
  const merchandise = await prisma.merchandise.findMany({
    where: {
      stock: {
        gt: 0,
      },
    },
    include: {
      artist: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <AppLayout>
      <Navbar />
      <main className="py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
          Merchandise Store
        </h1>

        {merchandise.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {merchandise.map((item) => (
              <MerchandiseCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                imageUrl={item.imageUrl}
                artistId={item.artistId}
                artistName={item.artist.stageName}
              />
            ))}
          </div>
        ) : (
          <GlassCard className="p-8 text-center">
            <ShoppingBagIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Merchandise Available</h2>
            <p className="text-muted-foreground">
              There are no merchandise items available for purchase at this time. Check back later!
            </p>
          </GlassCard>
        )}
      </main>
    </AppLayout>
  )
}

