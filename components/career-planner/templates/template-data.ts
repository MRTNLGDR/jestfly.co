import type { CareerNode, NodeConnection } from "@/types/career-planner"
import { v4 as uuidv4 } from "uuid"
import { CodeIcon, MusicIcon, PaletteIcon, BriefcaseIcon, GraduationCapIcon } from "lucide-react"

// Helper function to create a node
const createNode = (
  type: "goal" | "milestone" | "task" | "resource" | "note",
  title: string,
  description: string,
  position: { x: number; y: number },
  options: {
    priority?: "high" | "medium" | "low"
    dueDate?: string
    completed?: boolean
    width?: number
    height?: number
  } = {},
): CareerNode => {
  return {
    id: uuidv4(),
    type,
    position,
    width: options.width || 200,
    height: options.height || (options.priority || options.dueDate ? 120 : 100),
    data: {
      title,
      description,
      priority: options.priority,
      dueDate: options.dueDate,
      completed: options.completed || false,
    },
  }
}

// Helper function to create a connection
const createConnection = (sourceId: string, targetId: string): NodeConnection => {
  return {
    id: uuidv4(),
    sourceId,
    targetId,
    label: "",
  }
}

// Software Developer Career Template
const createSoftwareDeveloperTemplate = () => {
  const nodes: CareerNode[] = []
  const connections: NodeConnection[] = []

  // Create nodes
  const goal1 = createNode(
    "goal",
    "Become a Senior Software Developer",
    "Achieve senior-level expertise in software development with a focus on full-stack web technologies.",
    { x: 500, y: 100 },
    { priority: "high" },
  )

  const milestone1 = createNode(
    "milestone",
    "Junior Developer Position",
    "Secure a position as a junior developer to gain professional experience.",
    { x: 200, y: 300 },
    { dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const milestone2 = createNode(
    "milestone",
    "Mid-level Developer",
    "Progress to a mid-level developer role with increased responsibilities.",
    { x: 500, y: 300 },
    { dueDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const milestone3 = createNode(
    "milestone",
    "Senior Developer",
    "Reach senior developer status with leadership responsibilities and architectural decision-making.",
    { x: 800, y: 300 },
    { dueDate: new Date(Date.now() + 1460 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const task1 = createNode(
    "task",
    "Learn JavaScript Fundamentals",
    "Master JavaScript basics including ES6+ features, async programming, and DOM manipulation.",
    { x: 100, y: 500 },
    { priority: "high", dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const task2 = createNode(
    "task",
    "Build Portfolio Projects",
    "Create 3-5 portfolio projects showcasing different skills and technologies.",
    { x: 350, y: 500 },
    { priority: "high", dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const task3 = createNode(
    "task",
    "Learn React Framework",
    "Master React including hooks, context, and state management libraries.",
    { x: 200, y: 650 },
    { priority: "medium", dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const task4 = createNode(
    "task",
    "Learn Backend Development",
    "Master Node.js, Express, and database integration.",
    { x: 450, y: 650 },
    { priority: "medium", dueDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const task5 = createNode(
    "task",
    "Contribute to Open Source",
    "Make regular contributions to open source projects to build experience and network.",
    { x: 600, y: 500 },
    { priority: "low", dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const resource1 = createNode(
    "resource",
    "Frontend Masters Subscription",
    "Online learning platform with courses on modern web development.",
    { x: 100, y: 800 },
  )

  const resource2 = createNode(
    "resource",
    "GitHub Profile",
    "Maintain an active GitHub profile showcasing projects and contributions.",
    { x: 350, y: 800 },
  )

  const resource3 = createNode(
    "resource",
    "Tech Meetups",
    "Attend local tech meetups and conferences for networking and learning.",
    { x: 600, y: 800 },
  )

  const note1 = createNode(
    "note",
    "Technology Focus",
    "Consider specializing in either frontend, backend, or full-stack based on interests and market demand.",
    { x: 800, y: 650 },
  )

  // Add nodes to array
  nodes.push(
    goal1,
    milestone1,
    milestone2,
    milestone3,
    task1,
    task2,
    task3,
    task4,
    task5,
    resource1,
    resource2,
    resource3,
    note1,
  )

  // Create connections
  connections.push(
    createConnection(goal1.id, milestone1.id),
    createConnection(goal1.id, milestone2.id),
    createConnection(goal1.id, milestone3.id),
    createConnection(milestone1.id, milestone2.id),
    createConnection(milestone2.id, milestone3.id),
    createConnection(milestone1.id, task1.id),
    createConnection(milestone1.id, task2.id),
    createConnection(task1.id, task3.id),
    createConnection(task2.id, task4.id),
    createConnection(milestone2.id, task5.id),
    createConnection(task1.id, resource1.id),
    createConnection(task2.id, resource2.id),
    createConnection(task5.id, resource3.id),
    createConnection(milestone3.id, note1.id),
  )

  return { nodes, connections }
}

// Music Artist Career Template
const createMusicArtistTemplate = () => {
  const nodes: CareerNode[] = []
  const connections: NodeConnection[] = []

  // Create nodes
  const goal1 = createNode(
    "goal",
    "Establish a Successful Music Career",
    "Build a sustainable career as a music artist with a dedicated fanbase and consistent income.",
    { x: 500, y: 100 },
    { priority: "high" },
  )

  const milestone1 = createNode(
    "milestone",
    "Release First EP",
    "Produce and release a 4-5 track EP to establish your sound and brand.",
    { x: 200, y: 300 },
    { dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const milestone2 = createNode(
    "milestone",
    "Build Local Following",
    "Establish a local fanbase through regular performances and networking.",
    { x: 500, y: 300 },
    { dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const milestone3 = createNode(
    "milestone",
    "Sign with Label or Establish Independent Brand",
    "Either secure a record deal or build a strong independent artist brand.",
    { x: 800, y: 300 },
    { dueDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const task1 = createNode(
    "task",
    "Develop Signature Sound",
    "Work on creating a distinctive musical style that sets you apart.",
    { x: 100, y: 500 },
    { priority: "high", dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const task2 = createNode(
    "task",
    "Create Social Media Presence",
    "Establish profiles on key platforms and develop a content strategy.",
    { x: 350, y: 500 },
    { priority: "high", dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const task3 = createNode(
    "task",
    "Book Regular Gigs",
    "Secure regular performance opportunities at local venues.",
    { x: 200, y: 650 },
    { priority: "medium", dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const task4 = createNode(
    "task",
    "Build Email List",
    "Develop a direct connection with fans through email marketing.",
    { x: 450, y: 650 },
    { priority: "medium", dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const task5 = createNode(
    "task",
    "Collaborate with Other Artists",
    "Network and collaborate with complementary artists to expand audience.",
    { x: 600, y: 500 },
    { priority: "low", dueDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString() },
  )

  const resource1 = createNode(
    "resource",
    "Home Recording Setup",
    "Invest in basic recording equipment to produce demos and content.",
    { x: 100, y: 800 },
  )

  const resource2 = createNode(
    "resource",
    "Digital Distribution",
    "Use services like DistroKid, TuneCore, or CD Baby to get music on streaming platforms.",
    { x: 350, y: 800 },
  )

  const resource3 = createNode(
    "resource",
    "Music Industry Networking Events",
    "Attend showcases, conferences, and industry events to make connections.",
    { x: 600, y: 800 },
  )

  const note1 = createNode(
    "note",
    "Revenue Streams",
    "Diversify income through streaming, live performances, merchandise, and sync licensing.",
    { x: 800, y: 650 },
  )

  // Add nodes to array
  nodes.push(
    goal1,
    milestone1,
    milestone2,
    milestone3,
    task1,
    task2,
    task3,
    task4,
    task5,
    resource1,
    resource2,
    resource3,
    note1,
  )

  // Create connections
  connections.push(
    createConnection(goal1.id, milestone1.id),
    createConnection(goal1.id, milestone2.id),
    createConnection(goal1.id, milestone3.id),
    createConnection(milestone1.id, milestone2.id),
    createConnection(milestone2.id, milestone3.id),
    createConnection(milestone1.id, task1.id),
    createConnection(milestone1.id, task2.id),
    createConnection(milestone2.id, task3.id),
    createConnection(milestone2.id, task4.id),
    createConnection(milestone3.id, task5.id),
    createConnection(task1.id, resource1.id),
    createConnection(task2.id, resource2.id),
    createConnection(task3.id, resource3.id),
    createConnection(milestone3.id, note1.id),
  )

  return { nodes, connections }
}

// Visual Artist Career Template
const createVisualArtistTemplate = () => {
  const { nodes, connections } = createGenericTemplate(
    "Establish a Career as a Visual Artist",
    "Build a sustainable career as a visual artist with gallery representation and consistent sales.",
    ["First Gallery Exhibition", "Develop Signature Style", "Gallery Representation"],
    [
      "Create Portfolio Website",
      "Develop Artist Statement",
      "Network with Gallery Owners",
      "Apply to Artist Residencies",
      "Participate in Group Shows",
    ],
    ["Studio Space", "Online Portfolio Platforms", "Art Competitions and Grants"],
    "Consider specializing in a particular medium or theme to build recognition.",
  )

  return { nodes, connections }
}

// Business Entrepreneur Template
const createEntrepreneurTemplate = () => {
  const { nodes, connections } = createGenericTemplate(
    "Launch a Successful Business",
    "Build a profitable and sustainable business venture from concept to execution.",
    ["Business Plan Completion", "Secure Initial Funding", "First Year of Profitability"],
    [
      "Market Research",
      "Develop MVP (Minimum Viable Product)",
      "Legal Business Formation",
      "Build Website and Brand",
      "Implement Marketing Strategy",
    ],
    ["Business Incubator/Accelerator", "Mentorship Network", "Industry Associations"],
    "Focus on solving a specific problem for a well-defined target market.",
  )

  return { nodes, connections }
}

// Education Career Template
const createEducatorTemplate = () => {
  const { nodes, connections } = createGenericTemplate(
    "Advance in Education Career",
    "Progress from teaching to educational leadership and curriculum development.",
    ["Teaching Certification", "Master's Degree Completion", "Department Head Position"],
    [
      "Classroom Management Training",
      "Curriculum Development Experience",
      "Educational Technology Integration",
      "Professional Development Leadership",
      "Research Publication",
    ],
    ["Professional Teaching Associations", "Educational Conferences", "Continuing Education Programs"],
    "Consider specializing in a particular subject area, grade level, or educational approach.",
  )

  return { nodes, connections }
}

// Helper function to create a generic template
function createGenericTemplate(
  goalTitle: string,
  goalDescription: string,
  milestones: string[],
  tasks: string[],
  resources: string[],
  noteText: string,
) {
  const nodes: CareerNode[] = []
  const connections: NodeConnection[] = []

  // Create main goal
  const goal = createNode("goal", goalTitle, goalDescription, { x: 500, y: 100 }, { priority: "high" })
  nodes.push(goal)

  // Create milestones
  const milestoneNodes = milestones.map((title, index) => {
    const milestone = createNode(
      "milestone",
      title,
      `Achieve ${title.toLowerCase()} as a key step in your career progression.`,
      { x: 200 + index * 300, y: 300 },
      { dueDate: new Date(Date.now() + (index + 1) * 365 * 24 * 60 * 60 * 1000).toISOString() },
    )
    nodes.push(milestone)
    connections.push(createConnection(goal.id, milestone.id))

    if (index > 0) {
      connections.push(createConnection(nodes[nodes.length - 2].id, milestone.id))
    }

    return milestone
  })

  // Create tasks
  const taskNodes = tasks.map((title, index) => {
    const task = createNode(
      "task",
      title,
      `Complete ${title.toLowerCase()} to progress toward your career goals.`,
      { x: 100 + index * 150, y: 500 + (index % 2) * 150 },
      {
        priority: index < 2 ? "high" : index < 4 ? "medium" : "low",
        dueDate: new Date(Date.now() + (index + 1) * 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    )
    nodes.push(task)

    // Connect to appropriate milestone
    const milestoneIndex = Math.min(Math.floor(index / 2), milestoneNodes.length - 1)
    connections.push(createConnection(milestoneNodes[milestoneIndex].id, task.id))

    return task
  })

  // Create resources
  const resourceNodes = resources.map((title, index) => {
    const resource = createNode(
      "resource",
      title,
      `Utilize ${title.toLowerCase()} to support your career development.`,
      { x: 150 + index * 250, y: 800 },
    )
    nodes.push(resource)

    // Connect to appropriate task
    const taskIndex = Math.min(index, taskNodes.length - 1)
    connections.push(createConnection(taskNodes[taskIndex].id, resource.id))

    return resource
  })

  // Create note
  const note = createNode("note", "Career Focus", noteText, { x: 800, y: 650 })
  nodes.push(note)
  connections.push(createConnection(milestoneNodes[milestoneNodes.length - 1].id, note.id))

  return { nodes, connections }
}

// Export all templates
export const careerTemplates = [
  {
    id: "software-developer",
    title: "Software Developer Path",
    description: "A structured path from beginner to senior software developer.",
    category: "tech",
    difficulty: "intermediate" as const,
    nodeCount: 13,
    timeframe: "3-5 years",
    icon: <CodeIcon className="h-4 w-4" />,
    ...createSoftwareDeveloperTemplate(),
  },
  {
    id: "music-artist",
    title: "Music Artist Journey",
    description: "Build a sustainable career as an independent or signed music artist.",
    category: "music",
    difficulty: "advanced" as const,
    nodeCount: 13,
    timeframe: "2-3 years",
    icon: <MusicIcon className="h-4 w-4" />,
    ...createMusicArtistTemplate(),
  },
  {
    id: "visual-artist",
    title: "Visual Artist Path",
    description: "Establish yourself as a recognized visual artist with gallery representation.",
    category: "creative",
    difficulty: "advanced" as const,
    nodeCount: 13,
    timeframe: "3-5 years",
    icon: <PaletteIcon className="h-4 w-4" />,
    ...createVisualArtistTemplate(),
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur Journey",
    description: "Launch and grow a successful business venture from concept to profitability.",
    category: "business",
    difficulty: "advanced" as const,
    nodeCount: 13,
    timeframe: "2-4 years",
    icon: <BriefcaseIcon className="h-4 w-4" />,
    ...createEntrepreneurTemplate(),
  },
  {
    id: "educator",
    title: "Education Career Path",
    description: "Progress from teaching to educational leadership positions.",
    category: "education",
    difficulty: "intermediate" as const,
    nodeCount: 13,
    timeframe: "5-7 years",
    icon: <GraduationCapIcon className="h-4 w-4" />,
    ...createEducatorTemplate(),
  },
]

