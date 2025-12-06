import { createFileRoute, Link } from '@tanstack/react-router'
import { Home, Key, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/(error)/401')({
  component: RouteComponent,
  head: () => ({
    title: '401 - Unauthorized',
    meta: [
      {
        name: 'description',
        content: 'Authentication required to access this page',
      },
    ],
  })
})

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/5 via-background to-amber-500/5" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_50%)]" />
      
      <div className="relative w-full max-w-lg space-y-6">
        {/* Main Card */}
        <Card className="border-2 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Error Code */}
            <div className="space-y-2">
              <CardTitle className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-amber-500/60 bg-clip-text text-transparent">
                401
              </CardTitle>
              <div className="flex items-center justify-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <CardDescription className="text-xl font-semibold">
                  Unauthorized
                </CardDescription>
              </div>
            </div>
            
            <Badge variant="destructive" className="w-fit mx-auto bg-amber-500 hover:bg-amber-600">
              Authentication Required
            </Badge>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-foreground font-medium">
              You need to be authenticated to access this resource
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              This page requires authentication. Please log in with valid credentials to continue. 
              If you believe this is an error, please contact support.
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
          <span>Error Code: 401</span>
          <div className="h-px w-12 bg-border" />
        </div>
      </div>
    </div>
  )
}
