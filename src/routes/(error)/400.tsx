import { createFileRoute, Link } from '@tanstack/react-router'
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/(error)/400')({
  component: RouteComponent,
  head: () => ({
    title: '400 - Bad Request',
    meta: [
      {
        name: 'description',
        content: 'The request is invalid or malformed',
      },
    ],
  })
})

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-yellow-500/5 via-background to-yellow-500/5" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
      
      <div className="relative w-full max-w-lg space-y-6">
        {/* Main Card */}
        <Card className="border-2 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Error Code */}
            <div className="space-y-2">
              <CardTitle className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-500 to-yellow-500/60 bg-clip-text text-transparent">
                400
              </CardTitle>
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <CardDescription className="text-xl font-semibold">
                  Bad Request
                </CardDescription>
              </div>
            </div>
            
            <Badge variant="destructive" className="w-fit mx-auto bg-yellow-500 hover:bg-yellow-600">
              Invalid Request
            </Badge>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-foreground font-medium">
              The request is invalid or malformed
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              The server cannot process your request due to invalid syntax or missing required parameters. 
              Please check your input and try again.
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
          <span>Error Code: 400</span>
          <div className="h-px w-12 bg-border" />
        </div>
      </div>
    </div>
  )
}
