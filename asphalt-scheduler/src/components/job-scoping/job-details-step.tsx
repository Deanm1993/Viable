'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Wrench, 
  Calculator, 
  Layers, 
  Construction,
  AlertCircle
} from 'lucide-react'
import { JobScopingFormData, JobType } from '@/types'
import { cn } from '@/lib/utils'
import { calculateTonnage, calculateTruckLoads, formatTonnage } from '@/lib/utils'

interface JobDetailsStepProps {
  data: JobScopingFormData
  onUpdate: (data: Partial<JobScopingFormData>) => void
}

const jobTypes: { 
  value: JobType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  fields: string[]
}[] = [
  {
    value: 'mill_fill',
    label: 'Mill & Fill',
    description: 'Remove existing asphalt and replace with new',
    icon: Wrench,
    fields: ['milling_area', 'milling_depth', 'paving_area', 'paving_thickness']
  },
  {
    value: 'resheet',
    label: 'Resheet',
    description: 'Complete removal and replacement',
    icon: Construction,
    fields: ['milling_area', 'milling_depth', 'paving_area', 'paving_thickness']
  },
  {
    value: 'overlay',
    label: 'Overlay',
    description: 'New asphalt over existing surface',
    icon: Layers,
    fields: ['paving_area', 'paving_thickness']
  },
  {
    value: 'patching',
    label: 'Patching',
    description: 'Repair specific areas',
    icon: Construction,
    fields: ['paving_area', 'paving_thickness']
  },
  {
    value: 'full_reconstruction',
    label: 'Full Reconstruction',
    description: 'Complete rebuild including base',
    icon: Construction,
    fields: ['milling_area', 'milling_depth', 'paving_area', 'paving_thickness']
  }
]

