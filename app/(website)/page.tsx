import Link from "next/link"
import { Users, Clock, BarChart3, QrCode, Zap, CheckCircle, Play, Shield } from "lucide-react"
import { WebsiteNavbar } from "@/components/website-navbar"

export default function WebsiteHomePage() {
  return (
    <div className="min-h-screen bg-white">
      <WebsiteNavbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Safe Content for Your{" "}
                <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  Children
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Create a curated, safe viewing experience with parent-controlled streaming that grows with your family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard/login" 
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-center"
                >
                  Get Started Free
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="bg-white text-red-500 px-8 py-4 rounded-lg font-semibold border-2 border-red-500 hover:bg-red-50 transition-all duration-300 text-center"
                >
                  Learn More
                </Link>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <div className="w-80 h-96 mx-auto bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl shadow-2xl transform rotate-6">
                  <div className="absolute inset-4 bg-white rounded-2xl shadow-lg"></div>
                </div>
              </div>
              <div className="absolute top-10 -right-4 w-6 h-6 bg-red-500 rounded-full animate-bounce"></div>
              <div className="absolute top-32 -left-8 w-4 h-4 bg-pink-500 rounded-full animate-bounce delay-300"></div>
              <div className="absolute bottom-20 -right-8 w-5 h-5 bg-red-400 rounded-full animate-bounce delay-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Features Parents Love
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create a safe, controlled, and enjoyable viewing experience for your children.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Play className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Content Curation</h3>
              <p className="text-gray-600">Carefully selected, age-appropriate content that grows with your child.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Profiles</h3>
              <p className="text-gray-600">Create individual profiles for each child with personalized settings.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Time Controls</h3>
              <p className="text-gray-600">Set daily limits and bedtime restrictions to manage screen time.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Watch History</h3>
              <p className="text-gray-600">Track what your children watch and get detailed reports.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <QrCode className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">QR Login</h3>
              <p className="text-gray-600">Easy device pairing with secure QR code authentication.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Controls</h3>
              <p className="text-gray-600">Pause, skip, or stop content remotely from your parent dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How SafeStream Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple 4-step process designed for busy parents.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <Users className="h-6 w-6 text-gray-400 absolute -top-2 left-1/2 transform -translate-x-1/2" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Your Account</h3>
              <p className="text-gray-600">Sign up in seconds with your email and create your parent profile.</p>
            </div>
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <Users className="h-6 w-6 text-gray-400 absolute -top-2 left-1/2 transform -translate-x-1/2" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Add Child Profiles</h3>
              <p className="text-gray-600">Create individual profiles for each child with age-appropriate settings.</p>
            </div>
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <Play className="h-6 w-6 text-gray-400 absolute -top-2 left-1/2 transform -translate-x-1/2" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Curate Content</h3>
              <p className="text-gray-600">Browse our library and add videos to your child's collection.</p>
            </div>
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <QrCode className="h-6 w-6 text-gray-400 absolute -top-2 left-1/2 transform -translate-x-1/2" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect Devices</h3>
              <p className="text-gray-600">Pair your child's device using our secure QR code system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your family. Start free, upgrade anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">Free</div>
              <p className="text-gray-600 mb-8">Perfect for trying out SafeStream</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>1 Child Profile</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>5 Collections</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Basic Content Filtering</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>30 Min Daily Limit</span>
                </li>
              </ul>
              <Link href="/dashboard/login" className="w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-200 transition-colors text-center block">
                Get Started
              </Link>
            </div>

            {/* Family Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-red-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Family</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">$5.99<span className="text-lg text-gray-600">/month</span></div>
              <p className="text-gray-600 mb-8">Best for growing families</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>3 Child Profiles</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Unlimited Collections</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Advanced Content Filtering</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Custom Time Limits</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Watch History & Reports</span>
                </li>
              </ul>
              <Link href="/dashboard/login" className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-center block">
                Choose Plan
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">$9.99<span className="text-lg text-gray-600">/month</span></div>
              <p className="text-gray-600 mb-8">For large families & power users</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>10 Child Profiles</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Unlimited Collections</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Premium Content Library</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Detailed Analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Priority Support</span>
                </li>
              </ul>
              <Link href="/dashboard/login" className="w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-200 transition-colors text-center block">
                Choose Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Shield className="h-16 w-16 text-red-500 mx-auto" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to create a safer viewing experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of parents who trust SafeStream for their children's digital wellbeing.
          </p>
          <Link href="/dashboard/login" className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 inline-block shadow-lg">
            Get Started Today
          </Link>
        </div>
      </section>

    </div>
  )
}
