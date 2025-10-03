import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, UserCheck, Calendar, Shield } from "lucide-react"
import Link from "next/link"
import { WebsiteNavbar } from "@/components/website-navbar"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <WebsiteNavbar currentPage="privacy-policy" />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center slide-in-left">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Lock className="h-8 w-8 text-red-500" />
              <span className="text-red-500 font-medium text-lg">Privacy Policy</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Your Privacy is Our{" "}
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Priority
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We are committed to protecting your family's privacy and ensuring the security of your personal
              information.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Last updated: December 15, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Shield,
                title: "Data Protection",
                description: "We use industry-standard encryption and security measures to protect your information.",
              },
              {
                icon: Eye,
                title: "Transparency",
                description: "We clearly explain what data we collect, how we use it, and who we share it with.",
              },
              {
                icon: UserCheck,
                title: "Your Control",
                description: "You have full control over your data with options to view, update, or delete it anytime.",
              },
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Information We Collect</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  When you create an account with SafeStream, we collect:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Your name and email address</li>
                  <li>Account credentials (encrypted passwords)</li>
                  <li>Child profile information (names, ages, content preferences)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Usage Information</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  To improve our service and ensure child safety, we collect:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Viewing history and watch time data</li>
                  <li>Content preferences and ratings</li>
                  <li>Device information and IP addresses</li>
                  <li>App usage patterns and feature interactions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Children's Information</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We take special care with children's data and comply with COPPA regulations:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>We only collect information necessary for the service</li>
                  <li>Parents have full control over their children's profiles</li>
                  <li>Children cannot share personal information through our platform</li>
                  <li>We do not sell or share children's data with third parties</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">How We Use Your Information</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Provision</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Create and manage your family accounts</li>
                  <li>Curate age-appropriate content recommendations</li>
                  <li>Enforce parental controls and time limits</li>
                  <li>Process payments and manage subscriptions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety and Security</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Monitor for inappropriate content or behavior</li>
                  <li>Prevent unauthorized access to accounts</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations and safety requirements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Communication</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Send important account and service updates</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Share parenting tips and safety information (with consent)</li>
                  <li>Notify you of new features or policy changes</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Information Sharing</h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              We do not sell your personal information. We may share your information only in these limited
              circumstances:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Providers</h3>
                <p className="text-gray-600 leading-relaxed">
                  We work with trusted third-party service providers who help us operate our platform, such as cloud
                  hosting, payment processing, and customer support. These providers are contractually bound to protect
                  your information.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Requirements</h3>
                <p className="text-gray-600 leading-relaxed">
                  We may disclose information when required by law, such as responding to court orders, legal processes,
                  or to protect the rights, property, or safety of SafeStream, our users, or others.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Transfers</h3>
                <p className="text-gray-600 leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part
                  of that transaction, but only with the same privacy protections.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Your Rights and Choices</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Access and Control</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>View and update your account information at any time</li>
                  <li>Download a copy of your personal data</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Parental Rights</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Review and delete your child's personal information</li>
                  <li>Control what information is collected from your child</li>
                  <li>Refuse to allow further collection of your child's information</li>
                  <li>Request that we stop using your child's information</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Data Security</h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              We implement comprehensive security measures to protect your information:
            </p>

            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-8">
              <li>End-to-end encryption for sensitive data transmission</li>
              <li>Secure data storage with regular backups</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Employee training on data protection and privacy</li>
              <li>Multi-factor authentication for account access</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Contact Us</h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              If you have questions about this Privacy Policy or how we handle your information, please contact us:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-2 text-gray-600">
                <li>
                  <strong>Email:</strong> privacy@safestream.app
                </li>
                <li>
                  <strong>Address:</strong> SafeStream Privacy Team, 123 Family Safety Blvd, Digital City, DC 12345
                </li>
                <li>
                  <strong>Phone:</strong> 1-800-SAFE-STREAM
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
