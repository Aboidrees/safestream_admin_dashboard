"use client"

import { useEffect, useState } from "react"

interface ScreenTimeData {
  id: string
  date: string
  minutesUsed: number
  childProfile: {
    id: string
    name: string
    avatarUrl: string | null
    screenTimeLimits: {
      dailyLimit?: number
      weeklyLimit?: number
      enabled?: boolean
    }
  }
}

interface Child {
  id: string
  name: string
  avatarUrl: string | null
  screenTimeLimits: any
}

export default function ScreenTimePage() {
  const [screenTime, setScreenTime] = useState<ScreenTimeData[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalMinutes: 0,
    averageMinutes: 0,
    totalRecords: 0
  })
  const [showLimitsModal, setShowLimitsModal] = useState(false)
  const [limitsForm, setLimitsForm] = useState({
    dailyLimit: "",
    weeklyLimit: "",
    enabled: true
  })

  useEffect(() => {
    fetchChildren()
  }, [])

  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0].id)
    }
  }, [children])

  useEffect(() => {
    if (selectedChild) {
      fetchScreenTime()
    }
  }, [selectedChild, days])

  const fetchChildren = async () => {
    try {
      const response = await fetch('/api/dashboard/children')
      const data = await response.json()
      setChildren(data.children || [])
    } catch (error) {
      console.error('Error fetching children:', error)
    }
  }

  const fetchScreenTime = async () => {
    if (!selectedChild) return

    try {
      setLoading(true)
      const response = await fetch(`/api/dashboard/screen-time?childId=${selectedChild}&days=${days}`)
      const data = await response.json()
      setScreenTime(data.screenTime || [])
      setSummary(data.summary || {
        totalMinutes: 0,
        averageMinutes: 0,
        totalRecords: 0
      })
    } catch (error) {
      console.error('Error fetching screen time:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetLimits = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChild) return

    try {
      const response = await fetch('/api/dashboard/screen-time/limits', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: selectedChild,
          dailyLimit: limitsForm.dailyLimit ? parseInt(limitsForm.dailyLimit) : null,
          weeklyLimit: limitsForm.weeklyLimit ? parseInt(limitsForm.weeklyLimit) : null,
          enabled: limitsForm.enabled
        }),
      })

      if (response.ok) {
        setShowLimitsModal(false)
        fetchChildren()
        fetchScreenTime()
      }
    } catch (error) {
      console.error('Error setting limits:', error)
    }
  }

  const handleResetScreenTime = async () => {
    if (!selectedChild || !confirm('Are you sure you want to reset today\'s screen time?')) return

    try {
      const response = await fetch('/api/dashboard/screen-time/limits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: selectedChild
        }),
      })

      if (response.ok) {
        fetchScreenTime()
      }
    } catch (error) {
      console.error('Error resetting screen time:', error)
    }
  }

  const selectedChildData = children.find(c => c.id === selectedChild)
  const limits = selectedChildData?.screenTimeLimits || {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Screen Time Control</h1>
        <p className="text-gray-600 mt-1">Monitor and manage screen time limits for your children</p>
      </div>

      {children.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">⏱️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Children Found</h2>
          <p className="text-gray-500 mb-6">Add children to your family to track their screen time</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
                  <select
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                  <select
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="14">Last 14 days</option>
                    <option value="30">Last 30 days</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setLimitsForm({
                      dailyLimit: limits.dailyLimit?.toString() || "",
                      weeklyLimit: limits.weeklyLimit?.toString() || "",
                      enabled: limits.enabled !== false
                    })
                    setShowLimitsModal(true)
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Set Limits
                </button>
                <button
                  onClick={handleResetScreenTime}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset Today
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600 mb-1">Total Screen Time</div>
              <div className="text-3xl font-bold text-gray-900">{Math.floor(summary.totalMinutes / 60)}h {summary.totalMinutes % 60}m</div>
              <div className="text-sm text-gray-500 mt-1">Last {days} days</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600 mb-1">Daily Average</div>
              <div className="text-3xl font-bold text-gray-900">{Math.floor(summary.averageMinutes / 60)}h {summary.averageMinutes % 60}m</div>
              <div className="text-sm text-gray-500 mt-1">Per day</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600 mb-1">Daily Limit</div>
              <div className="text-3xl font-bold text-gray-900">
                {limits.dailyLimit ? `${Math.floor(limits.dailyLimit / 60)}h ${limits.dailyLimit % 60}m` : "Not set"}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {limits.enabled ? "Active" : "Disabled"}
              </div>
            </div>
          </div>

          {/* Screen Time History */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Screen Time History</h2>
            </div>
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : screenTime.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No screen time data available</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Limit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {screenTime.map((record) => {
                      const dailyLimit = record.childProfile.screenTimeLimits?.dailyLimit || 0
                      const isOverLimit = dailyLimit > 0 && record.minutesUsed > dailyLimit
                      const percentage = dailyLimit > 0 ? (record.minutesUsed / dailyLimit) * 100 : 0

                      return (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {Math.floor(record.minutesUsed / 60)}h {record.minutesUsed % 60}m
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {dailyLimit > 0 ? `${Math.floor(dailyLimit / 60)}h ${dailyLimit % 60}m` : "No limit"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {dailyLimit > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${isOverLimit ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  />
                                </div>
                                <span className={`text-xs ${isOverLimit ? 'text-red-600' : 'text-green-600'}`}>
                                  {Math.round(percentage)}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">N/A</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Set Limits Modal */}
      {showLimitsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Set Screen Time Limits</h2>
            <form onSubmit={handleSetLimits}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="dailyLimit" className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Limit (minutes)
                  </label>
                  <input
                    type="number"
                    id="dailyLimit"
                    value={limitsForm.dailyLimit}
                    onChange={(e) => setLimitsForm({ ...limitsForm, dailyLimit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 120 (2 hours)"
                    min="0"
                    max="1440"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no daily limit</p>
                </div>

                <div>
                  <label htmlFor="weeklyLimit" className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Limit (minutes)
                  </label>
                  <input
                    type="number"
                    id="weeklyLimit"
                    value={limitsForm.weeklyLimit}
                    onChange={(e) => setLimitsForm({ ...limitsForm, weeklyLimit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 840 (14 hours)"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no weekly limit</p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={limitsForm.enabled}
                    onChange={(e) => setLimitsForm({ ...limitsForm, enabled: e.target.checked })}
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">
                    Enable screen time limits
                  </span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowLimitsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Save Limits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

