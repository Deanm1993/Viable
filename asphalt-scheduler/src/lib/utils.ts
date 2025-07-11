import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Asphalt calculation utilities
export const calculateTonnage = (area: number, depth: number, density: number = 2.4): number => {
  return area * (depth / 1000) * density
}

export const calculateTruckLoads = (tonnage: number, truckCapacity: number = 25): number => {
  return Math.ceil(tonnage / truckCapacity)
}

export const calculateDuration = (tonnage: number, crewSize: number, hourlyRate: number = 20): number => {
  return Math.ceil(tonnage / (crewSize * hourlyRate))
}

export const formatTonnage = (tonnage: number): string => {
  return `${tonnage.toFixed(1)}t`
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount)
}

export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(1)}km`
}