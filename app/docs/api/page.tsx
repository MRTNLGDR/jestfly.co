import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function ApiDocsPage() {
  const endpoints = [
    {
      category: "Authentication",
      description: "User authentication and authorization",
      endpoints: [
        { name: "Register", path: "/api/auth/register", method: "POST" },
        { name: "Login", path: "/api/auth/login", method: "POST" },
        { name: "Refresh Token", path: "/api/auth/refresh", method: "POST" },
        { name: "Logout", path: "/api/auth/logout", method: "POST" },
      ],
      link: "/docs/api/authentication",
    },
    {
      category: "Artists",
      description: "Artist profile management",
      endpoints: [
        { name: "Get All Artists", path: "/api/artists", method: "GET" },
        { name: "Get Artist", path: "/api/artists/:id", method: "GET" },
        { name: "Create Artist", path: "/api/artists", method: "POST" },
        { name: "Update Artist", path: "/api/artists/:id", method: "PUT" },
        { name: "Delete Artist", path: "/api/artists/:id", method: "DELETE" },
      ],
      link: "/docs/api/artists",
    },
    {
      category: "Albums",
      description: "Album and track management",
      endpoints: [
        { name: "Get All Albums", path: "/api/albums", method: "GET" },
        { name: "Get Album", path: "/api/albums/:id", method: "GET" },
        { name: "Create Album", path: "/api/albums", method: "POST" },
        { name: "Update Album", path: "/api/albums/:id", method: "PUT" },
        { name: "Delete Album", path: "/api/albums/:id", method: "DELETE" },
      ],
      link: "/docs/api/albums",
    },
    {
      category: "Events",
      description: "Event management and RSVPs",
      endpoints: [
        { name: "Get All Events", path: "/api/events", method: "GET" },
        { name: "Get Event", path: "/api/events/:id", method: "GET" },
        { name: "Create Event", path: "/api/events", method: "POST" },
        { name: "Update Event", path: "/api/events/:id", method: "PUT" },
        { name: "Delete Event", path: "/api/events/:id", method: "DELETE" },
        { name: "RSVP to Event", path: "/api/events/:id/attend", method: "POST" },
      ],
      link: "/docs/api/events",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">API Reference</h1>
        <p className="text-lg text-muted-foreground">Comprehensive documentation for the Jestfly API endpoints.</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>API Overview</CardTitle>
              <CardDescription>The Jestfly API is organized around REST principles.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns
                JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/docs/api/authentication">
                <Button variant="outline" size="sm">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Secure your API requests with authentication.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The Jestfly API uses JWT (JSON Web Tokens) for authentication. You'll need to include your API token in
                the Authorization header of your requests.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/docs/api/authentication">
                <Button variant="outline" size="sm">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">API Endpoints</h2>

          <div className="space-y-6">
            {endpoints.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.endpoints.map((endpoint) => (
                      <div key={endpoint.path} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center">
                          <span
                            className={`inline-block w-16 text-xs font-medium ${
                              endpoint.method === "GET"
                                ? "text-blue-500"
                                : endpoint.method === "POST"
                                  ? "text-green-500"
                                  : endpoint.method === "PUT"
                                    ? "text-yellow-500"
                                    : endpoint.method === "DELETE"
                                      ? "text-red-500"
                                      : ""
                            }`}
                          >
                            {endpoint.method}
                          </span>
                          <span className="text-sm">{endpoint.name}</span>
                        </div>
                        <code className="text-xs text-muted-foreground">{endpoint.path}</code>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={category.link}>
                    <Button variant="outline" size="sm">
                      View Documentation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">API Examples</h2>

          <Card>
            <CardHeader>
              <CardTitle>Example Request</CardTitle>
              <CardDescription>
                Here's an example of how to make an API request to get an artist's profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Using fetch API
fetch('https://api.jestfly.com/api/artists/123', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                </code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Response</CardTitle>
              <CardDescription>Here's an example response from the API.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>
                  {`{
  "id": "123",
  "name": "Cosmic Harmony",
  "bio": "Electronic music producer from Los Angeles",
  "genre": "Electronic",
  "profileImage": "https://jestfly.com/images/artists/cosmic-harmony.jpg",
  "coverImage": "https://jestfly.com/images/covers/cosmic-harmony-cover.jpg",
  "socialLinks": {
    "instagram": "https://instagram.com/cosmicharmony",
    "twitter": "https://twitter.com/cosmicharmony",
    "website": "https://cosmicharmony.com"
  },
  "createdAt": "2023-01-15T10:30:00Z",
  "updatedAt": "2023-08-20T14:45:22Z",
  "followers": 1250,
  "albums": 3,
  "events": 5
}`}
                </code>
              </pre>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Link href="/docs/api/authentication">
              <Button>
                Get Started with Authentication
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

