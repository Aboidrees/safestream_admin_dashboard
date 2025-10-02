import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, Users, Database, Globe } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Privacy Policy
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Your Privacy Matters</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're committed to protecting your family's privacy and being transparent about how we collect, use, and
            protect your information.
          </p>
          <p className="text-sm text-blue-200 mt-4">Last updated: January 1, 2024</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Overview */}
        <Card className="mb-12 border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <Eye className="w-6 h-6 mr-3 text-blue-600" />
              Privacy at a Glance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">We don't sell your data</h4>
                    <p className="text-sm text-gray-600">Your personal information is never sold to third parties.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure by design</h4>
                    <p className="text-sm text-gray-600">All data is encrypted and stored securely.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">You control your data</h4>
                    <p className="text-sm text-gray-600">Delete or export your data at any time.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">COPPA compliant</h4>
                    <p className="text-sm text-gray-600">We follow strict children's privacy regulations.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Sections */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
            <div className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600">When you create an account, we collect:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Email address (required for account creation and communication)</li>
                    <li>Name (optional, used for personalization)</li>
                    <li>Password (encrypted and never stored in plain text)</li>
                    <li>Profile picture (optional)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Child Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600">For child profiles, we collect minimal information:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>First name or nickname (for personalization)</li>
                    <li>Age range (to provide age-appropriate content)</li>
                    <li>Content preferences (to curate suitable videos)</li>
                    <li>Viewing history (to track screen time and provide insights)</li>
                  </ul>
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-blue-800">
                      <strong>Important:</strong> We never collect personal information directly from children under 13.
                      All child profiles are created and managed by parents or guardians.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Usage Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600">
                    We automatically collect certain information about how you use SafeStream:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Device information (type, operating system, browser)</li>
                    <li>IP address (for security and analytics)</li>
                    <li>Usage patterns (features used, time spent)</li>
                    <li>Error logs (to improve our service)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Provide and improve our service</h4>
                      <p className="text-gray-600">
                        We use your information to deliver SafeStream's features, fix bugs, and enhance user experience.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Personalize content</h4>
                      <p className="text-gray-600">
                        We curate age-appropriate content based on your child's profile and preferences.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Lock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Ensure safety and security</h4>
                      <p className="text-gray-600">
                        We monitor for suspicious activity and protect against fraud and abuse.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Database className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Communicate with you</h4>
                      <p className="text-gray-600">
                        We send important updates, security alerts, and optional newsletters (you can opt out anytime).
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-green-800 font-semibold">
                    We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </div>
                <p className="text-gray-600 mb-4">We may share your information only in these limited circumstances:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>
                    <strong>Service providers:</strong> Trusted partners who help us operate SafeStream (hosting,
                    analytics, customer support)
                  </li>
                  <li>
                    <strong>Legal requirements:</strong> When required by law or to protect our users' safety
                  </li>
                  <li>
                    <strong>Business transfers:</strong> In the event of a merger or acquisition (with continued privacy
                    protection)
                  </li>
                  <li>
                    <strong>With your consent:</strong> Any other sharing requires your explicit permission
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  We implement industry-standard security measures to protect your information:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">SSL/TLS encryption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Secure data centers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Regular security audits</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Access controls</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Activity monitoring</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">GDPR compliance</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights and Choices</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Access and portability</h4>
                      <p className="text-gray-600">Request a copy of your personal information in a portable format.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Correction</h4>
                      <p className="text-gray-600">
                        Update or correct your personal information at any time in your account settings.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Database className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Deletion</h4>
                      <p className="text-gray-600">Delete your account and all associated data permanently.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Lock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Opt-out</h4>
                      <p className="text-gray-600">
                        Unsubscribe from marketing communications while keeping your account active.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-gray-700 font-semibold">
                    SafeStream is designed with children's privacy as a top priority.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>We comply with the Children's Online Privacy Protection Act (COPPA)</li>
                    <li>We never knowingly collect personal information directly from children under 13</li>
                    <li>All child profiles are created and managed by parents or guardians</li>
                    <li>We don't show ads or collect data for advertising purposes</li>
                    <li>Child viewing data is only used to provide parental insights and improve safety</li>
                  </ul>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      If you believe we have inadvertently collected information from a child under 13, please contact
                      us immediately at privacy@safestream.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  If you have questions about this Privacy Policy or how we handle your information, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong> privacy@safestream.com
                  </p>
                  <p>
                    <strong>Address:</strong> SafeStream Privacy Team, 123 Safety Street, San Francisco, CA 94105
                  </p>
                  <p>
                    <strong>Phone:</strong> 1-800-SAFE-STREAM
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <p className="text-sm text-gray-600">
                    We'll respond to your privacy-related inquiries within 30 days. For urgent security concerns, please
                    use our security contact: security@safestream.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
