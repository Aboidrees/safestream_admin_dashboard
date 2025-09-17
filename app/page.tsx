import { NavigationHeader } from "@/components/navigation-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Sparkles,
  Shield,
  Zap,
  Video,
  Users,
  Clock,
  BarChart3,
  Smartphone,
  UserPlus,
  Target,
  QrCode,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-20 float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="slide-in-left">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-5 w-5 text-red-500" />
                <span className="text-red-500 font-medium text-sm">Family-Safe Streaming</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Safe Content for Your{" "}
                <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Children
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Create a curated, safe viewing experience with parent-controlled streaming that grows with your family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-700 transform hover:scale-105 pulse-glow">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-red-500 hover:text-red-500 px-8 py-4 text-lg font-semibold transition-all duration-700 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center slide-in-right">
              <div className="relative">
                <div className="w-64 h-[500px] gradient-shift rounded-[3rem] border-8 border-gray-800 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-1000"></div>
                <div className="absolute inset-0 w-64 h-[500px] bg-white/10 rounded-[3rem] border-8 border-transparent backdrop-blur-sm"></div>
                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-500 rounded-full shadow-lg float"></div>
                <div
                  className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-500 rounded-full shadow-lg float"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute top-1/2 -right-8 w-4 h-4 bg-purple-500 rounded-full shadow-lg float"
                  style={{ animationDelay: "2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Parents Love */}
      <section id="features" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Features Parents Love</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create a safe, controlled, and enjoyable viewing experience for your children.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "Content Curation",
                description: "Create custom collections of videos from YouTube, Vimeo, or other trusted sources.",
                color: "from-purple-500 to-purple-600",
                delay: "stagger-1",
              },
              {
                icon: Users,
                title: "Multiple Profiles",
                description: "Manage multiple child accounts with customized content for each child.",
                color: "from-orange-500 to-orange-600",
                delay: "stagger-2",
              },
              {
                icon: Clock,
                title: "Time Controls",
                description: "Set daily screen time limits that automatically pause viewing when time is up.",
                color: "from-red-500 to-red-600",
                delay: "stagger-3",
              },
              {
                icon: BarChart3,
                title: "Watch History",
                description: "Monitor what your children are watching and track viewing habits.",
                color: "from-blue-500 to-blue-600",
                delay: "stagger-4",
              },
              {
                icon: QrCode,
                title: "QR Login",
                description: "Children scan simple QR codes for easy, password-free login.",
                color: "from-indigo-500 to-indigo-600",
                delay: "stagger-5",
              },
              {
                icon: Zap,
                title: "Real-time Controls",
                description: "Pause, monitor, and manage content remotely for all devices.",
                color: "from-yellow-500 to-yellow-600",
                delay: "stagger-6",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 scale-in ${feature.delay} group cursor-pointer`}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-500">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How SafeStream Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-30 float"></div>
          <div
            className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 float"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How SafeStream Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple 4-step process designed for busy parents.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Account",
                description: "Sign up in a minute and set up your parent dashboard.",
                icon: UserPlus,
              },
              {
                step: "2",
                title: "Add Child Profiles",
                description: "Create profiles for each of your children with age-appropriate settings.",
                icon: Users,
              },
              {
                step: "3",
                title: "Curate Content",
                description: "Add videos to collections and assign them to your children's profiles.",
                icon: Target,
              },
              {
                step: "4",
                title: "Connect Devices",
                description: "Securely connect child's devices using our simple QR code system.",
                icon: Smartphone,
              },
            ].map((item, index) => (
              <div key={index} className={`text-center slide-up stagger-${index + 1} group`}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg group-hover:shadow-xl transition-all duration-700 transform group-hover:scale-110 pulse-glow">
                    {item.step}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-red-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-500 transition-colors duration-500">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your family. Start free, upgrade anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-700 transform hover:scale-105 scale-in stagger-1">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Basic</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">Free</span>
                </div>
                <p className="text-gray-500 mt-2">Perfect for trying out SafeStream</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {["1 Child Profile", "5 Collections", "Basic Content Filtering", "30 Min Daily Limit"].map(
                    (feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ),
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-8 bg-transparent hover:bg-gray-50 transition-all duration-500"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Family Plan */}
            <Card className="border-2 border-red-500 relative transform scale-105 shadow-2xl scale-in stagger-2">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 text-sm font-semibold shadow-lg">
                  MOST POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Family</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    $5.99
                  </span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
                <p className="text-gray-500 mt-2">Best for growing families</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    "3 Child Profiles",
                    "Unlimited Collections",
                    "Advanced Content Filtering",
                    "Custom Time Limits",
                    "Watch History & Reports",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-8 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-700 transform hover:scale-105">
                  Choose Plan
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-gray-200 hover:border-purple-300 transition-all duration-700 transform hover:scale-105 scale-in stagger-3">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Premium</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    $9.99
                  </span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
                <p className="text-gray-500 mt-2">For large families & power users</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    "10 Child Profiles",
                    "Unlimited Collections",
                    "Premium Content Library",
                    "Detailed Analytics",
                    "Priority Support",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-8 bg-transparent hover:bg-purple-50 border-purple-200 hover:border-purple-300 transition-all duration-500"
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-shift relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="fade-in">
            <Zap className="h-16 w-16 text-white mx-auto mb-6 float" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to create a safer viewing experience?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of parents who trust SafeStream for their children's digital wellbeing.
            </p>
            <Link href="/register">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 fade-in">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  SafeStream
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                A parent-controlled streaming platform that allows parents to create a safe viewing environment for
                their children.
              </p>
              <p className="text-gray-500 text-sm">© 2024 SafeStream. All rights reserved.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help-center"
                    className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
