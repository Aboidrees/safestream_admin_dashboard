import { NavigationHeader } from "@/components/navigation-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Shield, Search, HelpCircle, Users, Lock, CreditCard, Smartphone, Settings, MessageCircle } from "lucide-react"

export default function FAQPage() {
  const faqCategories = [
    {
      icon: Users,
      title: "Getting Started",
      color: "from-blue-500 to-blue-600",
      faqs: [
        {
          question: "How do I create my first SafeStream account?",
          answer:
            "Creating your SafeStream account is simple! Click 'Get Started Free' on our homepage, enter your email and create a password. You'll then be guided through setting up your first child profile and selecting age-appropriate content preferences.",
        },
        {
          question: "What's the difference between the free and paid plans?",
          answer:
            "Our free plan includes 1 child profile, 5 content collections, and basic filtering. Paid plans offer multiple profiles, unlimited collections, advanced parental controls, detailed analytics, and priority support.",
        },
        {
          question: "How quickly can I set up SafeStream for my family?",
          answer:
            "Most families complete setup in under 5 minutes! After creating your account, you'll add child profiles, set viewing preferences, and start curating content immediately.",
        },
      ],
    },
    {
      icon: Lock,
      title: "Safety & Privacy",
      color: "from-red-500 to-red-600",
      faqs: [
        {
          question: "How does SafeStream ensure my children only see appropriate content?",
          answer:
            "We use multiple layers of protection: age-based content filtering, parent-curated collections, AI-powered content analysis, and community reporting. Parents have complete control over what their children can access.",
        },
        {
          question: "What information do you collect about my children?",
          answer:
            "We collect minimal information necessary for the service: profile names, ages, viewing preferences, and watch history. We comply with COPPA regulations and never sell children's data. Parents can view, modify, or delete this information anytime.",
        },
        {
          question: "Can my children communicate with strangers through SafeStream?",
          answer:
            "No. SafeStream has no chat features, comments, or social interactions. Children can only watch curated content - there's no way for them to communicate with other users or share personal information.",
        },
      ],
    },
    {
      icon: Settings,
      title: "Parental Controls",
      color: "from-purple-500 to-purple-600",
      faqs: [
        {
          question: "How do I set screen time limits for my children?",
          answer:
            "In your dashboard, go to Time Controls for each child profile. You can set daily time limits, schedule viewing hours, and even set different limits for weekdays vs. weekends. When time is up, the app automatically pauses.",
        },
        {
          question: "Can I see what my children are watching?",
          answer:
            "Yes! The Watch History section shows detailed viewing activity for each child, including what they watched, when, and for how long. You can also see which content they enjoyed most.",
        },
        {
          question: "How do I block specific content or channels?",
          answer:
            "You can block content at multiple levels: individual videos, entire channels, or content categories. Simply go to Content Controls in your dashboard and add items to your block list.",
        },
      ],
    },
    {
      icon: Smartphone,
      title: "Devices & Access",
      color: "from-green-500 to-green-600",
      faqs: [
        {
          question: "What devices work with SafeStream?",
          answer:
            "SafeStream works on smartphones, tablets, computers, smart TVs, and streaming devices. We support iOS, Android, Windows, macOS, and popular streaming platforms like Roku and Apple TV.",
        },
        {
          question: "How does the QR code login work for children?",
          answer:
            "Each child gets a unique QR code that you can print or save. They simply scan it with the device camera to log into their profile - no passwords needed! You can regenerate codes anytime for security.",
        },
        {
          question: "Can my children use SafeStream when we're traveling?",
          answer:
            "Yes! SafeStream works anywhere with internet access. Your parental controls and content libraries sync across all devices, so your children have the same safe experience whether at home or away.",
        },
      ],
    },
    {
      icon: CreditCard,
      title: "Billing & Subscriptions",
      color: "from-orange-500 to-orange-600",
      faqs: [
        {
          question: "Can I try SafeStream before paying?",
          answer:
            "Our free plan lets you create 1 child profile and 5 content collections with no time limit. You can upgrade to a paid plan anytime to unlock more features and profiles.",
        },
        {
          question: "How do I cancel my subscription?",
          answer:
            "You can cancel anytime from your account settings. Your subscription remains active until the end of your billing period, and you can reactivate anytime without losing your data.",
        },
        {
          question: "Do you offer refunds?",
          answer:
            "Yes! We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund within 30 days of purchase.",
        },
      ],
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
              <HelpCircle className="h-8 w-8 text-red-500" />
              <span className="text-red-500 font-medium text-lg">Frequently Asked Questions</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Get{" "}
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Answers
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Find quick answers to common questions about SafeStream, parental controls, and keeping your family safe
              online.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-red-500 rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="fade-in">
                <div className="flex items-center space-x-4 mb-8">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}
                  >
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {category.faqs.map((faq, faqIndex) => (
                    <Card
                      key={faqIndex}
                      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] scale-in stagger-${faqIndex + 1}`}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                          {faq.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <MessageCircle className="h-16 w-16 text-red-500 mx-auto mb-6 float" />
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Can't find the answer you're looking for? Our friendly support team is here to help you and your family
              get the most out of SafeStream.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-us">
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-700 transform hover:scale-105">
                  Contact Support
                </Button>
              </Link>
              <Link href="/help-center">
                <Button
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-red-500 hover:text-red-500 px-8 py-4 text-lg font-semibold transition-all duration-700 transform hover:scale-105 bg-transparent"
                >
                  Visit Help Center
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
