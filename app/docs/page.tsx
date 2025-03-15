import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Users } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Jestfly Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to the Jestfly Artist Fan Platform documentation. Learn how to use the platform, build integrations,
          and more.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">For Artists</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Artist Tools</div>
                <p className="text-xs text-muted-foreground">
                  Tools and features for artists to manage their content, engage with fans, and grow their career.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/docs/artist-profile">
                  <Button variant="ghost" className="h-8 w-full justify-start px-2">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">For Fans</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Fan Experience</div>
                <p className="text-xs text-muted-foreground">
                  Discover music, attend events, purchase merchandise, and connect with your favorite artists.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/docs/user-profile">
                  <Button variant="ghost" className="h-8 w-full justify-start px-2">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Reference</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Developer API</div>
                <p className="text-xs text-muted-foreground">
                  Comprehensive API documentation for developers building on the Jestfly platform.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/docs/api/authentication">
                  <Button variant="ghost" className="h-8 w-full justify-start px-2">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">What is Jestfly?</h2>
            <p className="text-muted-foreground">
              Jestfly is a comprehensive platform designed to connect artists with their fans through exclusive content
              and experiences. The platform provides tools for artists to manage their music, events, merchandise, and
              career planning, while offering fans a seamless experience to discover, engage with, and support their
              favorite artists.
            </p>

            <h3 className="text-xl font-bold tracking-tight">Key Components</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Artist Profiles:</strong> Customizable profiles for artists to showcase their work and connect
                with fans.
              </li>
              <li>
                <strong>Music Management:</strong> Tools for uploading, organizing, and distributing music content.
              </li>
              <li>
                <strong>Event Management:</strong> Create, promote, and manage virtual and in-person events.
              </li>
              <li>
                <strong>Merchandise Store:</strong> Sell branded merchandise directly to fans.
              </li>
              <li>
                <strong>Career Planner:</strong> Interactive tool for artists to plan and track their career goals.
              </li>
              <li>
                <strong>Live Streaming:</strong> Host live performances and interactive sessions with fans.
              </li>
              <li>
                <strong>JestCoins:</strong> Platform currency for transactions and rewards.
              </li>
              <li>
                <strong>Analytics:</strong> Comprehensive insights into audience engagement and performance metrics.
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Artist Profile Management</CardTitle>
                <CardDescription>Create and manage your artist profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Customize your artist profile with:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Profile information and bio</li>
                  <li>Social media links</li>
                  <li>Profile and cover images</li>
                  <li>Genre and style tags</li>
                  <li>Featured content</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/docs/artist-profile">
                  <Button variant="outline" size="sm">
                    Learn more
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Album & Track Management</CardTitle>
                <CardDescription>Organize and share your music</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Manage your music catalog with:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Album creation and editing</li>
                  <li>Track uploading and organization</li>
                  <li>Release scheduling</li>
                  <li>Metadata management</li>
                  <li>Audio playback controls</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/docs/album-management">
                  <Button variant="outline" size="sm">
                    Learn more
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Management</CardTitle>
                <CardDescription>Create and promote events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Organize events with features like:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Event creation and scheduling</li>
                  <li>Virtual and in-person event support</li>
                  <li>RSVP and attendance tracking</li>
                  <li>Live streaming integration</li>
                  <li>Event analytics</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/docs/event-management">
                  <Button variant="outline" size="sm">
                    Learn more
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Merchandise Store</CardTitle>
                <CardDescription>Sell branded merchandise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Manage your merchandise with:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Product creation and management</li>
                  <li>Inventory tracking</li>
                  <li>Pricing and discounts</li>
                  <li>Order processing</li>
                  <li>Sales analytics</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/docs/merchandise">
                  <Button variant="outline" size="sm">
                    Learn more
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Career Planner</CardTitle>
                <CardDescription>Plan and track your career goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Plan your career with features like:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Interactive canvas for goal planning</li>
                  <li>Node and connection management</li>
                  <li>Timeline visualization</li>
                  <li>Progress tracking</li>
                  <li>Plan sharing and collaboration</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/docs/career-planner">
                  <Button variant="outline" size="sm">
                    Learn more
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Streaming</CardTitle>
                <CardDescription>Host live performances and sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Stream to your fans with features like:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>High-quality video streaming</li>
                  <li>Live chat interaction</li>
                  <li>Stream scheduling and promotion</li>
                  <li>Recording and replay</li>
                  <li>Viewer analytics</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/docs/live-streaming">
                  <Button variant="outline" size="sm">
                    Learn more
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quickstart" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Quick Start Guide</h2>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">1. Create an Account</h3>
              <p className="text-muted-foreground">
                Start by creating an account on the Jestfly platform. You can sign up as an artist or a fan.
              </p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Navigate to the registration page
https://jestfly.com/register

// Fill in your details and select your account type
// Click "Register" to create your account`}
                </code>
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">2. Set Up Your Profile</h3>
              <p className="text-muted-foreground">
                Complete your profile with relevant information to enhance your experience on the platform.
              </p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>
                  {`// For Artists:
Navigate to "Artist Profile" in your dashboard
Add your bio, profile picture, cover image, and social links

// For Fans:
Navigate to "Profile" in your account settings
Add your preferences, profile picture, and favorite genres`}
                </code>
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">3. Explore the Platform</h3>
              <p className="text-muted-foreground">
                Familiarize yourself with the platform's features and start engaging with the community.
              </p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>
                  {`// For Artists:
- Upload your first album or track
- Create an event or live stream
- Set up your merchandise store
- Start planning your career with the Career Planner

// For Fans:
- Discover new artists and music
- RSVP to upcoming events
- Purchase merchandise
- Earn JestCoins through platform activities`}
                </code>
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">4. Connect and Engage</h3>
              <p className="text-muted-foreground">
                Build your network and engage with the community to maximize your Jestfly experience.
              </p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>
                  {`// For Artists:
- Promote your content on social media
- Interact with fans through comments and live chat
- Collaborate with other artists
- Analyze your performance metrics

// For Fans:
- Follow your favorite artists
- Comment on content
- Participate in live streams
- Share content with friends`}
                </code>
              </pre>
            </div>

            <div className="mt-6">
              <Link href="/docs/installation">
                <Button>
                  Continue to Installation Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

