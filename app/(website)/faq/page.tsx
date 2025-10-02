import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Shield, Users, Video, CreditCard, Settings, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      questions: [
        {
          question: "How do I create my first child profile?",
          answer:
            "After signing up, go to your dashboard and click 'Add Child Profile'. Enter your child's name, age, and content preferences. You can set viewing restrictions and screen time limits during setup.",
        },
        {
          question: "What age groups does SafeStream support?",
          answer:
            "SafeStream is designed for children ages 2-17. Our content filtering and recommendations are tailored to different developmental stages, from toddlers to teenagers.",
        },
        {
          question: "How do I create my first video collection?",
          answer:
            "Navigate to 'Collections' in your dashboard, click 'Create New Collection', give it a name and description, then start adding videos by searching YouTube content through our safe search feature.",
        },
        {
          question: "Can I try SafeStream before subscribing?",
          answer:
            "Yes! We offer a free plan that includes 1 child profile and up to 10 videos per collection. You can also start a 14-day free trial of our paid plans.",
        },
      ],
    },
    {
      title: "Safety & Content",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      questions: [
        {
          question: "How does SafeStream ensure content is appropriate?",
          answer:
            "We use a combination of AI filtering, human moderation, and community reporting. All content goes through multiple safety checks before being available on our platform.",
        },
        {
          question: "Can my child access content outside their age range?",
          answer:
            "No. Each child profile has strict age-based restrictions that cannot be bypassed without parental approval. Parents can adjust these settings at any time.",
        },
        {
          question: "What happens if inappropriate content gets through?",
          answer:
            "You can immediately report any content using the report button. We review all reports within 24 hours and remove inappropriate content. We also continuously improve our filtering systems.",
        },
        {
          question: "Are there ads on SafeStream?",
          answer:
            "No, SafeStream is completely ad-free. We believe children should have an uninterrupted, safe viewing experience without commercial interruptions.",
        },
      ],
    },
    {
      title: "Parental Controls",
      icon: Settings,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      questions: [
        {
          question: "How do I set screen time limits?",
          answer:
            "In each child's profile settings, you can set daily time limits, break reminders, and bedtime restrictions. The app will automatically pause when limits are reached.",
        },
        {
          question: "Can I see what my child has been watching?",
          answer:
            "Yes, you have access to detailed viewing history, including what videos were watched, for how long, and when. This information is available in your parental dashboard.",
        },
        {
          question: "How do I block specific content or channels?",
          answer:
            "You can block individual videos, entire channels, or specific keywords from your child's profile settings. Blocked content will never appear in their recommendations.",
        },
        {
          question: "Can I schedule viewing times?",
          answer:
            "Yes, you can set specific hours when SafeStream is available for each child. Outside these hours, the app will be locked and require parental approval to access.",
        },
      ],
    },
    {
      title: "Technical Support",
      icon: Video,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      questions: [
        {
          question: "Which devices support SafeStream?",
          answer:
            "SafeStream works on iOS and Android phones/tablets, web browsers (Chrome, Safari, Firefox, Edge), and can be cast to smart TVs. We also have dedicated smart TV apps for major platforms.",
        },
        {
          question: "Can I use SafeStream offline?",
          answer:
            "Yes, with our Family and Premium plans, you can download videos for offline viewing. Downloaded content follows the same safety restrictions as online content.",
        },
        {
          question: "Why is a video not loading?",
          answer:
            "This could be due to internet connectivity, the video being removed from YouTube, or temporary server issues. Try refreshing the page or check our status page for any known issues.",
        },
        {
          question: "How do I sync my account across devices?",
          answer:
            "Your account automatically syncs across all devices when you log in. Viewing history, collections, and settings are updated in real-time across all your family's devices.",
        },
      ],
    },
    {
      title: "Billing & Subscriptions",
      icon: CreditCard,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      questions: [
        {
          question: "What's included in the free plan?",
          answer:
            "The free plan includes 1 child profile, up to 10 videos per collection, basic parental controls, and email support. It's perfect for trying out SafeStream.",
        },
        {
          question: "How do I upgrade or downgrade my plan?",
          answer:
            "You can change your plan anytime in your account settings. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period.",
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer:
            "Yes, you can cancel anytime without penalty. Your subscription will remain active until the end of your current billing period, then revert to the free plan.",
        },
        {
          question: "Do you offer family discounts?",
          answer:
            "Our Family plan is designed for families with up to 5 child profiles. For larger families or educational institutions, contact us for custom pricing options.",
        },
      ],
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
            <HelpCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">How can we help you?</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Find answers to common questions about SafeStream, from getting started to advanced parental controls.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {faqCategories.map((category, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div
                  className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}
                >
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <CardTitle className="text-sm font-semibold text-gray-900">{category.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <section key={categoryIndex}>
              <div className="flex items-center mb-8">
                <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium text-gray-900">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        {/* Still Need Help Section */}
        <Card className="mt-16 border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Still need help?</CardTitle>
            <CardDescription className="text-lg">
              Can't find the answer you're looking for? Our support team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Live Chat</h4>
                <p className="text-sm text-gray-600">Get instant help from our support team</p>
                <Button variant="outline" className="bg-transparent">
                  Start Chat
                </Button>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Help Center</h4>
                <p className="text-sm text-gray-600">Browse our comprehensive help articles</p>
                <Link href="/help-center">
                  <Button variant="outline" className="bg-transparent">
                    Visit Help Center
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Community</h4>
                <p className="text-sm text-gray-600">Connect with other SafeStream parents</p>
                <Link href="/community">
                  <Button variant="outline" className="bg-transparent">
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
