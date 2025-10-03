import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, User, ArrowRight, Clock, MessageCircle, Heart, Share2, Shield } from "lucide-react"
import { WebsiteNavbar } from "@/components/website-navbar"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Tips for Creating Safe Digital Spaces for Children",
      excerpt:
        "Learn how to establish healthy boundaries and create secure online environments that protect your children while allowing them to explore and learn.",
      author: "Sarah Johnson",
      date: "December 15, 2024",
      readTime: "5 min read",
      category: "Parenting Tips",
      image: "/placeholder.svg?height=300&width=500&text=Digital+Safety",
      featured: true,
    },
    {
      id: 2,
      title: "The Psychology Behind Screen Time: What Every Parent Should Know",
      excerpt:
        "Understanding how screen time affects child development and practical strategies for managing digital consumption in a healthy way.",
      author: "Dr. Michael Chen",
      date: "December 12, 2024",
      readTime: "7 min read",
      category: "Child Development",
      image: "/placeholder.svg?height=300&width=500&text=Screen+Time",
      featured: false,
    },
    {
      id: 3,
      title: "Building Trust Through Transparent Content Curation",
      excerpt:
        "How SafeStream's approach to content curation helps parents maintain trust while giving children age-appropriate entertainment options.",
      author: "Emily Rodriguez",
      date: "December 10, 2024",
      readTime: "4 min read",
      category: "Platform Updates",
      image: "/placeholder.svg?height=300&width=500&text=Content+Curation",
      featured: false,
    },
    {
      id: 4,
      title: "The Future of Family-Friendly Streaming: Trends and Predictions",
      excerpt:
        "Exploring emerging trends in family entertainment and how technology is evolving to better serve parents and children.",
      author: "Sarah Johnson",
      date: "December 8, 2024",
      readTime: "6 min read",
      category: "Industry Insights",
      image: "/placeholder.svg?height=300&width=500&text=Future+Streaming",
      featured: false,
    },
    {
      id: 5,
      title: "Success Stories: How Families Are Thriving with SafeStream",
      excerpt:
        "Real stories from parents who have transformed their family's digital experience using SafeStream's parental control features.",
      author: "Community Team",
      date: "December 5, 2024",
      readTime: "8 min read",
      category: "Success Stories",
      image: "/placeholder.svg?height=300&width=500&text=Success+Stories",
      featured: false,
    },
    {
      id: 6,
      title: "Understanding Age-Appropriate Content: A Parent's Guide",
      excerpt:
        "Navigate the complexities of age-appropriate content selection with our comprehensive guide to content ratings and recommendations.",
      author: "Dr. Michael Chen",
      date: "December 3, 2024",
      readTime: "5 min read",
      category: "Parenting Tips",
      image: "/placeholder.svg?height=300&width=500&text=Age+Appropriate",
      featured: false,
    },
  ]

  const categories = [
    "All",
    "Parenting Tips",
    "Child Development",
    "Platform Updates",
    "Industry Insights",
    "Success Stories",
  ]

  return (
    <div className="min-h-screen bg-white">
      <WebsiteNavbar currentPage="blog" />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-20 float"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center slide-in-left">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Shield className="h-8 w-8 text-red-500" />
              <span className="text-red-500 font-medium text-lg">SafeStream Blog</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Insights for{" "}
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Modern Parents
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Expert advice, parenting tips, and insights on creating safe digital experiences for your family.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={`${
                  index === 0
                    ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    : "hover:border-red-500 hover:text-red-500"
                } transition-all duration-300`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Article</h2>
          </div>

          <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-[1.02] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={blogPosts[0].image || "/placeholder.svg"}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">Featured</Badge>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="outline" className="border-red-200 text-red-600">
                    {blogPosts[0].category}
                  </Badge>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {blogPosts[0].date}
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{blogPosts[0].author}</p>
                      <p className="text-sm text-gray-500">{blogPosts[0].readTime}</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 group">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <Card
                key={post.id}
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 scale-in stagger-${index + 1} group cursor-pointer overflow-hidden`}
              >
                <div className="relative h-48">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className="bg-white/90 border-red-200 text-red-600">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="hover:text-red-500">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:text-red-500">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 gradient-shift relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="fade-in">
            <MessageCircle className="h-16 w-16 text-white mx-auto mb-6 float" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Stay Updated with SafeStream</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get the latest parenting tips, platform updates, and expert insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
