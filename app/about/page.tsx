import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Heart, Users, Target, Award, Lightbulb, Globe, CheckCircle, Star, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-20 float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center slide-in-left">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Shield className="h-8 w-8 text-red-500" />
              <span className="text-red-500 font-medium text-lg">About SafeStream</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Creating Safe Digital{" "}
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Experiences
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              We believe every child deserves a safe, curated digital environment where they can learn, explore, and be
              entertained without exposure to inappropriate content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-700 transform hover:scale-105">
                  Join Our Mission
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-red-500 hover:text-red-500 px-8 py-4 text-lg font-semibold transition-all duration-700 transform hover:scale-105 bg-transparent"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="slide-in-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  SafeStream was born from a simple yet powerful realization: parents needed better tools to protect
                  their children in the digital age while still allowing them to enjoy quality content.
                </p>
                <p>
                  As parents ourselves, we experienced firsthand the challenges of finding age-appropriate content and
                  managing screen time. Existing platforms either lacked proper filtering or were too restrictive,
                  limiting educational and entertaining content that could benefit our children.
                </p>
                <p>
                  We envisioned a platform where parents could curate personalized content libraries, set meaningful
                  boundaries, and have complete visibility into their children's viewing habits—all while maintaining
                  the joy and wonder of digital discovery.
                </p>
                <p className="font-semibold text-gray-900">
                  Today, SafeStream serves thousands of families worldwide, helping parents create safer digital
                  environments for their children.
                </p>
              </div>
            </div>
            <div className="slide-in-right">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-red-100 to-purple-100 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-1000"></div>
                <div className="absolute inset-4 bg-white/20 rounded-2xl backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="h-24 w-24 text-red-500 float" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything we do is guided by our commitment to child safety, family values, and digital wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Child Safety First",
                description:
                  "Every feature we build prioritizes the safety and well-being of children in digital spaces.",
                color: "from-red-500 to-red-600",
                delay: "stagger-1",
              },
              {
                icon: Users,
                title: "Family-Centered",
                description:
                  "We design for real families with diverse needs, ages, and viewing preferences across all households.",
                color: "from-blue-500 to-blue-600",
                delay: "stagger-2",
              },
              {
                icon: Target,
                title: "Purpose-Driven",
                description:
                  "Our technology serves a higher purpose: creating meaningful, safe digital experiences for children.",
                color: "from-purple-500 to-purple-600",
                delay: "stagger-3",
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description:
                  "We continuously innovate to stay ahead of digital challenges and provide cutting-edge parental tools.",
                color: "from-yellow-500 to-orange-500",
                delay: "stagger-4",
              },
              {
                icon: Globe,
                title: "Accessibility",
                description:
                  "Safe digital experiences should be available to all families, regardless of technical expertise.",
                color: "from-green-500 to-green-600",
                delay: "stagger-5",
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We maintain the highest standards in security, privacy, and user experience for families worldwide.",
                color: "from-indigo-500 to-indigo-600",
                delay: "stagger-6",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 scale-in ${value.delay} group cursor-pointer`}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500`}
                  >
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-500">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A passionate group of parents, technologists, and child safety advocates working together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Co-Founder",
                description: "Former child psychologist turned tech entrepreneur, passionate about digital wellness.",
                image: "/placeholder.svg?height=300&width=300&text=Sarah",
              },
              {
                name: "Michael Chen",
                role: "CTO & Co-Founder",
                description: "Security expert with 15+ years in child-safe technology and platform architecture.",
                image: "/placeholder.svg?height=300&width=300&text=Michael",
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Product",
                description: "UX designer and mother of three, focused on creating intuitive family experiences.",
                image: "/placeholder.svg?height=300&width=300&text=Emily",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 scale-in stagger-${
                  index + 1
                } group`}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-4 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-500">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">{member.name}</CardTitle>
                  <p className="text-red-500 font-semibold mb-4">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-white mb-4">SafeStream by the Numbers</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Our impact on families and children's digital safety continues to grow every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "50,000+", label: "Families Protected", icon: Users },
              { number: "2M+", label: "Hours of Safe Content", icon: Shield },
              { number: "99.9%", label: "Uptime Reliability", icon: CheckCircle },
              { number: "4.9/5", label: "Parent Satisfaction", icon: Star },
            ].map((stat, index) => (
              <div key={index} className={`text-center slide-up stagger-${index + 1} group`}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-500">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-500">
                  {stat.number}
                </div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Ready to Join Our Mission?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Help us create a safer digital world for children. Start your SafeStream journey today and become part of
              our growing community of conscious parents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-700 transform hover:scale-105 group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-red-500 hover:text-red-500 px-10 py-4 text-lg font-semibold transition-all duration-700 transform hover:scale-105 bg-transparent"
                >
                  Contact Our Team
                </Button>
              </Link>
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
