import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight, Shield, Users, BookOpen, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  const blogPosts = [
    {
      title: "10 Tips for Creating Safe Screen Time Routines",
      excerpt:
        "Discover evidence-based strategies for establishing healthy digital habits that work for the whole family.",
      author: "Dr. Emily Rodriguez",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Parenting Tips",
      image: "/family-using-tablet-together.jpg",
      featured: true,
    },
    {
      title: "The Science Behind Age-Appropriate Content",
      excerpt:
        "Understanding how children's cognitive development affects their ability to process different types of media content.",
      author: "Sarah Johnson",
      date: "2024-01-10",
      readTime: "7 min read",
      category: "Child Development",
      image: "/child-learning-with-educational-content.jpg",
      featured: false,
    },
    {
      title: "Building Digital Literacy in Young Children",
      excerpt: "Essential skills every child needs to navigate the digital world safely and confidently.",
      author: "Michael Chen",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "Education",
      image: "/children-learning-digital-skills.jpg",
      featured: false,
    },
    {
      title: "How to Talk to Your Kids About Online Safety",
      excerpt: "Age-appropriate conversations that help children understand internet safety without causing fear.",
      author: "Dr. Emily Rodriguez",
      date: "2023-12-28",
      readTime: "8 min read",
      category: "Safety",
      image: "/parent-and-child-talking-about-internet-safety.jpg",
      featured: false,
    },
    {
      title: "The Benefits of Curated Content vs. Algorithm-Driven Feeds",
      excerpt: "Why human curation creates better learning outcomes than automated content recommendations.",
      author: "Sarah Johnson",
      date: "2023-12-20",
      readTime: "4 min read",
      category: "Technology",
      image: "/curated-educational-content-for-children.jpg",
      featured: false,
    },
    {
      title: "Creating Educational Playlists That Kids Actually Enjoy",
      excerpt: "Strategies for balancing entertainment and education in your child's viewing experience.",
      author: "Michael Chen",
      date: "2023-12-15",
      readTime: "5 min read",
      category: "Content Creation",
      image: "/educational-video-playlist-for-kids.jpg",
      featured: false,
    },
  ]

  const categories = [
    { name: "Parenting Tips", icon: Users, count: 12 },
    { name: "Child Development", icon: BookOpen, count: 8 },
    { name: "Safety", icon: Shield, count: 15 },
    { name: "Education", icon: Lightbulb, count: 10 },
    { name: "Technology", icon: ArrowRight, count: 6 },
    { name: "Content Creation", icon: User, count: 4 },
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
            SafeStream Blog
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Insights for Modern Parents</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Expert advice, research-backed tips, and practical strategies for raising children in the digital age.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Post */}
            {blogPosts
              .filter((post) => post.featured)
              .map((post, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-auto">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-blue-600 text-white">Featured</Badge>
                    </div>
                    <div className="p-8 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {post.category}
                          </Badge>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{post.title}</h2>
                        <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="w-4 h-4 mr-2" />
                          {post.author}
                        </div>
                      </div>
                      <Button className="mt-6 self-start">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

            {/* Regular Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts
                .filter((post) => !post.featured)
                .map((post, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
                  >
                    <div className="relative h-48">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {post.category}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900 leading-tight">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-gray-600 leading-relaxed">{post.excerpt}</CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="w-4 h-4 mr-2" />
                          {post.author}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-8">
              <Button size="lg" variant="outline" className="bg-transparent">
                Load More Articles
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/blog/category/${category.name.toLowerCase().replace(" ", "-")}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <category.icon className="w-4 h-4 mr-3 text-gray-500 group-hover:text-blue-600" />
                      <span className="text-gray-700 group-hover:text-blue-600">{category.name}</span>
                    </div>
                    <Badge variant="outline" className="bg-gray-50 text-gray-600">
                      {category.count}
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Stay Updated</CardTitle>
                <CardDescription>
                  Get the latest parenting tips and digital safety insights delivered to your inbox.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button className="w-full">Subscribe</Button>
                </div>
                <p className="text-xs text-gray-500">No spam, unsubscribe at any time.</p>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Popular Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {blogPosts.slice(0, 3).map((post, index) => (
                  <Link
                    key={index}
                    href={`/blog/${post.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block group"
                  >
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
