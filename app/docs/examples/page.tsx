"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function ExamplesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Examples</h1>
        <p className="text-lg text-muted-foreground">
          Code examples and use cases for the Jestfly Artist Fan Platform.
        </p>
      </div>

      <Tabs defaultValue="frontend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="frontend">Frontend Examples</TabsTrigger>
          <TabsTrigger value="backend">Backend Examples</TabsTrigger>
          <TabsTrigger value="integration">Integration Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="frontend" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Artist Profile Component</CardTitle>
                <CardDescription>Display an artist's profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <code>
                    {`import { useState, useEffect } from 'react';

const ArtistProfile = ({ artistId }) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(\`/api/artists/\${artistId}\`);
        if (!response.ok) {
          throw new Error('Failed to fetch artist');
        }
        const data = await response.json();
        setArtist(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!artist) return <div>No artist found</div>;

  return (
    <div className="artist-profile">
      <div className="cover-image">
        <img src={artist.coverImage || "/placeholder.svg"} alt={artist.name} />
      </div>
      <div className="profile-content">
        <div className="profile-image">
          <img src={artist.profileImage || "/placeholder.svg"} alt={artist.name} />
        </div>
        <h1>{artist.name}</h1>
        <p className="genre">{artist.genre}</p>
        <p className="bio">{artist.bio}</p>
        <div className="social-links">
          {artist.socialLinks.instagram && (
            <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          )}
          {artist.socialLinks.twitter && (
            <a href={artist.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          )}
          {artist.socialLinks.website && (
            <a href={artist.socialLinks.website} target="_blank" rel="noopener noreferrer">
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;`}
                  </code>
                </pre>
              </CardContent>
              <CardFooter>
                <Link href="/docs/artist-profile">
                  <Button variant="outline" size="sm">
                    View Documentation
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Album List Component</CardTitle>
                <CardDescription>Display a list of albums for an artist</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <code>
                    {`import { useState, useEffect } from 'react';
import Link from 'next/link';

const AlbumList = ({ artistId }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(\`/api/albums?artistId=\${artistId}\`);
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        const data = await response.json();
        setAlbums(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [artistId]);

  if (loading) return <div>Loading albums...</div>;
  if (error) return <div>Error: {error}</div>;
  if (albums.length === 0) return <div>No albums found</div>;

  return (
    <div className="album-list">
      <h2>Albums</h2>
      <div className="albums-grid">
        {albums.map((album) => (
          <Link href={\`/albums/\${album.id}\`} key={album.id}>
            <div className="album-card">
              <div className="album-cover">
                <img src={album.coverImage || "/placeholder.svg"} alt={album.title} />
              </div>
              <div className="album-info">
                <h3>{album.title}</h3>
                <p className="release-date">{new Date(album.releaseDate).getFullYear()}</p>
                <p className="track-count">{album.trackCount} tracks</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;`}
                  </code>
                </pre>
              </CardContent>
              <CardFooter>
                <Link href="/docs/album-management">
                  <Button variant="outline" size="sm">
                    View Documentation
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backend" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Create Event API Handler</CardTitle>
                <CardDescription>Handle event creation requests</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <code>
                    {`// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is an artist
    const artist = await prisma.artist.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Only artists can create events' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create the event
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        location: data.location || 'Virtual',
        image: data.image || null,
        isVirtual: data.isVirtual || false,
        streamUrl: data.streamUrl || null,
        artistId: artist.id,
      },
    });
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}`}
                  </code>
                </pre>
              </CardContent>
              <CardFooter>
                <Link href="/docs/api/events">
                  <Button variant="outline" size="sm">
                    View Documentation
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>JestCoins Transaction Handler</CardTitle>
                <CardDescription>Process JestCoins transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <code>
                    {`// lib/jestcoins.ts
import prisma from '@/lib/db';

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  REWARD = 'REWARD',
  TRANSFER = 'TRANSFER',
  REFUND = 'REFUND',
}

export async function processTransaction({
  userId,
  amount,
  type,
  description,
  relatedId,
}: {
  userId: string;
  amount: number;
  type: TransactionType;
  description: string;
  relatedId?: string;
}) {
  // Start a transaction
  return await prisma.$transaction(async (tx) => {
    // Get user's current balance
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, jestCoins: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // For purchases, check if user has enough coins
    if (type === TransactionType.PURCHASE && user.jestCoins < amount) {
      throw new Error('Insufficient JestCoins balance');
    }

    // Calculate new balance
    const newBalance = 
      type === TransactionType.PURCHASE || type === TransactionType.TRANSFER
        ? user.jestCoins - amount
        : user.jestCoins + amount;

    // Update user's balance
    await tx.user.update({
      where: { id: userId },
      data: { jestCoins: newBalance },
    });

    // Record the transaction
    const transaction = await tx.jestCoinTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
        relatedId,
        balanceAfter: newBalance,
      },
    });

    return {
      transaction,
      newBalance,
    };
  });
}`}
                  </code>
                </pre>
              </CardContent>
              <CardFooter>
                <Link href="/docs/api/jestcoins">
                  <Button variant="outline" size="sm">
                    View Documentation
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Career Planner Integration</CardTitle>
                <CardDescription>Integrate the Career Planner into your application</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <code>
                    {`import { useState, useEffect } from 'react';
import { CareerCanvas } from '@/components/career-planner/canvas';
import { NodeEditor } from '@/components/career-planner/node-editor';
import { ConnectionEditor } from '@/components/career-planner/connection-editor';
import { TimelineView } from '@/components/career-planner/timeline-view';
import { ProgressStats } from '@/components/career-planner/progress-stats';
import { ExportImport } from '@/components/career-planner/export-import';
import { SharePlan } from '@/components/career-planner/share-plan';
import { useCareerCanvas } from '@/hooks/use-career-canvas';
import type { Node, Connection } from '@/types/career-planner';

const CareerPlannerApp = () => {
  const {
    nodes,
    connections,
    selectedNode,
    selectedConnection,
    addNode,
    updateNode,
    deleteNode,
    addConnection,
    updateConnection,
    deleteConnection,
    selectNode,
    selectConnection,
    loadPlan,
    savePlan,
  } = useCareerCanvas();

  const [activeView, setActiveView] = useState('canvas');

  // Load saved plan on component mount
  useEffect(() => {
    const loadSavedPlan = async () => {
      try {
        const response = await fetch('/api/career-plans/me');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            loadPlan(data);
          }
        }
      } catch (error) {
        console.error('Error loading career plan:', error);
      }
    };

    loadSavedPlan();
  }, [loadPlan]);

  // Save plan when changes are made
  const handleSave = async () => {
    try {
      const planData = {
        nodes,
        connections,
      };
      
      const response = await fetch('/api/career-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });
      
      if (response.ok) {
        // Handle successful save
        console.log('Plan saved successfully');
      }
    } catch (error) {
      console.error('Error saving career plan:', error);
    }
  };

  return (
    <div className="career-planner">
      <div className="controls">
        <button onClick={() => setActiveView('canvas')}>Canvas View</button>
        <button onClick={() => setActiveView('timeline')}>Timeline View</button>
        <button onClick={() => setActiveView('stats')}>Progress Stats</button>
        <button onClick={handleSave}>Save Plan</button>
      </div>
      
      {activeView === 'canvas' && (
        <div className="canvas-container">
          <CareerCanvas
            nodes={nodes}
            connections={connections}
            selectedNode={selectedNode}
            selectedConnection={selectedConnection}
            onSelectNode={selectNode}
            onSelectConnection={selectConnection}
            onAddNode={addNode}
          />
          
          {selectedNode && (
            <NodeEditor
              node={selectedNode}
              onUpdate={updateNode}
              onDelete={deleteNode}
            />
          )}
          
          {selectedConnection && (
            <ConnectionEditor
              connection={selectedConnection}
              nodes={nodes}
              onUpdate={updateConnection}
              onDelete={deleteConnection}
            />
          )}
        </div>
      )}
      
      {activeView === 'timeline' && (
        <TimelineView nodes={nodes} connections={connections} />
      )}
      
      {activeView === 'stats' && (
        <ProgressStats nodes={nodes} connections={connections} />
      )}
      
      <div className="tools">
        <ExportImport
          onExport={() => ({ nodes, connections })}
          onImport={loadPlan}
        />
        <SharePlan planData={{ nodes, connections }} />
      </div>
    </div>
  );
};

export default CareerPlannerApp;`}
                  </code>
                </pre>
              </CardContent>
              <CardFooter>
                <Link href="/docs/career-planner">
                  <Button variant="outline" size="sm">
                    View Documentation
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Streaming Integration</CardTitle>
                <CardDescription>Integrate live streaming into your application</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <code>
                    {`import { useState, useEffect, useRef } from 'react';
import { useLiveChat } from '@/hooks/use-live-chat';
import { LiveChat } from '@/components/events/live-chat';

const LiveStreamPage = ({ eventId }) => {
  const videoRef = useRef(null);
  const [streamStatus, setStreamStatus] = useState('loading');
  const [streamData, setStreamData] = useState(null);
  const { messages, sendMessage } = useLiveChat(eventId);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const response = await fetch(\`/api/events/\${eventId}/stream\`);
        if (!response.ok) {
          throw new Error('Failed to fetch stream data');
        }
        
        const data = await response.json();
        setStreamData(data);
        
        if (data.isLive) {
          setStreamStatus('live');
          initializeStream(data.streamUrl);
        } else if (data.scheduledFor && new Date(data.scheduledFor) > new Date()) {
          setStreamStatus('scheduled');
        } else {
          setStreamStatus('ended');
        }
      } catch (error) {
        console.error('Error fetching stream data:', error);
        setStreamStatus('error');
      }
    };

    fetchStreamData();
  }, [eventId]);

  const initializeStream = (streamUrl) => {
    if (videoRef.current && streamUrl) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play().catch(error => {
            console.error('Error playing video:', error);
          });
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play().catch(error => {
            console.error('Error playing video:', error);
          });
        });
      }
    }
  };

  const handleChatMessage = (message) => {
    sendMessage(message);
  };

  return (
    <div className="live-stream-page">
      <div className="stream-container">
        {streamStatus === 'loading' && <div>Loading stream...</div>}
        
        {streamStatus === 'live' && (
          <div className="video-container">
            <div className="live-badge">LIVE</div>
            <video ref={videoRef} controls />
            <div className="stream-info">
              <h1>{streamData?.title}</h1>
              <p>{streamData?.description}</p>
            </div>
          </div>
        )}
        
        {streamStatus === 'scheduled' && (
          <div className="scheduled-stream">
            <h2>Stream Scheduled</h2>
            <p>This stream will begin on {new Date(streamData?.scheduledFor).toLocaleString()}</p>
            <button>Set Reminder</button>
          </div>
        )}
        
        {streamStatus === 'ended' && (
          <div className="ended-stream">
            <h2>Stream Ended</h2>
            <p>This stream has ended. Check back later for the recording.</p>
          </div>
        )}
        
        {streamStatus === 'error' && (
          <div className="stream-error">
            <h2>Stream Unavailable</h2>
            <p>We encountered an error loading this stream. Please try again later.</p>
          </div>
        )}
      </div>
      
      {(streamStatus === 'live' || streamStatus === 'scheduled') && (
        <div className="chat-container">
          <LiveChat
            messages={messages}
            onSendMessage={handleChatMessage}
            isLive={streamStatus === 'live'}
          />
        </div>
      )}
    </div>
  );
};

export default LiveStreamPage;`}
                  </code>
                </pre>
              </CardContent>
              <CardFooter>
                <Link href="/docs/live-streaming">
                  <Button variant="outline" size="sm">
                    View Documentation
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

