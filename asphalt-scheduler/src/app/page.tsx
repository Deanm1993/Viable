import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ClipboardList, 
  Calendar, 
  TrendingUp, 
  Truck,
  Plus,
  Clock,
  AlertTriangle 
} from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'

// Mock data for demonstration
const todayJobs = [
  {
    id: '1',
    jobNumber: 'SAS2024001',
    customer: 'City of Sydney',
    location: '123 George Street, Sydney',
    type: 'Mill & Fill',
    tonnage: 45.5,
    status: 'in_progress',
    crew: 'Alpha Crew'
  },
  {
    id: '2',
    jobNumber: 'SAS2024002', 
    customer: 'Westfield',
    location: 'Pitt Street Mall',
    type: 'Overlay',
    tonnage: 28.0,
    status: 'scheduled',
    crew: 'Beta Crew'
  }
]

const quickStats = [
  {
    name: 'Jobs This Week',
    value: '12',
    change: '+2 from last week',
    icon: Truck,
    color: 'text-blue-600'
  },
  {
    name: 'Total Tonnage',
    value: '340.5t',
    change: '+15% from last week', 
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    name: 'Active Jobs',
    value: '4',
    change: '2 in progress',
    icon: Clock,
    color: 'text-orange-600'
  },
  {
    name: 'Pending Quotes',
    value: '7',
    change: '3 urgent',
    icon: AlertTriangle,
    color: 'text-red-600'
  }
]

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-mobile-xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="touch-target">
              <Link href="/jobs/new">
                <Plus className="h-4 w-4 mr-2" />
                New Job Scope
              </Link>
            </Button>
            <Button variant="outline" asChild className="touch-target">
              <Link href="/calendar">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid-mobile">
          {quickStats.map((stat) => (
            <div
              key={stat.name}
              className="bg-card rounded-lg border border-border p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-foreground">
                      {stat.value}
                    </dd>
                    <dd className="text-sm text-muted-foreground">
                      {stat.change}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Jobs */}
        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Today's Jobs
            </h2>
          </div>
          <div className="divide-y divide-border">
            {todayJobs.map((job) => (
              <div key={job.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">
                        {job.jobNumber}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'in_progress' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {job.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {job.customer} • {job.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {job.type} • {job.tonnage}t • {job.crew}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs/${job.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/jobs/${job.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-border">
            <Button variant="outline" asChild className="w-full">
              <Link href="/jobs">
                View All Jobs
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" size="lg" asChild className="h-20 flex-col gap-2">
            <Link href="/jobs/new">
              <ClipboardList className="h-6 w-6" />
              <span className="text-sm">Scope Job</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-20 flex-col gap-2">
            <Link href="/calendar">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Schedule</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-20 flex-col gap-2">
            <Link href="/customers/new">
              <Plus className="h-6 w-6" />
              <span className="text-sm">New Customer</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-20 flex-col gap-2">
            <Link href="/reports">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Reports</span>
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
