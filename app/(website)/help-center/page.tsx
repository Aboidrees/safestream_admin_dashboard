import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  BookOpen,
  Shield,
  Users,
  Video,
  Settings,
  CreditCard,
  MessageCircle,
  ArrowRight,
  Star,
  Clock,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"

export default function HelpCenterPage() {
  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of SafeStream",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      articles: 12,
      popular: true,
    },
    {
      title: "Safety & Content",
      description: "Understanding our safety features",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      articles: 8,
      popular: true,
    },
    {
      title: "Parental Controls",
      description: "Managing your child's experience",
      icon: Settings,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      articles: 15,
      popular: true,
    },
    {
      title: "Video Collections",
      description: "Creating and managing collections",
      icon: Video,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      articles: 10,
      popular: false,
    },
    {
      title: "Billing & Plans",
      description: "Subscription and payment help",
      icon: CreditCard,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      articles: 6,
      popular: false,
    },
    {
      title: "Technical Support",
      description: "Troubleshooting and device help",
      icon: HelpCircle,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      articles: 9,
      popular: false,
    },
  ]

  const popularArticles = [
    {
      title: "How to create your first child profile",
      category: "Getting Started",
      readTime: "3 min read",
      views: "2.1k views",
    },
    {
      title: "Setting up screen time limits",
      category: "Parental Controls",
      readTime: "5 min read",
      views: "1.8k views",
    },
    {
      title: "Understanding SafeStream's content filtering",
      category: "Safety & Content",
      readTime: "4 min read",
      views: "1.5k views",
    },
    {
      title: "Creating your first video collection",
      category: "Video Collections",
      readTime: "6 min read",
      views: "1.3k views",
    },
    {
      title: "Troubleshooting video playback issues",
      category: "Technical Support",
      readTime: "4 min read",
      views: "1.1k views",
    },
  ]

  const recentUpdates = [
    {
      title: "New parental dashboard features",
      date: "2 days ago",
      type: "Feature Update",
    },
    {
      title: "Enhanced content filtering system",
      date: "1 week ago",
      type: "Safety Update",
    },
    {
      title: "Mobile app improvements",
      date: "2 weeks ago",
      type: "Technical Update",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Help Center
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">How can we help you today?</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Search our knowledge base for answers, guides, and tutorials to get the most out of SafeStream.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for help articles, guides, and tutorials..."
              className="pl-12 pr-4 py-4 text-lg bg-white/90 backdrop-blur-sm border-white/30 focus:bg-white focus:border-white"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Help Categories */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find help articles organized by topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md cursor-pointer group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                      <category.icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    {category.popular && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{category.articles} articles</span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Popular Articles */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {article.category}
                            </Badge>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {article.readTime}
                            </div>
                            <span>{article.views}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Quick Start Guide */}
            <section>
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="w-6 h-6 mr-3 text-green-600" />
                    Quick Start Guide
                  </CardTitle>
                  <CardDescription className="text-lg">
                    New to SafeStream? Follow our step-by-step guide to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Create your account</h4>
                          <p className="text-sm text-gray-600">Sign up and verify your email address</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Set up child profiles</h4>
                          <p className="text-sm text-gray-600">Add your children with age-appropriate settings</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Create collections</h4>
                          <p className="text-sm text-gray-600">Curate safe, educational content</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Configure parental controls</h4>
                          <p className="text-sm text-gray-600">Set screen time limits and restrictions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-6">
                    Start Quick Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Support */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Need More Help?</CardTitle>
                <CardDescription>Can't find what you're looking for? Our support team is here to help.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Link href="/faq">
                  <Button variant="outline" className="w-full bg-transparent">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    View FAQ
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Users className="w-4 h-4 mr-2" />
                    Join Community
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Updates</CardTitle>
                <CardDescription>Latest improvements and new features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-gray-900 mb-1">{update.title}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <Badge variant="outline" className="bg-gray-50 text-gray-600">
                        {update.type}
                      </Badge>
                      <span>{update.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/register" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  Create Account
                </Link>
                <Link href="/login" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  Sign In
                </Link>
                <Link href="/dashboard" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  Dashboard
                </Link>
                <Link href="/privacy-policy" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  Terms of Service
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
