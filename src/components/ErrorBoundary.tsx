'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Note: Le logger ne peut pas être utilisé ici car c'est un composant de classe
    // et les imports peuvent poser problème. On garde console.error pour l'instant.
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md w-full p-8 bg-card border border-destructive/20">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-destructive/10 rounded-full">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Oups ! Une erreur est survenue
                </h2>
                <p className="text-muted-foreground mb-4">
                  Nous sommes désolés, quelque chose s'est mal passé.
                </p>
              </div>

              {this.state.error && (
                <details className="w-full">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Détails techniques
                  </summary>
                  <pre className="mt-2 text-xs text-left bg-muted p-3 rounded overflow-auto max-h-32">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 w-full">
                <Button
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="flex-1"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
                <Button
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex-1"
                >
                  Retour au Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
