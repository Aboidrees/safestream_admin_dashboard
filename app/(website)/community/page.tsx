import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  MessageCircle,
  Heart,
  Star,
  TrendingUp,
  User,
  ArrowRight,
  Shield,
  BookOpen,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const communityStats = [
    {
      title: "Active Parents",
      value: "12,500+",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Discussions",
      value: "3,200+",
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Helpful Answers",
      value: "8,900+",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Expert Contributors",
      value: "150+",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ]

  const popularTopics = [
    {
      title: "Screen Time Management",
      description: "Tips and strategies for healthy screen time habits",
      posts: 245,
      members: 1200,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Educational Content",
      description: "Share and discover great educational videos",
      posts: 189,
      members: 980,
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      title: "Safety Concerns",
      description: "Discuss online safety and content filtering",
      posts: 156,
      members: 850,
      color: "bg-red-50 text-red-700 border-red-200",
    },
    {
      title: "Age-Appropriate Content",
      description: "Find content suitable for different age groups",
      posts: 134,
      members: 720,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ]

  const recentDiscussions = [
    {
      title: "How do you handle screen time limits with teenagers?",
      author: "Sarah M.",
      replies: 23,
      likes: 45,
      timeAgo: "2 hours ago",
      category: "Screen Time Management",
    },
    {
      title: "Best educational YouTube channels for 5-year-olds?",
      author: "Mike D.",
      replies: 18,
      likes: 32,
      timeAgo: "4 hours ago",
      category: "Educational Content",
    },
    {
      title: "Dealing with inappropriate ads on YouTube",
      author: "Jennifer L.",
      replies: 31,
      likes: 67,
      timeAgo: "6 hours ago",
      category: "Safety Concerns",
    },
    {
      title: "Creating themed collections for different subjects",
      author: "David R.",
      replies: 12,
      likes: 28,
      timeAgo: "8 hours ago",
      category: "Content Creation",
    },
    {
      title: "Transitioning from cartoons to educational content",
      author: "Lisa K.",
      replies: 19,
      likes: 41,
      timeAgo: "12 hours ago",
      category: "Age-Appropriate Content",
    },
  ]

  const expertContributors = [
    {
      name: "Dr. Emily Rodriguez",
      title: "Child Psychologist",
      expertise: "Digital wellness and screen time",
      contributions: 89,
      avatar: "/child-psychologist-woman.jpg",
    },
    {
      name: "Mark Thompson",
      title: "Education Specialist",
      expertise: "Learning through digital media",
      contributions: 67,
      avatar: "/education-specialist-man.jpg",
    },
    {
      name: "Anna Chen",
      title: "Parent & Tech Expert",
      expertise: "Parental controls and safety",
      contributions: 54,
      avatar: "/tech-expert-woman.jpg",
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
            <Users className="w-4 h-4 mr-2" />
            SafeStream Community
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Connect with Fellow Parents</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of parents sharing experiences, tips, and support for raising children in the digital age.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Community Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{stat.value}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">{stat.title}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Popular Topics */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Popular Topics</h2>
                <Button variant="outline" className="bg-transparent">
                  View All Topics
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {popularTopics.map((topic, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md cursor-pointer group"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={topic.color}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {topic.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {topic.posts} posts
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {topic.members} members
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Discussions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Discussions</h2>
                <Button variant="outline" className="bg-transparent">
                  View All Discussions
                </Button>
              </div>
              <div className="space-y-4">
                {recentDiscussions.map((discussion, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              {discussion.category}
                            </Badge>
                            <span className="text-sm text-gray-500">{discussion.timeAgo}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            {discussion.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {discussion.author}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {discussion.replies} replies
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {discussion.likes} likes
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Join Community CTA */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Join Our Community</CardTitle>
                <CardDescription>
                  Connect with thousands of parents and get support on your parenting journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button className="w-full">Create Account</Button>
                <p className="text-xs text-gray-500">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>

            {/* Expert Contributors */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  Expert Contributors
                </CardTitle>
                <CardDescription>Learn from professionals and experienced parents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {expertContributors.map((expert, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={expert.avatar || "/placeholder.svg"}
                        alt={expert.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{expert.name}</h4>
                      <p className="text-xs text-blue-600 mb-1">{expert.title}</p>
                      <p className="text-xs text-gray-500 mb-2">{expert.expertise}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {expert.contributions} contributions
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Be respectful and supportive of other parents</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Share experiences and advice constructively</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Keep discussions family-friendly and appropriate</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Report inappropriate content or behavior</p>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent text-sm">
                  Read Full Guidelines
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/help-center"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Help Center
                </Link>
                <Link href="/faq" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ
                </Link>
                <Link
                  href="/contact-us"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
