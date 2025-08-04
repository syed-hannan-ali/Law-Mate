import { FileText, Clock, CheckCircle, Calendar, Users, Plus, MessageSquare, FolderOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const lawyerMetrics = [
  {
    title: "Active Cases",
    value: "23",
    change: "+3 this week",
    changeType: "positive",
    icon: FileText,
    description: "Currently handling",
  },
  {
    title: "Pending Tasks",
    value: "8",
    change: "2 overdue",
    changeType: "warning",
    icon: Clock,
    description: "Require attention",
  },
  {
    title: "Completed This Month",
    value: "12",
    change: "+20%",
    changeType: "positive",
    icon: CheckCircle,
    description: "Cases closed",
  },
  {
    title: "Billable Hours",
    value: "156.5",
    change: "This month",
    changeType: "neutral",
    icon: Clock,
    description: "Hours logged",
  },
]

const myCases = [
  {
    id: "C001",
    title: "Personal Injury - Car Accident",
    client: "John Doe",
    status: "discovery",
    priority: "high",
    progress: 65,
    nextDeadline: "Motion due in 3 days",
    lastActivity: "Document review completed",
  },
  {
    id: "C002",
    title: "Contract Dispute",
    client: "ABC Corp",
    status: "negotiation",
    priority: "medium",
    progress: 40,
    nextDeadline: "Client meeting tomorrow",
    lastActivity: "Settlement offer received",
  },
  {
    id: "C003",
    title: "Estate Planning",
    client: "Mary Johnson",
    status: "drafting",
    priority: "low",
    progress: 80,
    nextDeadline: "Review scheduled Friday",
    lastActivity: "Will draft completed",
  },
]

const todayTasks = [
  {
    time: "9:00 AM",
    task: "Review discovery documents",
    case: "Personal Injury - Car Accident",
    priority: "high",
    estimated: "2 hours",
  },
  {
    time: "11:30 AM",
    task: "Client consultation call",
    case: "Contract Dispute",
    priority: "medium",
    estimated: "1 hour",
  },
  {
    time: "2:00 PM",
    task: "Draft motion to dismiss",
    case: "Employment Law Case",
    priority: "high",
    estimated: "3 hours",
  },
  {
    time: "4:30 PM",
    task: "Team meeting - Case strategy",
    case: "Multiple cases",
    priority: "medium",
    estimated: "1 hour",
  },
]

const recentMessages = [
  {
    from: "John Doe",
    subject: "Question about settlement",
    time: "10 min ago",
    unread: true,
  },
  {
    from: "Sarah Wilson (Paralegal)",
    subject: "Discovery documents ready",
    time: "1 hour ago",
    unread: true,
  },
  {
    from: "ABC Corp Legal Team",
    subject: "Contract amendments",
    time: "2 hours ago",
    unread: false,
  },
]

export function LawyerParalegalDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground">Good morning! Here's your workload and upcoming priorities.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {lawyerMetrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Badge
                  variant={
                    metric.changeType === "positive"
                      ? "default"
                      : metric.changeType === "warning"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {metric.change}
                </Badge>
                <span>{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* My Cases */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Active Cases</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {myCases.map((case_) => (
              <div key={case_.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{case_.title}</h4>
                    <Badge
                      variant={
                        case_.priority === "high"
                          ? "destructive"
                          : case_.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {case_.priority}
                    </Badge>
                  </div>
                  <Badge variant="outline">{case_.status}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{case_.progress}%</span>
                  </div>
                  <Progress value={case_.progress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Client: {case_.client}</span>
                  <span className="text-orange-600">{case_.nextDeadline}</span>
                </div>
                <div className="text-xs text-muted-foreground">Last: {case_.lastActivity}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Tasks & Messages */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Today's Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayTasks.slice(0, 3).map((task, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 border rounded-lg">
                  <div className="text-sm font-medium text-primary min-w-[60px]">{task.time}</div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium">{task.task}</div>
                    <div className="text-xs text-muted-foreground">
                      {task.case} • {task.estimated}
                    </div>
                  </div>
                  <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMessages.map((message, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {message.from
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{message.from}</div>
                      {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <div className="text-xs text-muted-foreground">{message.subject}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{message.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
              <FileText className="h-5 w-5 mb-2" />
              <div className="font-medium">New Document</div>
              <div className="text-sm text-muted-foreground">Create legal document</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
              <Clock className="h-5 w-5 mb-2" />
              <div className="font-medium">Log Time</div>
              <div className="text-sm text-muted-foreground">Track billable hours</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
              <Calendar className="h-5 w-5 mb-2" />
              <div className="font-medium">Schedule</div>
              <div className="text-sm text-muted-foreground">Book appointments</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
              <Users className="h-5 w-5 mb-2" />
              <div className="font-medium">Client Portal</div>
              <div className="text-sm text-muted-foreground">Manage client access</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
              <FolderOpen className="h-5 w-5 mb-2" />
              <div className="font-medium">Case Files</div>
              <div className="text-sm text-muted-foreground">Access documents</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
