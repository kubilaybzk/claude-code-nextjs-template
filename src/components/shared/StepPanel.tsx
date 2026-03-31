'use client'

import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface StepConfig {
  id: string
  label: string
  icon?: ReactNode
  description?: string
}

interface StepPanelProps {
  steps: StepConfig[]
  activeStep: string
  completedSteps?: Set<string>
  onStepChange?: (stepId: string) => void
}

export function StepPanel({
  steps,
  activeStep,
  completedSteps = new Set<string>(),
  onStepChange,
}: StepPanelProps) {
  return (
    <div className="step-panel">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep
        const isCompleted = completedSteps.has(step.id)

        return (
          <Button
            key={step.id}
            type="button"
            variant="ghost"
            onClick={() => onStepChange?.(step.id)}
            className={cn(
              'step-panel__button',
              isActive ? 'step-panel__button--active' : 'step-panel__button--idle',
            )}
          >
            <div className="step-panel__content">
              <div className="step-panel__icon">
                {step.icon ?? index + 1}
              </div>
              <div className="step-panel__text">
                <div className="step-panel__label">
                  {step.label}
                  {isCompleted && !isActive ? ' ✓' : ''}
                </div>
                {step.description ? (
                  <div className="step-panel__description">{step.description}</div>
                ) : null}
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
