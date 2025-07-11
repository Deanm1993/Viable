'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Calendar,
  Plus,
  User,
  Phone,
  Mail,
  Clock
} from 'lucide-react'
import { JobScopingFormData } from '@/types'
import { cn } from '@/lib/utils'
import { calculateDuration } from '@/lib/utils'

interface AssignmentStepProps {
  data: JobScopingFormData
  onUpdate: (data: Partial<JobScopingFormData>) => void
}

// Mock data for customers and crews
const mockCustomers = [
  { 
    id: '1', 
    name: 'City of Sydney', 
    contact: 'John Smith', 
    phone: '0412 345 678',
    email: 'john.smith@cityofsydney.nsw.gov.au'
  },
  { 
    id: '2', 
    name: 'Westfield Shopping Centre', 
    contact: 'Mary Johnson', 
    phone: '0423 456 789',
    email: 'mary.johnson@westfield.com'
  },
  { 
    id: '3', 
    name: 'Blacktown City Council', 
    contact: 'David Wilson', 
    phone: '0434 567 890',
    email: 'david.wilson@blacktown.nsw.gov.au'
  }
]

const mockCrews = [
  { id: 'alpha', name: 'Alpha Crew', supervisor: 'Mike Thompson', size: 4, available: true },
  { id: 'beta', name: 'Beta Crew', supervisor: 'Sarah Connor', size: 5, available: true },
  { id: 'gamma', name: 'Gamma Crew', supervisor: 'Tom Jackson', size: 3, available: false }
]

export default function AssignmentStep({ data, onUpdate }: AssignmentStepProps) {
  const updateAssignment = (updates: Partial<typeof data.assignment>) => {
    onUpdate({
      assignment: {
        ...data.assignment,
        ...updates
      }
    })
  }

  const selectCustomer = (customerId: string) => {
    updateAssignment({ customer_id: customerId })
  }

  const selectCrew = (crewName: string, supervisor: string) => {
    updateAssignment({ 
      crew_name: crewName,
      supervisor: supervisor
    })
  }

  const updateCrewSize = (size: number) => {
    updateAssignment({ crew_size: size })
  }

  const setScheduledDate = (date: string) => {
    updateAssignment({ scheduled_date: date })
  }

  // Calculate estimated duration
  const estimatedDuration = data.tonnage_required 
    ? calculateDuration(data.tonnage_required, data.assignment.crew_size)
    : 0

  return (
    <div className="space-y-8">
      {/* Customer Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Select the customer for this project
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Customer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {mockCustomers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => selectCustomer(customer.id)}
              className={cn(
                "p-4 rounded-lg border text-left transition-colors touch-target",
                data.assignment.customer_id === customer.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-accent"
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm opacity-75 mt-1">{customer.contact}</div>
                  <div className="text-sm opacity-75 flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Crew Assignment */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Crew Assignment
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Assign a crew to this project
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockCrews.map((crew) => (
            <button
              key={crew.id}
              onClick={() => selectCrew(crew.name, crew.supervisor)}
              disabled={!crew.available}
              className={cn(
                "p-4 rounded-lg border text-left transition-colors touch-target",
                !crew.available && "opacity-50 cursor-not-allowed",
                data.assignment.crew_name === crew.name
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-accent"
              )}
            >
              <div className="font-medium">{crew.name}</div>
              <div className="text-sm opacity-75 mt-1">
                Supervisor: {crew.supervisor}
              </div>
              <div className="text-sm opacity-75">
                {crew.size} workers • {crew.available ? 'Available' : 'Unavailable'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Crew Size Adjustment */}
      <div className="space-y-4">
        <Label className="text-base font-medium">
          Crew Size for This Job
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="crew-size">Number of Workers</Label>
            <Input
              id="crew-size"
              type="number"
              placeholder="4"
              min="2"
              max="8"
              value={data.assignment.crew_size}
              onChange={(e) => updateCrewSize(parseInt(e.target.value) || 4)}
            />
          </div>
          <div>
            <Label htmlFor="supervisor">Supervisor</Label>
            <Input
              id="supervisor"
              placeholder="Enter supervisor name"
              value={data.assignment.supervisor || ''}
              onChange={(e) => updateAssignment({ supervisor: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Scheduling */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduling
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Set the proposed start date for this project
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="scheduled-date">Proposed Start Date</Label>
            <Input
              id="scheduled-date"
              type="date"
              value={data.assignment.scheduled_date || ''}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
          
          {estimatedDuration > 0 && (
            <div>
              <Label>Estimated Duration</Label>
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <Clock className="h-4 w-4 text-green-700" />
                <span className="text-green-800 font-medium">
                  {estimatedDuration} hours
                </span>
                <span className="text-sm text-green-600">
                  ({Math.ceil(estimatedDuration / 8)} {estimatedDuration <= 8 ? 'day' : 'days'})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Summary */}
      {data.tonnage_required && data.assignment.customer_id && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800 mb-3">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Project Summary</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-blue-700 font-medium">Total Tonnage</div>
              <div className="text-lg text-blue-800">{data.tonnage_required.toFixed(1)}t</div>
            </div>
            
            <div>
              <div className="text-blue-700 font-medium">Truck Loads</div>
              <div className="text-lg text-blue-800">{data.truck_loads} loads</div>
            </div>
            
            <div>
              <div className="text-blue-700 font-medium">Crew Productivity</div>
              <div className="text-lg text-blue-800">
                {data.assignment.crew_size > 0 
                  ? (data.tonnage_required / data.assignment.crew_size / 8).toFixed(1)
                  : '0'
                }t/person/day
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Notes */}
      <div className="space-y-4">
        <Label htmlFor="project-notes" className="text-base font-medium">
          Project Notes
        </Label>
        <textarea
          id="project-notes"
          placeholder="Any additional notes about the project, special requirements, customer preferences..."
          className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
          value={data.notes || ''}
          onChange={(e) => onUpdate({ notes: e.target.value })}
        />
      </div>
    </div>
  )
}