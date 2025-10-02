import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, MessageCircle, Clock, Users, HelpCircle, Send, CheckCircle } from "lucide-react"

export default function ContactUsPage() {
  const contactMethods = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      availability: "24/7 Support",
      action: "Start Chat",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-50",
      availability: "Response within 24 hours",
      action: "Send Email",
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: Phone,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      availability: "Mon-Fri, 9AM-6PM PST",
      action: "Call Now",
    },
  ]

  const supportTopics = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Subscriptions" },
    { value: "safety", label: "Safety & Content" },
    { value: "feature", label: "Feature Request" },
    { value: "partnership", label: "Partnership" },
    { value: "other", label: "Other" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-6">
            <Mail className="w-4 h-4 mr-2" />
            Contact Us
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">We're Here to Help</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Have questions about SafeStream? Need technical support? Want to share feedback? Our team is ready to assist
            you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Methods */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose How to Reach Us</h2>
            <p className="text-xl text-gray-600">We offer multiple ways to get in touch based on your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <method.icon className={`h-8 w-8 ${method.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{method.title}</CardTitle>
                  <CardDescription className="text-gray-600">{method.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    {method.availability}
                  </div>
                  <Button className="w-full">{method.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="Enter your first name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Enter your last name" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="Enter your email address" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number (optional)" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic *</Label>
                    <select
                      id="topic"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a topic</option>
                      {supportTopics.map((topic) => (
                        <option key={topic.value} value={topic.value}>
                          {topic.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" placeholder="Brief description of your inquiry" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide as much detail as possible about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="privacy"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <Label htmlFor="privacy" className="text-sm text-gray-600">
                      I agree to SafeStream's{" "}
                      <a href="/privacy-policy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a href="/terms-of-service" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a>
                      .
                    </Label>
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & FAQ */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">support@safestream.com</p>
                    <p className="text-sm text-gray-500">For general inquiries and support</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">1-800-SAFE-STREAM</p>
                    <p className="text-sm text-gray-500">Monday - Friday, 9AM - 6PM PST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-600">
                      SafeStream Inc.
                      <br />
                      123 Safety Street
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <HelpCircle className="w-5 w-5 mr-2 text-blue-600" />
                  Quick Help
                </CardTitle>
                <CardDescription>Looking for immediate answers? Try these resources first.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <a
                    href="/faq"
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow group"
                  >
                    <div className="flex items-center">
                      <HelpCircle className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="font-medium text-gray-900 group-hover:text-blue-600">FAQ</span>
                    </div>
                    <span className="text-sm text-gray-500">Most common questions</span>
                  </a>
                  <a
                    href="/help-center"
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow group"
                  >
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-3 text-green-600" />
                      <span className="font-medium text-gray-900 group-hover:text-blue-600">Help Center</span>
                    </div>
                    <span className="text-sm text-gray-500">Detailed guides</span>
                  </a>
                  <a
                    href="/community"
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-shadow group"
                  >
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-3 text-purple-600" />
                      <span className="font-medium text-gray-900 group-hover:text-blue-600">Community</span>
                    </div>
                    <span className="text-sm text-gray-500">Connect with parents</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 w-5 mr-2 text-green-600" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Live Chat</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Instant
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email Support</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Within 24 hours
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Phone Support</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    <Phone className="w-3 h-3 mr-1" />
                    Business hours
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
