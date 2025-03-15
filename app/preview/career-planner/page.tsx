import type React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Navbar } from "@/components/layout/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  LayoutDashboard,
  Calendar,
  Clock,
  BarChart3,
  Share2,
  Download,
  Upload,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  TimerIcon,
} from "lucide-react"

export default function CareerPlannerPreviewPage() {
  return (
    <AppLayout>
      <Navbar />
      <main className="container py-8">
        <section className="mb-16">
          <GlassCard className="p-8 md:p-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
              Career Planner
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
              Plan, visualize, and track your music career journey with our interactive tools
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/career-planner">Start Planning</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:border-white/40" asChild>
                <Link href="/demo/career-planner">Try Demo</Link>
              </Button>
            </div>
          </GlassCard>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Career Planner Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<LayoutDashboard className="h-8 w-8 text-iridescent-1" />}
              title="Interactive Canvas"
              description="Visualize your career path with an interactive node-based canvas"
            />
            <FeatureCard
              icon={<TimerIcon className="h-8 w-8 text-iridescent-2" />}
              title="Timeline View"
              description="See your career milestones in a chronological timeline"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-iridescent-3" />}
              title="Progress Analytics"
              description="Track your progress with detailed statistics and reports"
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-iridescent-1" />}
              title="Calendar Integration"
              description="Sync deadlines and milestones with your calendar"
            />
            <FeatureCard
              icon={<Share2 className="h-8 w-8 text-iridescent-2" />}
              title="Share & Collaborate"
              description="Share your career plan with mentors and collaborators"
            />
            <FeatureCard
              icon={<PlusCircle className="h-8 w-8 text-iridescent-3" />}
              title="Templates & Presets"
              description="Start with industry-standard career templates"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            How It Works
          </h2>

          <Tabs defaultValue="canvas" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="canvas">Canvas View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="canvas">
              <ScreenPreview
                title="Interactive Canvas"
                description="Create a visual map of your career journey with connected nodes"
                imageSrc="/placeholder.svg?height=600&width=1200"
                features={[
                  "Drag and drop nodes to create your career path",
                  "Connect milestones and goals with dependencies",
                  "Color-code nodes by category or status",
                  "Add detailed information to each career milestone",
                ]}
              />
            </TabsContent>

            <TabsContent value="timeline">
              <ScreenPreview
                title="Timeline View"
                description="View your career plan as a chronological timeline"
                imageSrc="/placeholder.svg?height=600&width=1200"
                features={[
                  "Visualize your career journey in chronological order",
                  "See upcoming deadlines and milestones",
                  "Track progress against your timeline",
                  "Identify potential scheduling conflicts",
                ]}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <ScreenPreview
                title="Progress Analytics"
                description="Track your career progress with detailed analytics"
                imageSrc="/placeholder.svg?height=600&width=1200"
                features={[
                  "Monitor completion rates for goals and milestones",
                  "Analyze time spent on different career aspects",
                  "Track progress against industry benchmarks",
                  "Generate detailed reports for mentors or collaborators",
                ]}
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-iridescent-1 via-iridescent-2 to-iridescent-3 text-transparent bg-clip-text inline-block">
            Career Planning Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProcessCard
              icon={<PlusCircle className="h-10 w-10 text-iridescent-1" />}
              title="Create Your Plan"
              description="Start from scratch or use one of our industry templates"
              step={1}
            />
            <ProcessCard
              icon={<LayoutDashboard className="h-10 w-10 text-iridescent-2" />}
              title="Map Your Journey"
              description="Add milestones, goals, and connections between them"
              step={2}
            />
            <ProcessCard
              icon={<Clock className="h-10 w-10 text-iridescent-3" />}
              title="Set Timelines"
              description="Assign deadlines and durations to your milestones"
              step={3}
            />
            <ProcessCard
              icon={<CheckCircle2 className="h-10 w-10 text-iridescent-1" />}
              title="Track Progress"
              description="Update status and monitor your career development"
              step={4}
            />
          </div>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <h3 className="text-2xl font-bold mb-4">Template Gallery</h3>
              <p className="text-muted-foreground mb-6">
                Jump-start your career planning with our professionally designed templates
              </p>
              <div className="space-y-4">
                <TemplateItem
                  title="Emerging Artist"
                  description="Perfect for artists just starting their career"
                  nodes={12}
                  connections={18}
                />
                <TemplateItem
                  title="Album Release"
                  description="Plan your album release campaign from start to finish"
                  nodes={15}
                  connections={22}
                />
                <TemplateItem
                  title="Tour Planning"
                  description="Organize your tour with all necessary milestones"
                  nodes={18}
                  connections={24}
                />
                <TemplateItem
                  title="Career Transition"
                  description="Navigate a transition in your music career"
                  nodes={14}
                  connections={20}
                />
              </div>
              <Button
                className="w-full mt-4 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/career-planner">Browse All Templates</Link>
              </Button>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-2xl font-bold mb-4">Import & Export</h3>
              <p className="text-muted-foreground mb-6">Easily share your career plans or import existing ones</p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-white/10 mr-4">
                    <Download className="h-6 w-6 text-iridescent-1" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Export Your Plan</h4>
                    <p className="text-sm text-muted-foreground">
                      Export your career plan as JSON to share with others or keep as a backup
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-white/10 mr-4">
                    <Upload className="h-6 w-6 text-iridescent-2" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Import Plans</h4>
                    <p className="text-sm text-muted-foreground">
                      Import career plans shared by mentors or from your backups
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-white/10 mr-4">
                    <Share2 className="h-6 w-6 text-iridescent-3" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Share With Others</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate shareable links to your career plan for collaboration
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <Button variant="outline" className="flex-1 border-white/20 hover:border-white/40" asChild>
                  <Link href="/career-planner">Import Plan</Link>
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                  asChild
                >
                  <Link href="/career-planner">Create New</Link>
                </Button>
              </div>
            </GlassCard>
          </div>
        </section>

        <section>
          <GlassCard className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-iridescent-2 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Career?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
              Start mapping your music career journey today with our interactive Career Planner
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/career-planner">Start Planning Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:border-white/40" asChild>
                <Link href="/demo/career-planner">Try Demo</Link>
              </Button>
            </div>
          </GlassCard>
        </section>
      </main>
    </AppLayout>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <GlassCard className="p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground flex-grow">{description}</p>
        <div className="mt-4">
          <Button variant="link" className="p-0 h-auto text-iridescent-1 hover:text-iridescent-2">
            Learn more <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}

