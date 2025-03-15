"use client"

import { useState } from "react"
import { Check, CloudUpload, RefreshCcw, Server, ServerCrash, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function DeployPage() {
  const [deployStatus, setDeployStatus] = useState<"idle" | "deploying" | "success" | "error">("idle")
  const [deployProgress, setDeployProgress] = useState(0)
  const [currentEnvironment, setCurrentEnvironment] = useState("development")
  const [deployHistory, setDeployHistory] = useState([
    {
      id: "1",
      environment: "development",
      status: "success",
      timestamp: "2024-08-21 14:30:45",
      author: "dev@jestfly.com",
      version: "v1.2.3",
    },
    {
      id: "2",
      environment: "staging",
      status: "success",
      timestamp: "2024-08-20 10:15:22",
      author: "lead@jestfly.com",
      version: "v1.2.0",
    },
    {
      id: "3",
      environment: "production",
      status: "success",
      timestamp: "2024-08-15 09:45:11",
      author: "admin@jestfly.com",
      version: "v1.1.0",
    },
  ])

  const environments = {
    development: {
      url: "https://dev.jestfly.com",
      status: "online",
      version: "v1.2.3",
      lastDeploy: "2024-08-21 14:30:45",
    },
    staging: {
      url: "https://staging.jestfly.com",
      status: "online",
      version: "v1.2.0",
      lastDeploy: "2024-08-20 10:15:22",
    },
    production: {
      url: "https://jestfly.com",
      status: "online",
      version: "v1.1.0",
      lastDeploy: "2024-08-15 09:45:11",
    },
  }

  const startDeploy = () => {
    setDeployStatus("deploying")
    setDeployProgress(0)

    const interval = setInterval(() => {
      setDeployProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setDeployStatus("success")

          // Add to history
          const newDeploy = {
            id: Date.now().toString(),
            environment: currentEnvironment,
            status: "success",
            timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            author: "current@jestfly.com",
            version: "v1.2.4",
          }

          setDeployHistory((prev) => [newDeploy, ...prev])
          return 100
        }
        return prev + 5
      })
    }, 300)

    return () => clearInterval(interval)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Jestfly Deployment</h1>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="deploy" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
            <TabsTrigger value="environments">Environments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="deploy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deploy to Environment</CardTitle>
                <CardDescription>Choose an environment and deploy the Jestfly Artist Fan Platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {Object.keys(environments).map((env) => (
                    <Card
                      key={env}
                      className={`cursor-pointer relative overflow-hidden ${currentEnvironment === env ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setCurrentEnvironment(env)}
                    >
                      {currentEnvironment === env && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="default">Selected</Badge>
                        </div>
                      )}
                      <CardHeader className="py-4">
                        <CardTitle className="capitalize">{env}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${environments[env as keyof typeof environments].status === "online" ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          {environments[env as keyof typeof environments].status}
                        </div>
                        <p className="text-sm mt-1">{environments[env as keyof typeof environments].version}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {deployStatus === "deploying" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Deploying to {currentEnvironment}...</span>
                      <span>{deployProgress}%</span>
                    </div>
                    <Progress value={deployProgress} className="h-2" />
                  </div>
                )}

                {deployStatus === "success" && (
                  <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>Successfully deployed to {currentEnvironment}.</AlertDescription>
                  </Alert>
                )}

                {deployStatus === "error" && (
                  <Alert className="bg-red-500/10 text-red-500 border-red-500/20">
                    <ServerCrash className="h-4 w-4" />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>Failed to deploy to {currentEnvironment}. Please try again.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={startDeploy} disabled={deployStatus === "deploying"} className="w-full">
                  {deployStatus === "deploying" ? (
                    <>
                      <CloudUpload className="mr-2 h-4 w-4 animate-pulse" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <CloudUpload className="mr-2 h-4 w-4" />
                      Deploy to {currentEnvironment}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Deployment configuration and settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium">App Name:</span>
                    <span className="col-span-2 text-sm">Jestfly Artist Fan Platform</span>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium">Repository:</span>
                    <span className="col-span-2 text-sm">github.com/jestfly/artist-fan-platform</span>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium">Branch:</span>
                    <span className="col-span-2 text-sm">main</span>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium">Next Version:</span>
                    <span className="col-span-2 text-sm">v1.2.4</span>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-sm font-medium">Build Command:</span>
                    <span className="col-span-2 text-sm">npm run build</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environments" className="space-y-6">
            {Object.entries(environments).map(([name, data]) => (
              <Card key={name}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="capitalize">{name}</CardTitle>
                      <CardDescription>{data.url}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Zap className="mr-2 h-4 w-4" />
                      Visit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Status</h3>
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${data.status === "online" ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <span className="capitalize">{data.status}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Version</h3>
                      <p>{data.version}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Last Deploy</h3>
                      <p>{data.lastDeploy}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Region</h3>
                      <p>US East</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Server className="mr-2 h-4 w-4" />
                    Logs
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentEnvironment(name)
                      setDeployStatus("idle")
                      startDeploy()
                    }}
                  >
                    <CloudUpload className="mr-2 h-4 w-4" />
                    Deploy
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment History</CardTitle>
                <CardDescription>Recent deployments across all environments.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Environment</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Version</th>
                        <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                        <th className="text-left py-3 px-4 font-medium">Author</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deployHistory.map((deploy) => (
                        <tr key={deploy.id} className="border-b last:border-b-0">
                          <td className="py-3 px-4 capitalize">{deploy.environment}</td>
                          <td className="py-3 px-4">
                            <Badge variant={deploy.status === "success" ? "default" : "destructive"}>
                              {deploy.status === "success" ? (
                                <Check className="mr-1 h-3 w-3" />
                              ) : (
                                <ServerCrash className="mr-1 h-3 w-3" />
                              )}
                              {deploy.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{deploy.version}</td>
                          <td className="py-3 px-4">{deploy.timestamp}</td>
                          <td className="py-3 px-4">{deploy.author}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

