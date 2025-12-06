import { createFileRoute, Link } from '@tanstack/react-router'
import { Home, Server, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/(error)/503')({
  component: RouteComponent,
  head: () => ({
    title: '503 - Service Unavailable',
    meta: [
      {
        name: 'description',
        content: 'The service is temporarily unavailable',
      },
    ],
  })
})

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-500/5 via-background to-orange-500/5" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_50%)]" />
      
      <div className="relative w-full max-w-lg space-y-6">
        {/* Main Card */}
        <Card className="border-2 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Error Code */}
            <div className="space-y-2">
              <CardTitle className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-orange-500/60 bg-clip-text text-transparent">
                503
              </CardTitle>
              <div className="flex items-center justify-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <CardDescription className="text-xl font-semibold">
                  Service Unavailable
                </CardDescription>
              </div>
            </div>
            
            <Badge variant="destructive" className="w-fit mx-auto bg-orange-500 hover:bg-orange-600">
              Temporarily Unavailable
            </Badge>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-foreground font-medium">
              The service is temporarily unavailable
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              We're currently experiencing technical difficulties. Our team has been notified and is working 
              to restore service as soon as possible. Please try again in a few moments.
            </p>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
            <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardFooter>
        </Card>
        
        {/* Decorative Elements */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="h-px w-12 bg-border" />
          <span>Error Code: 503</span>
          <div className="h-px w-12 bg-border" />
        </div>
      </div>
    </div>
  )
}
