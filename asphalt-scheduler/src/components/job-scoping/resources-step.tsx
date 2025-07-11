'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Wrench, 
  Users,
  Truck,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { JobScopingFormData } from '@/types'
import { cn } from '@/lib/utils'

interface ResourcesStepProps {
  data: JobScopingFormData
  onUpdate: (data: Partial<JobScopingFormData>) => void
}

const equipment = [
  { id: 'paver', label: 'Paver', required: true, description: 'Asphalt laying machine' },
  { id: 'sweeper', label: 'Sweeper', required: false, description: 'Surface cleaning' },
  { id: 'bobcat', label: 'Bobcat/Skid Steer', required: false, description: 'Material handling' },
  { id: 'hand_tools', label: 'Hand Tools', required: true, description: 'Rakes, shovels, etc.' }
]

const services = [
  { id: 'traffic_controllers', label: 'Traffic Controllers', description: 'Road safety management' },
  { id: 'water_cart', label: 'Water Cart', description: 'Dust suppression' },
  { id: 'line_marking', label: 'Line Marking', description: 'Post-paving marking' },
  { id: 'survey_setout', label: 'Survey Set Out', description: 'Level and grade checking' },
  { id: 'quality_testing', label: 'Quality Testing', description: 'Compaction and temperature testing' }
]

export default function ResourcesStep({ data, onUpdate }: ResourcesStepProps) {
  const updateResources = (updates: Partial<typeof data.resources>) => {
    onUpdate({
      resources: {
        ...data.resources,
        ...updates
      }
    })
  }

  const toggleEquipment = (equipmentId: string) => {
    const current = data.resources.equipment_required as any
    updateResources({
      equipment_required: {
        ...current,
        [equipmentId]: !current[equipmentId]
      }
    })
  }

  const toggleService = (serviceId: string) => {
    const current = data.resources.services_required as any
    updateResources({
      services_required: {
        ...current,
        [serviceId]: !current[serviceId]
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Equipment Required */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Plant & Equipment
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select the equipment needed for this job
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {equipment.map((item) => {
            const isSelected = (data.resources.equipment_required as any)?.[item.id]
            
            return (
              <button
                key={item.id}
                onClick={() => toggleEquipment(item.id)}
                className={cn(
                  "p-4 rounded-lg border text-left transition-colors touch-target",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:bg-accent"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {isSelected ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4 rounded border-2 border-current" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.label}</span>
                      {item.required && (
                        <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="text-sm opacity-75">{item.description}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Roller Details */}
      <div className="space-y-4">
        <Label className="text-base font-medium">
          Compaction Equipment
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="multi-tyre-rollers">Multi-Tyre Rollers</Label>
            <Input
              id="multi-tyre-rollers"
              type="number"
              placeholder="2"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="steel-drum-rollers">Steel Drum Rollers</Label>
            <Input
              id="steel-drum-rollers"
              type="number"
              placeholder="1"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Services Required */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Services Required
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Additional services needed for this project
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {services.map((service) => {
            const isSelected = (data.resources.services_required as any)?.[service.id]
            
            return (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={cn(
                  "p-4 rounded-lg border text-left transition-colors touch-target",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:bg-accent"
                )}
              >
                <div className="flex items-center gap-3">
                  <div>
                    {isSelected ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4 rounded border-2 border-current" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{service.label}</div>
                    <div className="text-sm opacity-75">{service.description}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Traffic Control Details */}
      {(data.resources.services_required as any)?.traffic_controllers && (
        <div className="space-y-4 border-t border-border pt-6">
          <Label className="text-base font-medium">
            Traffic Control Details
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tc-positions">Number of Positions</Label>
              <Input
                id="tc-positions"
                type="number"
                placeholder="2"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="tc-hours">Hours Required</Label>
              <Input
                id="tc-hours"
                type="number"
                placeholder="8"
                min="1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Smart Warnings */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Smart Recommendations</span>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          {data.job_details.job_type === 'mill_fill' && (
            <li>• Mill & Fill jobs typically require sweeping between operations</li>
          )}
          {data.location.shift_type === 'night' && (
            <li>• Night work requires additional lighting equipment</li>
          )}
          {data.location.site_restrictions.hazards.some(h => h.type === 'underground_services') && (
            <li>• Underground services detected - consider hand digging and locating services</li>
          )}
          <li>• All main road work requires traffic controllers</li>
        </ul>
      </div>
    </div>
  )
}