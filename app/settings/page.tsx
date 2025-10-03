"use client"

import { useState } from "react"
import { Settings, Save, Database, Shield, Globe, Bell } from "lucide-react"

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "SafeStream",
    siteUrl: "https://safestream.app",
    adminEmail: "admin@safestream.app",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxChildrenPerFamily: 5,
    defaultScreenTimeLimit: 120,
    enableNotifications: true,
    enablePublicCollections: true,
  })

  const handleSave = async () => {
    setSaving(true)
    // TODO: Implement settings save API
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert("Settings saved successfully!")
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            System Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Configure platform-wide settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                id="siteName"
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Site URL
              </label>
              <input
                id="siteUrl"
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="allowRegistration" className="block text-sm font-medium text-gray-900">
                  Allow User Registration
                </label>
                <p className="text-sm text-gray-500">Allow new users to register on the platform</p>
              </div>
              <input
                id="allowRegistration"
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="requireEmailVerification" className="block text-sm font-medium text-gray-900">
                  Require Email Verification
                </label>
                <p className="text-sm text-gray-500">Users must verify their email before accessing the platform</p>
              </div>
              <input
                id="requireEmailVerification"
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="maxChildren" className="block text-sm font-medium text-gray-700 mb-2">
                Max Children per Family
              </label>
              <input
                id="maxChildren"
                type="number"
                min="1"
                max="20"
                value={settings.maxChildrenPerFamily}
                onChange={(e) => setSettings({ ...settings, maxChildrenPerFamily: parseInt(e.target.value) })}
                className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Database className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Content Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="defaultScreenTime" className="block text-sm font-medium text-gray-700 mb-2">
                Default Screen Time Limit (minutes/day)
              </label>
              <input
                id="defaultScreenTime"
                type="number"
                min="30"
                max="480"
                step="30"
                value={settings.defaultScreenTimeLimit}
                onChange={(e) => setSettings({ ...settings, defaultScreenTimeLimit: parseInt(e.target.value) })}
                className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Applied to new child profiles</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="enablePublicCollections" className="block text-sm font-medium text-gray-900">
                  Enable Public Collections
                </label>
                <p className="text-sm text-gray-500">Allow users to create publicly shared collections</p>
              </div>
              <input
                id="enablePublicCollections"
                type="checkbox"
                checked={settings.enablePublicCollections}
                onChange={(e) => setSettings({ ...settings, enablePublicCollections: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="enableNotifications" className="block text-sm font-medium text-gray-900">
                  Enable Platform Notifications
                </label>
                <p className="text-sm text-gray-500">Send notifications for important events and alerts</p>
              </div>
              <input
                id="enableNotifications"
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Maintenance Mode</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="maintenanceMode" className="block text-sm font-medium text-gray-900">
                Enable Maintenance Mode
              </label>
              <p className="text-sm text-gray-500">Display maintenance page and prevent user access</p>
            </div>
            <input
              id="maintenanceMode"
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
          </div>
          {settings.maintenanceMode && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                ⚠️ <strong>Warning:</strong> Maintenance mode is enabled. Only admin users can access the platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

