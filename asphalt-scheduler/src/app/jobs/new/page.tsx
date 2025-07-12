'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { JobScopingFormData, FormStep } from '@/types'
import LocationStep from '@/components/job-scoping/location-step'
import JobDetailsStep from '@/components/job-scoping/job-details-step'
import MaterialsStep from '@/components/job-scoping/materials-step'
import ResourcesStep from '@/components/job-scoping/resources-step'
import AssignmentStep from '@/components/job-scoping/assignment-step'
import { cn } from '@/lib/utils'

const initialFormData: JobScopingFormData = {
  location: {
    address: '',
    site_restrictions: {
      truck_types: [],
      hazards: []
    },
    shift_type: 'day'
  },
  job_details: {
    job_type: 'mill_fill',
    measurements: {}
  },
  materials: {
    mix_type: 'AC14',
    specification: 'council'
  },
  resources: {
    equipment_required: {},
    services_required: {}
  },
  assignment: {
    customer_id: '',
    crew_size: 4
  }
}

const steps: FormStep[] = [
  {
    id: 'location',
    title: 'Location & Site Details',
    description: 'Job address, site restrictions, and shift details',
    component: LocationStep,
    isComplete: false
  },
  {
    id: 'job-details',
    title: 'Job Type & Measurements',
    description: 'Type of work and measurements required',
    component: JobDetailsStep,
    isComplete: false
  },
  {
    id: 'materials',
    title: 'Materials & Specifications',
    description: 'Asphalt mix type, specifications, and suppliers',
    component: MaterialsStep,
    isComplete: false
  },
  {
    id: 'resources',
    title: 'Resources Required',
    description: 'Equipment, services, and crew requirements',
    component: ResourcesStep,
    isComplete: false
  },
  {
    id: 'assignment',
    title: 'Crew & Customer',
    description: 'Customer details, crew assignment, and scheduling',
    component: AssignmentStep,
    isComplete: false
  }
]

export default function NewJobScope() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<JobScopingFormData>(initialFormData)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const progress = ((currentStep + 1) / steps.length) * 100

  const updateFormData = useCallback((stepData: Partial<JobScopingFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...stepData
    }))
  }, [])

  const markStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]))
  }

  const goToNextStep = () => {
    markStepComplete(currentStep)
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const handleSubmit = async () => {
    markStepComplete(currentStep)
    // TODO: Submit form data to Supabase
    console.log('Submitting form data:', formData)
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-mobile-xl font-bold text-foreground">
            New Job Scope
          </h1>
          <p className="text-muted-foreground">
            Fill out the details to create a comprehensive job scope and quote.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigator */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={cn(
                "p-3 rounded-lg border text-left transition-colors touch-target",
                index === currentStep
                  ? "bg-primary text-primary-foreground border-primary"
                  : completedSteps.has(index)
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-card text-muted-foreground border-border hover:bg-accent"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {completedSteps.has(index) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
                <span className="text-sm font-medium truncate">
                  {step.title}
                </span>
              </div>
              <p className="text-xs opacity-75 truncate">
                {step.description}
              </p>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>

          <CurrentStepComponent 
            data={formData}
            onUpdate={updateFormData}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            className="touch-target"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="touch-target"
            >
              Save Draft
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="touch-target"
              >
                Create Job Scope
              </Button>
            ) : (
              <Button
                onClick={goToNextStep}
                className="touch-target"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}