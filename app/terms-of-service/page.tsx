import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText, Users, AlertTriangle, Calendar } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center slide-in-left">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <FileText className="h-8 w-8 text-red-500" />
              <span className="text-red-500 font-medium text-lg">Terms of Service</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Terms of{" "}
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Please read these terms carefully before using SafeStream. They govern your use of our platform and
              services.
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

      {/* Key Points */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Shield,
                title: "Safe Environment",
                description:
                  "We maintain a family-friendly platform with strict content guidelines and safety measures.",
              },
              {
                icon: Users,
                title: "Family Focused",
                description:
                  "Our terms are designed to protect families and ensure appropriate use by parents and children.",
              },
              {
                icon: AlertTriangle,
                title: "Clear Guidelines",
                description: "We provide clear rules and expectations for using SafeStream responsibly and safely.",
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              By accessing or using SafeStream, you agree to be bound by these Terms of Service and all applicable laws
              and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing
              this site.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">2. Description of Service</h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              SafeStream is a family-friendly streaming platform that allows parents to:
            </p>

            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-8">
              <li>Create curated content libraries for their children</li>
              <li>Set parental controls and viewing time limits</li>
              <li>Monitor their children's viewing activity</li>
              <li>Manage multiple child profiles with age-appropriate content</li>
              <li>Access educational and entertaining content from trusted sources</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">3. User Accounts and Registration</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Creation</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>You must be at least 18 years old to create an account</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must notify us immediately of any unauthorized use</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Child Profiles</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Only parents or legal guardians may create child profiles</li>
                  <li>You are responsible for all activity on child profiles</li>
                  <li>Children under 13 require parental supervision while using the service</li>
                  <li>You must ensure child profiles contain accurate age information</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">4. Acceptable Use Policy</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Permitted Uses</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Personal, non-commercial use by families</li>
                  <li>Creating age-appropriate content collections</li>
                  <li>Educational and entertainment purposes</li>
                  <li>Sharing content within your family account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Prohibited Uses</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Sharing account credentials with unauthorized users</li>
                  <li>Attempting to bypass parental controls or safety features</li>
                  <li>Uploading or sharing inappropriate content</li>
                  <li>Using the service for commercial purposes without permission</li>
                  <li>Violating any applicable laws or regulations</li>
                  <li>Interfering with the service's security features</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">5. Content and Intellectual Property</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Content</h3>
                <p className="text-gray-600 leading-relaxed">
                  SafeStream and its content, features, and functionality are owned by SafeStream and are protected by
                  international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Content</h3>
                <p className="text-gray-600 leading-relaxed">
                  We provide access to third-party content through our platform. This content remains the property of
                  its respective owners. We do not claim ownership of third-party content and respect all applicable
                  copyright and intellectual property rights.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">User-Generated Content</h3>
                <p className="text-gray-600 leading-relaxed">
                  Any content you create, upload, or share through SafeStream (such as playlists or collections) remains
                  your property. However, you grant us a license to use this content to provide our services.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">6. Privacy and Data Protection</h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
              information. By using SafeStream, you agree to our Privacy Policy.
            </p>

            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-8">
              <li>We comply with COPPA regulations for children's data</li>
              <li>We use industry-standard security measures</li>
              <li>We do not sell personal information to third parties</li>
              <li>Parents have full control over their children's data</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">7. Subscription and Payment Terms</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Subscription Plans</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>We offer free and paid subscription plans</li>
                  <li>Paid subscriptions are billed monthly or annually</li>
                  <li>You can upgrade, downgrade, or cancel at any time</li>
                  <li>Refunds are provided according to our refund policy</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Processing</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Payments are processed by secure third-party providers</li>
                  <li>You authorize us to charge your payment method</li>
                  <li>You must keep payment information current</li>
                  <li>Failed payments may result in service suspension</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">8. Termination</h2>

            <p className="text-gray-600 leading-relaxed mb-6">Either party may terminate this agreement at any time:</p>

            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-8">
              <li>You may cancel your account at any time through your account settings</li>
              <li>We may terminate accounts that violate these terms</li>
              <li>We may suspend service for non-payment</li>
              <li>Upon termination, your access to the service will cease</li>
              <li>We will delete your data according to our data retention policy</li>
            </ul>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">9. Disclaimers and Limitations</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Availability</h3>
                <p className="text-gray-600 leading-relaxed">
                  While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. We may perform
                  maintenance, updates, or experience technical issues that temporarily affect availability.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Accuracy</h3>
                <p className="text-gray-600 leading-relaxed">
                  We work hard to ensure content is appropriate and accurately categorized, but we cannot guarantee the
                  accuracy of all content metadata or age ratings. Parents should review content before allowing
                  children to view it.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">10. Contact Information</h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              If you have questions about these Terms of Service, please contact us:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-2 text-gray-600">
                <li>
                  <strong>Email:</strong> legal@safestream.app
                </li>
                <li>
                  <strong>Address:</strong> SafeStream Legal Team, 123 Family Safety Blvd, Digital City, DC 12345
                </li>
                <li>
                  <strong>Phone:</strong> 1-800-SAFE-STREAM
                </li>
              </ul>
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
                    <a
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                {["FAQ", "Help Center", "Contact Us", "Community"].map((link, index) => (
                  <li key={index}>
                    <a
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:text-white transition-all duration-500 hover:translate-x-1 transform inline-block"
                    >
                      {link}
                    </a>
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
