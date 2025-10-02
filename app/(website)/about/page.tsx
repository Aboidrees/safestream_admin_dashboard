import { Button } from "@/components/ui/button"
import Link from "next/link"
import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Heart, Target, Award, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Our Story
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Making YouTube Safe for Every Child</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            SafeStream was born from a simple belief: every child deserves access to safe, educational, and entertaining
            content online. We're on a mission to give parents the tools they need to create positive digital
            experiences for their families.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Empowering Parents, Protecting Children</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that technology should bring families together, not drive them apart. SafeStream gives
                parents the confidence to let their children explore and learn online while maintaining complete control
                over their digital experience.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform combines the vast educational potential of YouTube with robust safety features, creating a
                space where children can discover, learn, and grow in a protected environment.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Shield, label: "100% Safe Content", color: "text-green-600", bgColor: "bg-green-50" },
                    { icon: Users, label: "10,000+ Families", color: "text-blue-600", bgColor: "bg-blue-50" },
                    { icon: Globe, label: "50+ Countries", color: "text-purple-600", bgColor: "bg-purple-50" },
                    { icon: Award, label: "Award Winning", color: "text-orange-600", bgColor: "bg-orange-50" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center space-y-3">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <p className="font-semibold text-gray-900">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              <Heart className="w-4 h-4 mr-2" />
              Our Values
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What drives us every day</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Safety First",
                description:
                  "Child safety is our top priority. Every feature we build is designed with protection in mind.",
                icon: Shield,
                color: "text-green-600",
                bgColor: "bg-green-50",
              },
              {
                title: "Family Focused",
                description:
                  "We understand that every family is unique, and our platform adapts to your specific needs.",
                icon: Users,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                title: "Educational Value",
                description:
                  "We believe screen time should be meaningful, educational, and contribute to a child's growth.",
                icon: Award,
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                title: "Transparency",
                description:
                  "Parents deserve to know exactly what their children are watching and when they're watching it.",
                icon: Globe,
                color: "text-orange-600",
                bgColor: "bg-orange-50",
              },
              {
                title: "Innovation",
                description: "We continuously improve our platform with the latest technology and safety features.",
                icon: Target,
                color: "text-pink-600",
                bgColor: "bg-pink-50",
              },
              {
                title: "Community",
                description: "We're building a community of parents who support each other in raising digital natives.",
                icon: Heart,
                color: "text-red-600",
                bgColor: "bg-red-50",
              },
            ].map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className={`w-12 h-12 ${value.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <value.icon className={`h-6 w-6 ${value.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              <Users className="w-4 h-4 mr-2" />
              Our Team
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Meet the people behind SafeStream</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a diverse team of parents, educators, and technologists united by our mission to make the internet
              safer for children.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Co-Founder",
                bio: "Former Google engineer and mother of two, passionate about child safety online.",
                image: "/professional-woman-ceo.png",
              },
              {
                name: "Michael Chen",
                role: "CTO & Co-Founder",
                bio: "Expert in AI and machine learning with 15+ years in tech and father of three.",
                image: "/professional-man-cto.png",
              },
              {
                name: "Dr. Emily Rodriguez",
                role: "Head of Child Psychology",
                bio: "Child psychologist specializing in digital wellness and healthy screen time habits.",
                image: "/professional-woman-psychologist.png",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
              >
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">Want to learn more about our mission?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              We'd love to hear from you. Whether you're a parent, educator, or just someone who cares about child
              safety online, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-us">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8">
                  Contact Us
                </Button>
              </Link>
              <Link href="/community">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 bg-transparent"
                >
                  Join Our Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
