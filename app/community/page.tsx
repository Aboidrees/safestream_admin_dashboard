import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Shield, Users, MessageCircle, Heart, Clock, Star, Zap, BookOpen, ArrowRight } from "lucide-react"

export default function CommunityPage() {
  const communityStats = [
    { number: "25,000+", label: "Active Parents", icon: Users },
    { number: "150+", label: "Daily Discussions", icon: MessageCircle },
    { number: "500+", label: "Expert Tips Shared", icon: BookOpen },
    { number: "98%", label: "Helpful Responses", icon: Heart },
  ]

  const featuredDiscussions = [
    {
      id: 1,
      title: "Best practices for screen time limits during holidays?",
      author: "Sarah M.",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=SM",
      category: "Time Management",
      replies: 23,
      likes: 45,
      timeAgo: "2 hours ago",
      excerpt:
        "With the holidays coming up, I'm wondering how other parents handle screen time when kids are home from school. Do you relax the rules or keep them strict?",
      featured: true,
    },
    {
      id: 2,
      title: "How to explain content filtering to older kids?",
      author: "Mike Johnson",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=MJ",
      category: "Communication",
      replies: 18,
      likes: 32,
      timeAgo: "4 hours ago",
      excerpt:
        "My 12-year-old is asking why certain videos are blocked. Looking for advice on how to have this conversation while maintaining trust.",
      featured: false,
    },
    {
      id: 3,
      title: "SafeStream helped us through a difficult time",
      author: "Jennifer K.",
      authorAvatar: "/placeholder.svg?height=40&width=40&text=JK",
      category: "Success Stories",
      replies: 31,
      likes: 78,
      timeAgo: "6 hours ago",
      excerpt:
        "Just wanted to share how SafeStream's parental controls gave us peace of mind during my husband's deployment. The kids stayed entertained safely.",
      featured: false,
    },
  ]

  const topContributors = [
    {
      name: "Dr. Lisa Chen",
      role: "Child Psychologist",
      avatar: "/placeholder.svg?height=60&width=60&text=LC",
      contributions: 156,
      badge: "Expert",
    },
    {
      name: "Mark Rodriguez",
      role: "Father of 3",
      avatar: "/placeholder.svg?height=60&width=60&text=MR",
      contributions: 89,
      badge: "Helper",
    },
    {
      name: "Amanda Foster",
      role: "Digital Safety Advocate",
      avatar: "/placeholder.svg?height=60&width=60&text=AF",
      contributions: 67,
      badge: "Mentor",
    },
  ]

  const communityCategories = [
    {
      icon: Users,
      title: "Parenting Tips",
      description: "Share and discover effective parenting strategies",
      posts: 1240,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Shield,
      title: "Digital Safety",
      description: "Discuss online safety and protection measures",
      posts: 856,
      color: "from-red-500 to-red-600",
    },
    {
      icon: Clock,
      title: "Screen Time Management",
      description: "Tips for healthy screen time balance",
      posts: 623,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: BookOpen,
      title: "Educational Content",
      description: "Recommendations for learning-focused content",
      posts: 445,
      color: "from-green-500 to-green-600",
    },
    {
      icon: Heart,
      title: "Success Stories",
      description: "Celebrate wins and positive outcomes",
      posts: 289,
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: MessageCircle,
      title: "General Discussion",
      description: "Open conversations about family life",
      posts: 1567,
      color: "from-orange-500 to-orange-600",
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
              <Users className="h-8 w-8 text-red-500" />
              <span className="text-red-500 font-medium text-lg">SafeStream Community</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connect with{" "}
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Parents
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of parents sharing experiences, tips, and support for creating safer digital environments
              for children.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-700 transform hover:scale-105">
                Join the Community
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-300 hover:border-red-500 hover:text-red-500 px-8 py-4 text-lg font-semibold transition-all duration-700 transform hover:scale-105 bg-transparent"
              >
                Browse Discussions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 scale-in stagger-${index + 1} text-center`}
              >
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Discussions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Discussions</h2>
            <p className="text-xl text-gray-600">Join the conversation on today's most popular topics</p>
          </div>

          <div className="space-y-6">
            {featuredDiscussions.map((discussion, index) => (
              <Card
                key={discussion.id}
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] scale-in stagger-${index + 1} ${
                  discussion.featured ? "ring-2 ring-red-500 ring-opacity-50" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={discussion.authorAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {discussion.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="border-red-200 text-red-600">
                          {discussion.category}
                        </Badge>
                        {discussion.featured && (
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">Featured</Badge>
                        )}
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {discussion.timeAgo}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-red-600 transition-colors duration-300 cursor-pointer">
                        {discussion.title}
                      </h3>

                      <p className="text-gray-600 mb-4 leading-relaxed">{discussion.excerpt}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="font-medium text-gray-900">{discussion.author}</span>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{discussion.likes} likes</span>
                          </div>
                        </div>

                        <Button variant="ghost" size="sm" className="hover:text-red-500 group">
                          Join Discussion
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-xl text-gray-600">Find discussions that matter to you and your family</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityCategories.map((category, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 scale-in stagger-${index + 1} group cursor-pointer`}
              >
                <CardHeader className="text-center">
                  <div
                    className={`mx-auto w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500`}
                  >
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-500">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                    <MessageCircle className="h-4 w-4" />
                    <span>{category.posts} posts</span>
                  </div>
                  <Button
                    variant="outline"
                    className="hover:border-red-500 hover:text-red-500 transition-all duration-300 bg-transparent"
                  >
                    Browse Posts
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Champions</h2>
            <p className="text-xl text-gray-600">Meet our most helpful community members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topContributors.map((contributor, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 scale-in stagger-${index + 1} text-center`}
              >
                <CardHeader>
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarImage src={contributor.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">
                        {contributor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <Badge
                        className={`${
                          contributor.badge === "Expert"
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                            : contributor.badge === "Helper"
                              ? "bg-gradient-to-r from-blue-500 to-purple-500"
                              : "bg-gradient-to-r from-green-500 to-teal-500"
                        } text-white text-xs px-2 py-1`}
                      >
                        {contributor.badge}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{contributor.name}</CardTitle>
                  <p className="text-gray-600">{contributor.role}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{contributor.contributions} helpful contributions</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Community CTA */}
      <section className="py-20 gradient-shift relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="fade-in">
            <Zap className="h-16 w-16 text-white mx-auto mb-6 float" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with thousands of parents, share your experiences, and get support on your parenting journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105">
                Create Account
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 text-lg font-semibold transition-all duration-700 transform hover:scale-105 bg-transparent"
              >
                Learn More
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
                {["About Us", "Blog", "Privacy Policy", "Terms of Service"].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                {["FAQ", "Help Center", "Contact Us", "Community"].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
