import { createFileRoute, Link } from '@tanstack/react-router'
import { Home, Timer, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/(error)/429')({
  component: RouteComponent,
  head: () => ({
    title: '429 - Too Many Requests',
    meta: [
      {
        name: 'description',
        content: 'Too many requests have been sent',
      },
    ],
  })
})

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/5 via-background to-purple-500/5" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
      
      <div className="relative w-full max-w-lg space-y-6">
        {/* Main Card */}
        <Card className="border-2 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Error Code */}
            <div className="space-y-2">
              <CardTitle className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 to-purple-500/60 bg-clip-text text-transparent">
                429
              </CardTitle>
              <div className="flex items-center justify-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <CardDescription className="text-xl font-semibold">
                  Too Many Requests
                </CardDescription>
              </div>
            </div>
            
            <Badge variant="destructive" className="w-fit mx-auto bg-purple-500 hover:bg-purple-600">
              Rate Limit Exceeded
            </Badge>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-foreground font-medium">
              You've made too many requests
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              You have exceeded the rate limit for requests. Please wait a moment before trying again. 
              This helps us maintain service quality for all users.
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
          <span>Error Code: 429</span>
          <div className="h-px w-12 bg-border" />
        </div>
      </div>
    </div>
  )
}
