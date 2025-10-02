import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  Star,
  Play,
  Heart,
  CheckCircle,
  Smartphone,
  Monitor,
  Tablet,
  ArrowRight,
  Youtube,
  Filter,
  Lock,
  Eye,
  UserCheck,
  Timer,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Star className="w-4 h-4 mr-2" />
                  Trusted by 10,000+ Families
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Safe YouTube for{" "}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Your Kids
                  </span>
                </h1>
                <p className="text-xl text-blue-100 max-w-2xl">
                  Create curated video collections from YouTube that are safe, educational, and entertaining for your
                  children. Complete parental control with peace of mind.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 bg-transparent"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    See How It Works
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                  <span>No ads</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                  <span>100% safe content</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                  <span>Parental controls</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Emma's Learning Time</h3>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <Play className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: "ABC Songs", duration: "15 min", thumbnail: "🎵" },
                      { title: "Science Fun", duration: "12 min", thumbnail: "🔬" },
                      { title: "Story Time", duration: "20 min", thumbnail: "📚" },
                      { title: "Art & Craft", duration: "18 min", thumbnail: "🎨" },
                    ].map((video, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-3 space-y-2">
                        <div className="text-2xl">{video.thumbnail}</div>
                        <div>
                          <p className="font-medium text-sm">{video.title}</p>
                          <p className="text-xs text-blue-200">{video.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">Screen time today: 45 min</span>
                    <span className="text-green-300">✓ All safe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              <Shield className="w-4 h-4 mr-2" />
              Features Parents Love
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Everything you need for safe streaming</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SafeStream gives you complete control over your child's viewing experience with powerful tools designed
              for modern families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Youtube,
                title: "YouTube Integration",
                description: "Seamlessly curate content from YouTube's vast library while maintaining complete safety.",
                color: "text-red-600",
                bgColor: "bg-red-50",
              },
              {
                icon: Filter,
                title: "Smart Content Filtering",
                description:
                  "AI-powered filtering ensures only age-appropriate, educational content reaches your kids.",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: Lock,
                title: "Parental Controls",
                description: "Set viewing schedules, time limits, and content restrictions with granular control.",
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
              {
                icon: Eye,
                title: "Real-time Monitoring",
                description: "Track what your children watch, when they watch it, and for how long.",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                icon: UserCheck,
                title: "Multiple Child Profiles",
                description: "Create personalized profiles for each child with age-appropriate content and settings.",
                color: "text-orange-600",
                bgColor: "bg-orange-50",
              },
              {
                icon: Timer,
                title: "Screen Time Management",
                description: "Set daily limits, break reminders, and bedtime restrictions to promote healthy habits.",
                color: "text-pink-600",
                bgColor: "bg-pink-50",
              },
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <Zap className="w-4 h-4 mr-2" />
              How SafeStream Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Get started in 3 simple steps</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Setting up a safe viewing environment for your children has never been easier.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Child Profiles",
                description:
                  "Set up individual profiles for each child with their age, interests, and viewing preferences.",
                icon: Users,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                step: "02",
                title: "Curate Safe Collections",
                description:
                  "Browse and select videos from YouTube to create custom collections tailored to each child.",
                icon: Heart,
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                step: "03",
                title: "Monitor & Enjoy",
                description:
                  "Your children enjoy safe, educational content while you monitor their viewing habits in real-time.",
                icon: Shield,
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <step.icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                    <div className="text-4xl font-bold text-gray-300 mb-2">{step.step}</div>
                    <CardTitle className="text-xl font-semibold text-gray-900">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 leading-relaxed">{step.description}</CardDescription>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Star className="w-4 h-4 mr-2" />
              Simple Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Choose the perfect plan for your family</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with our free plan and upgrade as your family grows. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for trying out SafeStream",
                features: [
                  "1 child profile",
                  "Up to 10 videos per collection",
                  "Basic parental controls",
                  "Email support",
                ],
                cta: "Start Free",
                popular: false,
              },
              {
                name: "Family",
                price: "$9.99",
                period: "per month",
                description: "Best for most families",
                features: [
                  "Up to 5 child profiles",
                  "Unlimited videos and collections",
                  "Advanced parental controls",
                  "Screen time management",
                  "Priority support",
                  "Offline viewing",
                ],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Premium",
                price: "$19.99",
                period: "per month",
                description: "For large families and educators",
                features: [
                  "Unlimited child profiles",
                  "Everything in Family plan",
                  "Advanced analytics",
                  "Custom content categories",
                  "API access",
                  "Dedicated support",
                ],
                cta: "Start Free Trial",
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-lg transition-shadow duration-300 ${
                  plan.popular ? "border-2 border-blue-500 shadow-lg" : "border-0 shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.price}
                      <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                    </div>
                    <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="block">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <Monitor className="w-4 h-4 mr-2" />
              Works Everywhere
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Available on all your devices</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SafeStream works seamlessly across all your family's devices, ensuring a consistent and safe experience
              everywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Mobile & Tablet",
                description: "iOS and Android apps with offline viewing and parental controls on the go.",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: Monitor,
                title: "Desktop & Laptop",
                description: "Full-featured web app that works in any modern browser with all features.",
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
              {
                icon: Tablet,
                title: "Smart TV",
                description: "Cast to your TV or use our smart TV apps for the big screen experience.",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
            ].map((device, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 ${device.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <device.icon className={`h-8 w-8 ${device.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{device.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{device.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to create a safer YouTube experience?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of families who trust SafeStream to provide safe, educational, and entertaining content for
              their children.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact-us">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 bg-transparent"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">SafeStream</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Creating safe, educational, and entertaining video experiences for children worldwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
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
              <h3 className="font-semibold mb-4">Company</h3>
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
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help-center" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
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

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SafeStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
