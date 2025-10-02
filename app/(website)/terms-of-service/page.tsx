import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, Shield, Users, AlertTriangle, CheckCircle, FileText } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-6">
            <Scale className="w-4 h-4 mr-2" />
            Terms of Service
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            These terms govern your use of SafeStream and outline our mutual responsibilities for creating a safe
            digital environment for families.
          </p>
          <p className="text-sm text-blue-200 mt-4">Last updated: January 1, 2024</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Summary */}
        <Card className="mb-12 border-0 shadow-md bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
              Terms Summary
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
                    <h4 className="font-semibold text-gray-900">Safe environment</h4>
                    <p className="text-sm text-gray-600">We provide a secure platform for family-friendly content.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Parental control</h4>
                    <p className="text-sm text-gray-600">
                      Parents maintain full control over their children's experience.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Scale className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Fair usage</h4>
                    <p className="text-sm text-gray-600">Use SafeStream responsibly and respect other users.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Clear policies</h4>
                    <p className="text-sm text-gray-600">Transparent terms with no hidden clauses.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Terms */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  By accessing or using SafeStream, you agree to be bound by these Terms of Service and our Privacy
                  Policy. If you disagree with any part of these terms, you may not access the service.
                </p>
                <p className="text-gray-600">
                  These terms apply to all visitors, users, and others who access or use the service, including parents,
                  guardians, and children using child profiles.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Description of Service</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  SafeStream is a family-friendly video streaming platform that allows parents to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mb-4">
                  <li>Create curated video collections from YouTube content</li>
                  <li>Set up child profiles with age-appropriate content restrictions</li>
                  <li>Monitor and control their children's viewing experience</li>
                  <li>Access parental controls and screen time management tools</li>
                </ul>
                <p className="text-gray-600">
                  We reserve the right to modify, suspend, or discontinue the service at any time with reasonable
                  notice.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Accounts and Registration</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Account Creation</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>You must be at least 18 years old to create an account</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>One person may not maintain more than one account</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Child Profiles</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Only parents or legal guardians may create child profiles</li>
                    <li>Child profiles are for children under 18 years old</li>
                    <li>Parents are responsible for all activity on child profiles</li>
                    <li>We do not collect personal information directly from children</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Acceptable Use Policy</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      You may:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                      <li>Use SafeStream for personal, non-commercial purposes</li>
                      <li>Create collections of appropriate content for your children</li>
                      <li>Share feedback and suggestions for improvement</li>
                      <li>Contact support for assistance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                      You may not:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                      <li>Attempt to circumvent parental controls or safety features</li>
                      <li>Share account credentials with unauthorized users</li>
                      <li>Use the service for commercial purposes without permission</li>
                      <li>Attempt to reverse engineer or hack the platform</li>
                      <li>Upload or share inappropriate content</li>
                      <li>Violate any applicable laws or regulations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Content and Intellectual Property</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Third-Party Content</h4>
                  <p className="text-gray-600">
                    SafeStream curates content from YouTube and other platforms. We do not own this content and are not
                    responsible for its accuracy, completeness, or appropriateness beyond our curation efforts.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">SafeStream Platform</h4>
                  <p className="text-gray-600">
                    The SafeStream platform, including its design, features, and technology, is owned by SafeStream and
                    protected by intellectual property laws. You may not copy, modify, or distribute our platform
                    without permission.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">User-Generated Content</h4>
                  <p className="text-gray-600">
                    Any content you create (such as collection names or descriptions) remains yours, but you grant us a
                    license to use it as necessary to provide our service.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Privacy and Data Protection</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  Your privacy is important to us. Our collection, use, and protection of your personal information is
                  governed by our Privacy Policy, which is incorporated into these terms by reference.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Key Privacy Points:</strong> We don't sell your data, we comply with COPPA for children's
                    privacy, and you can delete your account and data at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Subscription and Payment Terms</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Free and Paid Plans</h4>
                  <p className="text-gray-600">
                    SafeStream offers both free and paid subscription plans. Paid plans provide additional features and
                    capabilities as described on our pricing page.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Billing and Cancellation</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Subscriptions are billed monthly or annually as selected</li>
                    <li>You can cancel your subscription at any time</li>
                    <li>Cancellations take effect at the end of the current billing period</li>
                    <li>No refunds for partial months, except as required by law</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Price Changes</h4>
                  <p className="text-gray-600">
                    We may change subscription prices with 30 days' notice. Price changes will not affect your current
                    billing period.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Limitation of Liability</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <p className="text-yellow-800 text-sm font-semibold">Important Legal Information</p>
                </div>
                <p className="text-gray-600 mb-4">
                  SafeStream is provided "as is" without warranties of any kind. While we strive to provide a safe and
                  reliable service, we cannot guarantee uninterrupted access or complete accuracy of content curation.
                </p>
                <p className="text-gray-600">
                  To the maximum extent permitted by law, SafeStream shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, including but not limited to loss of profits, data, or
                  use.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Termination</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Termination by You</h4>
                  <p className="text-gray-600">
                    You may terminate your account at any time by contacting support or using the account deletion
                    feature in your settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Termination by SafeStream</h4>
                  <p className="text-gray-600">
                    We may terminate or suspend your account if you violate these terms, engage in harmful behavior, or
                    for other legitimate business reasons. We'll provide reasonable notice when possible.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Effect of Termination</h4>
                  <p className="text-gray-600">
                    Upon termination, your access to SafeStream will cease, and we may delete your account data in
                    accordance with our Privacy Policy and data retention policies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Changes to Terms</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  We may update these Terms of Service from time to time. When we make changes, we will:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4 mb-4">
                  <li>Update the "Last updated" date at the top of this page</li>
                  <li>Notify you via email or through the SafeStream platform</li>
                  <li>Provide at least 30 days' notice for material changes</li>
                </ul>
                <p className="text-gray-600">
                  Your continued use of SafeStream after changes take effect constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Contact Information</h2>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong> legal@safestream.com
                  </p>
                  <p>
                    <strong>Address:</strong> SafeStream Legal Team, 123 Safety Street, San Francisco, CA 94105
                  </p>
                  <p>
                    <strong>Phone:</strong> 1-800-SAFE-STREAM
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <p className="text-sm text-gray-600">
                    For technical support or account issues, please contact support@safestream.com or use our help
                    center.
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