export default function JobDetailsStep({ data, onUpdate }: JobDetailsStepProps) {
  const [calculations, setCalculations] = useState({
    tonnageRequired: 0,
    truckLoads: 0,
    milledTonnage: 0
  })

  const [warnings, setWarnings] = useState<string[]>([])

  const updateJobDetails = (updates: Partial<typeof data.job_details>) => {
    onUpdate({
      job_details: {
        ...data.job_details,
        ...updates
      }
    })
  }

  const updateMeasurement = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0
    updateJobDetails({
      measurements: {
        ...data.job_details.measurements,
        [field]: numValue
      }
    })
  }

  const setJobType = (jobType: JobType) => {
    updateJobDetails({ job_type: jobType })
    
    // Auto-populate smart defaults based on job type
    if (jobType === 'mill_fill') {
      // Mill & Fill typically requires tack coat and sweeper
      onUpdate({
        resources: {
          ...data.resources,
          equipment_required: {
            ...data.resources.equipment_required,
            sweeper: true
          }
        }
      })
    }
  }

  // Recalculate tonnage whenever measurements change
  useEffect(() => {
    const measurements = data.job_details.measurements
    const newWarnings: string[] = []
    
    // Calculate paving tonnage
    let pavingTonnage = 0
    if (measurements.paving_area && measurements.paving_thickness) {
      pavingTonnage = calculateTonnage(measurements.paving_area, measurements.paving_thickness)
      
      // Validation warnings
      if (measurements.paving_thickness > 100) {
        newWarnings.push('Paving thickness over 100mm - consider multiple lifts')
      }
      if (measurements.paving_thickness < 25) {
        newWarnings.push('Paving thickness under 25mm may be too thin for AC14')
      }
    }
    
    // Calculate milled tonnage
    let milledTonnage = 0
    if (measurements.milling_area && measurements.milling_depth) {
      milledTonnage = calculateTonnage(measurements.milling_area, measurements.milling_depth)
    }
    
    const truckLoads = calculateTruckLoads(pavingTonnage)
    
    // Update local state
    setCalculations({
      tonnageRequired: pavingTonnage,
      truckLoads: truckLoads,
      milledTonnage: milledTonnage
    })
    
    setWarnings(newWarnings)
    
    // Update parent component directly here - only when measurements actually change
    if (pavingTonnage > 0) {
      onUpdate({
        tonnage_required: pavingTonnage,
        truck_loads: truckLoads
      })
    }
  }, [data.job_details.measurements])

  const selectedJobType = jobTypes.find(jt => jt.value === data.job_details.job_type)

  return (
    <div className="space-y-8">
      {/* Job Type Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">
            Type of Work
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select the primary type of asphalt work to be performed
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {jobTypes.map((jobType) => (
            <button
              key={jobType.value}
              onClick={() => setJobType(jobType.value)}
              className={cn(
                "p-4 rounded-lg border text-left transition-colors touch-target",
                data.job_details.job_type === jobType.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-accent"
              )}
            >
              <jobType.icon className="h-6 w-6 mb-2" />
              <div className="font-medium">{jobType.label}</div>
              <div className="text-sm opacity-75">{jobType.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Diagram */}
      {selectedJobType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Construction className="h-4 w-4" />
            <span className="font-medium">{selectedJobType.label} Process</span>
          </div>
          <div className="text-sm text-blue-700">
            {selectedJobType.value === 'mill_fill' && (
              <div>1. Mill existing asphalt → 2. Clean surface → 3. Apply tack coat → 4. Lay new asphalt → 5. Compact</div>
            )}
            {selectedJobType.value === 'overlay' && (
              <div>1. Clean surface → 2. Apply tack coat → 3. Lay new asphalt → 4. Compact</div>
            )}
            {selectedJobType.value === 'resheet' && (
              <div>1. Mill to formation → 2. Clean surface → 3. Lay new asphalt → 4. Compact</div>
            )}
            {selectedJobType.value === 'patching' && (
              <div>1. Cut out damaged area → 2. Clean → 3. Apply tack coat → 4. Lay patch → 5. Compact</div>
            )}
            {selectedJobType.value === 'full_reconstruction' && (
              <div>1. Mill existing → 2. Prepare base → 3. Install new base → 4. Lay asphalt → 5. Compact</div>
            )}
          </div>
        </div>
      )}

      {/* Measurements */}
      {selectedJobType && (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">
              Measurements
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Enter accurate measurements for tonnage calculations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Milling fields */}
            {selectedJobType.fields.includes('milling_area') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="milling-area">
                    Milling Area (m²)
                  </Label>
                  <Input
                    id="milling-area"
                    type="number"
                    placeholder="500"
                    value={data.job_details.measurements.milling_area || ''}
                    onChange={(e) => updateMeasurement('milling_area', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="milling-depth">
                    Milling Depth (mm)
                  </Label>
                  <Input
                    id="milling-depth"
                    type="number"
                    placeholder="50"
                    value={data.job_details.measurements.milling_depth || ''}
                    onChange={(e) => updateMeasurement('milling_depth', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Paving fields */}
            {selectedJobType.fields.includes('paving_area') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="paving-area">
                    Paving Area (m²)
                  </Label>
                  <Input
                    id="paving-area"
                    type="number"
                    placeholder="500"
                    value={data.job_details.measurements.paving_area || ''}
                    onChange={(e) => updateMeasurement('paving_area', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paving-thickness">
                    Paving Thickness (mm)
                  </Label>
                  <Input
                    id="paving-thickness"
                    type="number"
                    placeholder="50"
                    value={data.job_details.measurements.paving_thickness || ''}
                    onChange={(e) => updateMeasurement('paving_thickness', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Alternative measurement method */}
          <div className="border-t border-border pt-4">
            <Label className="text-sm font-medium text-muted-foreground">
              Alternative: Length × Width
            </Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Input placeholder="Length (m)" />
              <Input placeholder="Width (m)" />
              <button className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md">
                Calculate Area
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calculations Display */}
      {calculations.tonnageRequired > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800 mb-3">
            <Calculator className="h-4 w-4" />
            <span className="font-medium">Automatic Calculations</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-green-700 font-medium">Paving Tonnage</div>
              <div className="text-lg text-green-800">{formatTonnage(calculations.tonnageRequired)}</div>
            </div>
            
            <div>
              <div className="text-green-700 font-medium">Truck Loads</div>
              <div className="text-lg text-green-800">{calculations.truckLoads} loads</div>
              <div className="text-xs text-green-600">@ 25t per load</div>
            </div>
            
            {calculations.milledTonnage > 0 && (
              <div>
                <div className="text-green-700 font-medium">Milled Material</div>
                <div className="text-lg text-green-800">{formatTonnage(calculations.milledTonnage)}</div>
                <div className="text-xs text-green-600">to tip site</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-800 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Validation Warnings</span>
          </div>
          <ul className="text-sm text-orange-700 space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}