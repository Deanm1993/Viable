'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  FileText, 
  Truck,
  Plus,
  MapPin,
  Phone
} from 'lucide-react'
import { JobScopingFormData, MixType, SpecificationType } from '@/types'
import { cn } from '@/lib/utils'

interface MaterialsStepProps {
  data: JobScopingFormData
  onUpdate: (data: Partial<JobScopingFormData>) => void
}

const mixTypes: { value: MixType; label: string; description: string }[] = [
  { value: 'AC10', label: 'AC10', description: 'Fine grade, 10mm aggregate' },
  { value: 'AC14', label: 'AC14', description: 'Standard grade, 14mm aggregate' },
  { value: 'AC20', label: 'AC20', description: 'Coarse grade, 20mm aggregate' },
  { value: 'SMA', label: 'SMA', description: 'Stone Mastic Asphalt, premium' },
  { value: 'custom', label: 'Custom Mix', description: 'Special specification' }
]

const specifications: { value: SpecificationType; label: string; description: string }[] = [
  { value: 'council', label: 'Council Spec', description: 'Local council requirements' },
  { value: 'rms', label: 'RMS Spec', description: 'Roads & Maritime Services' },
  { value: 'custom', label: 'Custom Spec', description: 'Project specific requirements' }
]

// Mock suppliers data
const mockSuppliers = {
  mix: [
    { id: '1', name: 'Boral Asphalt', address: 'Erskine Park NSW', phone: '02 9876 1234', rate: 145 },
    { id: '2', name: 'Fulton Hogan', address: 'Eastern Creek NSW', phone: '02 9875 5678', rate: 150 },
    { id: '3', name: 'Downer Group', address: 'St Marys NSW', phone: '02 9874 9012', rate: 148 }
  ],
  tip: [
    { id: '4', name: 'Cleanaway Waste', address: 'Eastern Creek NSW', phone: '02 9875 4321', rate: 35 },
    { id: '5', name: 'SUEZ Recycling', address: 'Wetherill Park NSW', phone: '02 9873 6789', rate: 32 },
    { id: '6', name: 'JJ Richards', address: 'Smithfield NSW', phone: '02 9872 3456', rate: 38 }
  ]
}

export default function MaterialsStep({ data, onUpdate }: MaterialsStepProps) {
  const updateMaterials = (updates: Partial<typeof data.materials>) => {
    onUpdate({
      materials: {
        ...data.materials,
        ...updates
      }
    })
  }

  const setMixType = (mixType: MixType) => {
    updateMaterials({ mix_type: mixType })
    
    // Auto-populate specification based on mix type
    if (mixType === 'SMA') {
      updateMaterials({ 
        mix_type: mixType,
        specification: 'rms' // SMA typically uses RMS spec
      })
    }
  }

  const setSpecification = (spec: SpecificationType) => {
    updateMaterials({ specification: spec })
  }

  const selectSupplier = (supplierId: string, type: 'mix' | 'tip') => {
    if (type === 'mix') {
      updateMaterials({ mix_supplier_id: supplierId })
    } else {
      updateMaterials({ tip_site_id: supplierId })
    }
  }

  return (
    <div className="space-y-8">
      {/* Mix Type Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Package className="h-4 w-4" />
            Asphalt Mix Type
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select the appropriate asphalt mix for this application
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mixTypes.map((mix) => (
            <button
              key={mix.value}
              onClick={() => setMixType(mix.value)}
              className={cn(
                "p-4 rounded-lg border text-left transition-colors touch-target",
                data.materials.mix_type === mix.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-accent"
              )}
            >
              <div className="font-medium">{mix.label}</div>
              <div className="text-sm opacity-75">{mix.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Specification */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Specification
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Choose the specification standard for this project
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {specifications.map((spec) => (
            <button
              key={spec.value}
              onClick={() => setSpecification(spec.value)}
              className={cn(
                "p-4 rounded-lg border text-left transition-colors touch-target",
                data.materials.specification === spec.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-accent"
              )}
            >
              <div className="font-medium">{spec.label}</div>
              <div className="text-sm opacity-75">{spec.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mix Supplier */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Mix Supplier
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Select your preferred asphalt mix supplier
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {mockSuppliers.mix.map((supplier) => (
            <button
              key={supplier.id}
              onClick={() => selectSupplier(supplier.id, 'mix')}
              className={cn(
                "p-4 rounded-lg border text-left transition-colors touch-target",
                data.materials.mix_supplier_id === supplier.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-accent"
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{supplier.name}</div>
                  <div className="text-sm opacity-75 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {supplier.address}
                  </div>
                  <div className="text-sm opacity-75 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {supplier.phone}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">${supplier.rate}</div>
                  <div className="text-xs opacity-75">per tonne</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tip Site */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">
              Tip Site for Milled Material
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Where will the milled asphalt be disposed of?
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {mockSuppliers.tip.map((tipSite) => (
            <button
              key={tipSite.id}
              onClick={() => selectSupplier(tipSite.id, 'tip')}
              className={cn(
                "p-4 rounded-lg border text-left transition-colors touch-target",
                data.materials.tip_site_id === tipSite.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-accent"
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{tipSite.name}</div>
                  <div className="text-sm opacity-75 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {tipSite.address}
                  </div>
                  <div className="text-sm opacity-75 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {tipSite.phone}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">${tipSite.rate}</div>
                  <div className="text-xs opacity-75">per tonne</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Mix Details */}
      {data.materials.mix_type === 'custom' && (
        <div className="space-y-4 border-t border-border pt-6">
          <Label className="text-base font-medium">
            Custom Mix Specification
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="custom-mix-name">Mix Name/Code</Label>
              <Input
                id="custom-mix-name"
                placeholder="e.g., AC14 Modified"
              />
            </div>
            <div>
              <Label htmlFor="aggregate-size">Max Aggregate Size (mm)</Label>
              <Input
                id="aggregate-size"
                type="number"
                placeholder="14"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="mix-notes">Additional Requirements</Label>
            <textarea
              id="mix-notes"
              placeholder="Special additives, temperature requirements, etc..."
              className="w-full min-h-[80px] p-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            />
          </div>
        </div>
      )}
    </div>
  )
}