import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Download, Github } from "lucide-react"

export default function InstallationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Installation Guide</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to install and set up the Jestfly Artist Fan Platform.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
            <CardDescription>Make sure you have the following installed before proceeding.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Node.js (v18 or later)</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>npm (v8 or later) or yarn</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Git</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>PostgreSQL (v14 or later)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Installation Steps</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">1. Clone the Repository</h3>
              <Card>
                <CardContent className="pt-6">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>
                      {`git clone https://github.com/jestfly/artist-fan-platform.git
cd artist-fan-platform`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">2. Install Dependencies</h3>
              <Card>
                <CardContent className="pt-6">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>
                      {`# Using npm
npm install

# Using yarn
yarn install`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">3. Set Up Environment Variables</h3>
              <p className="text-muted-foreground">
                Create a <code>.env</code> file in the root directory with the following variables:
              </p>
              <Card>
                <CardContent className="pt-6">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>
                      {`# Database
DATABASE_URL="postgresql://username:password@localhost:5432/jestfly"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Storage (for uploads)
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Streaming
STREAMING_API_KEY="your-streaming-api-key"
STREAMING_API_SECRET="your-streaming-api-secret"`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">4. Set Up the Database</h3>
              <Card>
                <CardContent className="pt-6">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>
                      {`# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with initial data (optional)
npx prisma db seed`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">5. Start the Development Server</h3>
              <Card>
                <CardContent className="pt-6">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>
                      {`# Using npm
npm run dev

# Using yarn
yarn dev`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Deployment Options</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Deploy on Vercel</CardTitle>
                <CardDescription>The easiest way to deploy your Jestfly application.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Vercel is the recommended platform for deploying Next.js applications. It provides a seamless
                  deployment experience with automatic previews and CI/CD.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Deploy to Vercel
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deploy on Netlify</CardTitle>
                <CardDescription>Another great option for deploying your application.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Netlify offers a robust platform for deploying Next.js applications with features like branch deploys,
                  preview deployments, and form handling.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Deploy to Netlify
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Self-Hosted</CardTitle>
                <CardDescription>Deploy on your own infrastructure.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You can deploy Jestfly on your own servers using Docker, Kubernetes, or traditional hosting methods.
                  This gives you complete control over your deployment.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  View Docker Guide
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Troubleshooting</h2>

          <Card>
            <CardHeader>
              <CardTitle>Common Issues</CardTitle>
              <CardDescription>Solutions to common installation problems.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Database Connection Issues</h3>
                <p className="text-sm text-muted-foreground">
                  If you're having trouble connecting to the database, make sure:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground">
                  <li>Your PostgreSQL server is running</li>
                  <li>The database credentials in your .env file are correct</li>
                  <li>The database exists (you may need to create it manually)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Prisma Migration Issues</h3>
                <p className="text-sm text-muted-foreground">If you encounter errors during Prisma migrations:</p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground">
                  <li>
                    Try resetting the database with <code>npx prisma migrate reset</code>
                  </li>
                  <li>Check for syntax errors in your schema.prisma file</li>
                  <li>
                    Make sure you've generated the Prisma client with <code>npx prisma generate</code>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Environment Variable Issues</h3>
                <p className="text-sm text-muted-foreground">If your application can't access environment variables:</p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground">
                  <li>Verify that your .env file is in the root directory</li>
                  <li>Make sure you're not using quotes around the values unnecessarily</li>
                  <li>Restart your development server after making changes to .env</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Link href="/docs/authentication">
            <Button>
              Continue to Authentication Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

