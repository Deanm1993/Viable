'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { MapPin, AlertTriangle, Clock, Sun, Moon } from 'lucide-react'
import { JobScopingFormData, TruckType, SiteHazard } from '@/types'
import { cn } from '@/lib/utils'

interface LocationStepProps {
  data: JobScopingFormData
  onUpdate: (data: Partial<JobScopingFormData>) => void
}

const truckTypes: { value: TruckType; label: string; description: string }[] = [
  { value: 'truck_dog', label: 'Truck & Dog', description: '25-30t capacity' },
  { value: 'semi', label: 'Semi Trailer', description: '25-35t capacity' },
  { value: 'rigid', label: 'Rigid Truck', description: '15-20t capacity' }
]

const siteHazards: { type: SiteHazard['type']; label: string; description: string }[] = [
  { type: 'low_powerlines', label: 'Low Powerlines', description: 'Height restrictions for equipment' },
  { type: 'tight_access', label: 'Tight Access', description: 'Limited maneuvering space' },
  { type: 'steep_grades', label: 'Steep Grades', description: 'Sloped surfaces affecting equipment' },
  { type: 'underground_services', label: 'Underground Services', description: 'Utilities requiring special care' }
]

export default function LocationStep({ data, onUpdate }: LocationStepProps) {
  const [addressSearch, setAddressSearch] = useState(data.location.address)

  const updateLocation = (updates: Partial<typeof data.location>) => {
    onUpdate({
      location: {
        ...data.location,
        ...updates
      }
    })
  }

  const toggleTruckType = (truckType: TruckType) => {
    const currentTypes = data.location.site_restrictions.truck_types
    const newTypes = currentTypes.includes(truckType)
      ? currentTypes.filter(t => t !== truckType)
      : [...currentTypes, truckType]
    
    updateLocation({
      site_restrictions: {
        ...data.location.site_restrictions,
        truck_types: newTypes
      }
    })
  }

  const toggleHazard = (hazardType: SiteHazard['type']) => {
    const currentHazards = data.location.site_restrictions.hazards
    const existingHazard = currentHazards.find(h => h.type === hazardType)
    
    if (existingHazard) {
      const newHazards = currentHazards.filter(h => h.type !== hazardType)
      updateLocation({
        site_restrictions: {
          ...data.location.site_restrictions,
          hazards: newHazards
        }
      })
    } else {
      const newHazards = [...currentHazards, { type: hazardType }]
      updateLocation({
        site_restrictions: {
          ...data.location.site_restrictions,
          hazards: newHazards
        }
      })
    }
  }

  const setShiftType = (shift: 'day' | 'night') => {
    updateLocation({ shift_type: shift })
  }

  const searchAddress = () => {
    updateLocation({ address: addressSearch })
    // TODO: Integrate with Google Maps API for geocoding
  }

  return (
    <div className="space-y-8">
      {/* Job Address */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="address" className="text-base font-medium">
            Job Address
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the complete address where the work will be performed
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            id="address"
            placeholder="123 Main Street, Sydney NSW 2000"
            value={addressSearch}
            onChange={(e) => setAddressSearch(e.target.value)}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            onClick={searchAddress}
            className="shrink-0"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Locate
          </Button>
        </div>
        
        {data.location.address && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Address Confirmed</span>
            </div>
            <p className="text-sm text-green-700 mt-1">{data.location.address}</p>
          </div>
        )}
      </div>

      {/* Site Access Restrictions */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">
            Truck Access
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select which truck types can access the site
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {truckTypes.map((truck) => (
            <button
              key={truck.value}
              onClick={() => toggleTruckType(truck.value)}
              className={cn(
                "p-4 rounded-lg border text-left transition-colors touch-target",
                data.location.site_restrictions.truck_types.includes(truck.value)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-accent"
              )}
            >
              <div className="font-medium">{truck.label}</div>
              <div className="text-sm opacity-75">{truck.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Site Hazards */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Site Hazards
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Identify any site hazards that may affect equipment or operations
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {siteHazards.map((hazard) => {
            const isSelected = data.location.site_restrictions.hazards.some(h => h.type === hazard.type)
            
            return (
              <button
                key={hazard.type}
                onClick={() => toggleHazard(hazard.type)}
                className={cn(
                  "p-4 rounded-lg border text-left transition-colors touch-target",
                  isSelected
                    ? "bg-orange-50 text-orange-800 border-orange-200"
                    : "bg-card text-foreground border-border hover:bg-accent"
                )}
              >
                <div className="font-medium">{hazard.label}</div>
                <div className="text-sm opacity-75">{hazard.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Shift Type */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Work Shift
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Night work typically includes penalty rates and requires additional lighting
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShiftType('day')}
            className={cn(
              "p-4 rounded-lg border text-center transition-colors touch-target",
              data.location.shift_type === 'day'
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-accent"
            )}
          >
            <Sun className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Day Shift</div>
            <div className="text-sm opacity-75">6:00 AM - 6:00 PM</div>
          </button>
          
          <button
            onClick={() => setShiftType('night')}
            className={cn(
              "p-4 rounded-lg border text-center transition-colors touch-target",
              data.location.shift_type === 'night'
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-accent"
            )}
          >
            <Moon className="h-6 w-6 mx-auto mb-2" />
            <div className="font-medium">Night Shift</div>
            <div className="text-sm opacity-75">6:00 PM - 6:00 AM</div>
            <div className="text-xs opacity-75 mt-1">+25% penalty rates</div>
          </button>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-4">
        <Label htmlFor="access-notes" className="text-base font-medium">
          Additional Access Notes
        </Label>
        <textarea
          id="access-notes"
          placeholder="Any additional information about site access, parking, traffic management requirements..."
          className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
          value={data.location.site_restrictions.access_notes || ''}
          onChange={(e) => updateLocation({
            site_restrictions: {
              ...data.location.site_restrictions,
              access_notes: e.target.value
            }
          })}
        />
      </div>
    </div>
  )
}