function ScreenPreview({
  title,
  description,
  imageSrc,
  features,
}: {
  title: string
  description: string
  imageSrc: string
  features: string[]
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="p-1 rounded-full bg-iridescent-1/20 mr-3 mt-0.5">
                <ArrowRight className="h-4 w-4 text-iridescent-1" />
              </div>
              <p>{feature}</p>
            </div>
          ))}
        </div>
        <Button
          className="mt-6 bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
          asChild
        >
          <Link href="/career-planner">Try This Feature</Link>
        </Button>
      </div>
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60"></div>
        <Badge className="absolute top-4 right-4 bg-iridescent-1/80">Preview</Badge>
      </div>
    </div>
  )
}

function ProcessCard({
  icon,
  title,
  description,
  step,
}: {
  icon: React.ReactNode
  title: string
  description: string
  step: number
}) {
  return (
    <GlassCard className="p-6 h-full relative">
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 flex items-center justify-center">
        <span className="text-sm font-bold">{step}</span>
      </div>
      <div className="flex flex-col h-full">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground flex-grow">{description}</p>
      </div>
    </GlassCard>
  )
}

function TemplateItem({
  title,
  description,
  nodes,
  connections,
}: {
  title: string
  description: string
  nodes: number
  connections: number
}) {
  return (
    <div className="flex items-center p-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">{nodes} nodes</div>
        <div className="text-xs text-muted-foreground">{connections} connections</div>
      </div>
    </div>
  )
}

