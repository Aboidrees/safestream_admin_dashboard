import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Users, CheckCircle, Star, Play, Smartphone, Tv, Monitor } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-pink-50">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">Trusted by 10,000+ families</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Safe Streaming for
            <span className="block bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Your Family
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Create a worry-free viewing experience with age-appropriate content, smart parental controls, and real-time
            monitoring for your children.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 px-8 py-6 text-lg hover:bg-gray-50 bg-transparent"
            >
              <Play className="w-5 h-5 mr-2" />
              See How It Works
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Features Parents Love</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to keep your children safe while they enjoy quality content
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-red-200 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Age-Appropriate Content</h3>
                <p className="text-gray-600 leading-relaxed">
                  Curated library filtered by age groups with content ratings and educational value indicators.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Screen Time Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Set daily limits, schedule viewing times, and receive notifications when limits are reached.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Multiple Profiles</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create separate profiles for each child with personalized content recommendations and settings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Content Rating System</h3>
                <p className="text-gray-600 leading-relaxed">
                  Clear ratings for violence, language, and themes so you know exactly what your kids watch.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Real-Time Monitoring</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track viewing history and receive instant alerts for any concerning content attempts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Educational Content</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access to thousands of educational videos that make learning fun and engaging.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-red-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How SafeStream Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Create Profiles</h3>
              <p className="text-gray-600 leading-relaxed">
                Set up individual profiles for each child with their age, interests, and viewing preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Set Controls</h3>
              <p className="text-gray-600 leading-relaxed">
                Configure screen time limits, content filters, and notification preferences for each profile.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Watch Safely</h3>
              <p className="text-gray-600 leading-relaxed">
                Let your children explore age-appropriate content while you monitor their activity in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose the plan that works best for your family</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-red-200 transition-all">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Basic</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$9.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Up to 2 child profiles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Basic content filtering</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Screen time controls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Viewing history</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-4 border-red-600 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Family</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$19.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Up to 5 child profiles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Advanced content filtering</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Real-time monitoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Educational content library</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-all">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Premium</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$29.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Unlimited child profiles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">AI-powered content analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Custom content playlists</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Detailed analytics reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">24/7 premium support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Offline viewing</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-red-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Watch Anywhere, Anytime</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            SafeStream works seamlessly across all your devices
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">Mobile</h3>
              <p className="text-gray-600">iOS & Android apps</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Monitor className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">Desktop</h3>
              <p className="text-gray-600">Mac & Windows</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Tv className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">Smart TV</h3>
              <p className="text-gray-600">Apple TV, Roku & more</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Create a Safer Viewing Experience?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of families who trust SafeStream to protect their children online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-lg">
                Start Your Free Trial
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg bg-transparent"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold">SafeStream</span>
              </div>
              <p className="text-gray-400">Creating safe digital experiences for families worldwide.</p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SafeStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
