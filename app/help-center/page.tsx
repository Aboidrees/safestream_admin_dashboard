import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Shield,
  Search,
  BookOpen,
  Video,
  FileText,
  MessageCircle,
  Users,
  Settings,
  Smartphone,
  Lock,
  CreditCard,
  HelpCircle,
  ArrowRight,
  Download,
} from "lucide-react"

export default function HelpCenterPage() {
  const helpCategories = [
    {
      icon: BookOpen,
      title: "Getting Started Guide",
      description: "Step-by-step tutorials to help you set up SafeStream for your family",
      color: "from-blue-500 to-blue-600",
      articles: [
        "Creating Your First Account",
        "Setting Up Child Profiles",
        "Curating Your First Collection",
        "Understanding Age Ratings",
      ],
    },
    {
      icon: Settings,
      title: "Parental Controls",
      description: "Learn how to use all parental control features effectively",
      color: "from-purple-500 to-purple-600",
      articles: [
        "Setting Time Limits",
        "Content Filtering Options",
        "Blocking Inappropriate Content",
        "Managing Multiple Profiles",
      ],
    },
    {
      icon: Smartphone,
      title: "Device Setup",
      description: "Instructions for setting up SafeStream on all your devices",
      color: "from-green-500 to-green-600",
      articles: [
        "Mobile App Installation",
        "Smart TV Setup",
        "QR Code Login Guide",
        "Troubleshooting Connection Issues",
      ],
    },
    {
      icon: Lock,
      title: "Safety & Privacy",
      description: "Understanding how we protect your family's privacy and safety",
      color: "from-red-500 to-red-600",
      articles: [
        "Privacy Settings Overview",
        "Data Protection Measures",
        "Child Safety Features",
        "Reporting Inappropriate Content",
      ],
    },
    {
      icon: CreditCard,
      title: "Billing & Subscriptions",
      description: "Manage your subscription and understand billing",
      color: "from-orange-500 to-orange-600",
      articles: ["Subscription Plans Explained", "Payment Methods", "Cancellation Process", "Refund Policy"],
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "Solutions to common technical issues and problems",
      color: "from-indigo-500 to-indigo-600",
      articles: ["App Won't Load", "Video Playback Issues", "Login Problems", "Sync Issues Across Devices"],
    },
  ]

  const quickActions = [
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      action: "Watch Now",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Download,
      title: "User Manual",
      description: "Download the complete SafeStream guide",
      action: "Download PDF",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      color: "from-green-500 to-blue-500",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-20 float"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center slide-in-left">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <BookOpen className="h-8 w-8 text-red-500" />
              <span className="text-red-500 font-medium text-lg">Help Center</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              How Can We{" "}
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Help You?
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Find guides, tutorials, and resources to help you make the most of SafeStream for your family.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search help articles..."
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-red-500 rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Help</h2>
            <p className="text-xl text-gray-600">Get immediate assistance with these popular resources</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 scale-in stagger-${index + 1} group cursor-pointer overflow-hidden`}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500`}
                  >
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-500">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6 leading-relaxed">{action.description}</p>
                  <Button
                    className={`bg-gradient-to-r ${action.color} hover:shadow-lg transition-all duration-300 group`}
                  >
                    {action.action}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find detailed guides and tutorials organized by topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 scale-in stagger-${index + 1} group cursor-pointer`}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-500`}
                  >
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-500">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
                  <div className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <div
                        key={articleIndex}
                        className="flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors duration-300 cursor-pointer"
                      >
                        <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{article}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-6 hover:border-red-500 hover:text-red-500 transition-all duration-300 bg-transparent"
                  >
                    View All Articles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Articles</h2>
            <p className="text-xl text-gray-600">Most viewed help articles this month</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "How to Set Up Your First Child Profile",
                description: "A complete walkthrough of creating safe, age-appropriate profiles for your children.",
                readTime: "5 min read",
                views: "2.3k views",
              },
              {
                title: "Understanding SafeStream's Content Filtering",
                description:
                  "Learn how our advanced filtering system keeps inappropriate content away from your children.",
                readTime: "7 min read",
                views: "1.8k views",
              },
              {
                title: "Setting Up QR Code Login for Kids",
                description: "Make it easy and secure for your children to access their profiles with QR codes.",
                readTime: "3 min read",
                views: "1.5k views",
              },
              {
                title: "Troubleshooting Common Playback Issues",
                description: "Quick solutions to the most common video playback problems on all devices.",
                readTime: "4 min read",
                views: "1.2k views",
              },
            ].map((article, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] scale-in stagger-${index + 1} group cursor-pointer`}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300 leading-tight">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 leading-relaxed">{article.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.readTime}</span>
                    <span>{article.views}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 gradient-shift relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="fade-in">
            <Users className="h-16 w-16 text-white mx-auto mb-6 float" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Still Need Personal Help?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Our expert support team is available 24/7 to help you with any questions or issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-us">
                <Button className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105">
                  Contact Support
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 text-lg font-semibold transition-all duration-700 transform hover:scale-105 bg-transparent"
              >
                Schedule a Call
              </Button>
            </div>
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
