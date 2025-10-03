"use client"

import { useEffect, useState } from "react"

interface RemoteCommand {
  id: string
  commandType: string
  payload: any
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'CANCELLED'
  createdAt: string
  executedAt: string | null
  childProfile: {
    id: string
    name: string
    avatarUrl: string | null
    family: {
      id: string
      name: string
    }
  }
}

interface Child {
  id: string
  name: string
  avatarUrl: string | null
}

export default function RemoteControlPage() {
  const [commands, setCommands] = useState<RemoteCommand[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [showSendModal, setShowSendModal] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendForm, setSendForm] = useState({
    commandType: "PAUSE",
    message: ""
  })

  const commandTypes = [
    { value: "PAUSE", label: "⏸️ Pause Video", description: "Pause current video playback" },
    { value: "RESUME", label: "▶️ Resume Video", description: "Resume paused video" },
    { value: "LOCK_DEVICE", label: "🔒 Lock Device", description: "Lock the child device" },
    { value: "UNLOCK_DEVICE", label: "🔓 Unlock Device", description: "Unlock the device" },
    { value: "LOGOUT", label: "👋 Logout", description: "Log out child from device" },
    { value: "EMERGENCY_MESSAGE", label: "📢 Emergency Message", description: "Send urgent message" },
  ]

  useEffect(() => {
    fetchChildren()
    fetchCommands()
  }, [])

  useEffect(() => {
    if (selectedChild) {
      fetchCommands()
    }
  }, [selectedChild])

  const fetchChildren = async () => {
    try {
      const response = await fetch('/api/dashboard/children')
      const data = await response.json()
      setChildren(data.children || [])
    } catch (error) {
      console.error('Error fetching children:', error)
    }
  }

  const fetchCommands = async () => {
    try {
      setLoading(true)
      const url = selectedChild 
        ? `/api/dashboard/remote-control?childId=${selectedChild}`
        : '/api/dashboard/remote-control'
      const response = await fetch(url)
      const data = await response.json()
      setCommands(data.commands || [])
    } catch (error) {
      console.error('Error fetching commands:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChild) {
      alert('Please select a child')
      return
    }

    try {
      setSending(true)
      const response = await fetch('/api/dashboard/remote-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: selectedChild,
          commandType: sendForm.commandType,
          payload: {
            message: sendForm.message || undefined
          }
        }),
      })

      if (response.ok) {
        setSendForm({ commandType: "PAUSE", message: "" })
        setShowSendModal(false)
        fetchCommands()
      }
    } catch (error) {
      console.error('Error sending command:', error)
    } finally {
      setSending(false)
    }
  }

  const handleCancelCommand = async (commandId: string) => {
    if (!confirm('Are you sure you want to cancel this command?')) return

    try {
      const response = await fetch(`/api/dashboard/remote-control/${commandId}`, {
        method: 'PATCH'
      })

      if (response.ok) {
        fetchCommands()
      }
    } catch (error) {
      console.error('Error cancelling command:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      EXECUTED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    }
    return styles[status as keyof typeof styles] || styles.PENDING
  }

  const getCommandIcon = (type: string) => {
    const icons: Record<string, string> = {
      PAUSE: '⏸️',
      RESUME: '▶️',
      LOCK_DEVICE: '🔒',
      UNLOCK_DEVICE: '🔓',
      LOGOUT: '👋',
      EMERGENCY_MESSAGE: '📢'
    }
    return icons[type] || '📱'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Remote Control</h1>
          <p className="text-gray-600 mt-1">Send instant commands to child devices</p>
        </div>
        <button
          onClick={() => setShowSendModal(true)}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          disabled={children.length === 0}
        >
          Send Command
        </button>
      </div>

      {children.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Children Found</h2>
          <p className="text-gray-500">Add children to your family to use remote control</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filter */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by Child:</label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Children</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Commands List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Command History</h2>
            </div>
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading commands...</div>
            ) : commands.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No commands sent yet</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {commands.map((command) => (
                  <div key={command.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-3xl">{getCommandIcon(command.commandType)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {command.commandType.replace(/_/g, ' ')}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(command.status)}`}>
                              {command.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Sent to <span className="font-medium">{command.childProfile.name}</span> in {command.childProfile.family.name}
                          </p>
                          {command.payload?.message && (
                            <div className="bg-gray-100 rounded px-3 py-2 text-sm text-gray-700 mb-2">
                              💬 {command.payload.message}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Sent: {new Date(command.createdAt).toLocaleString()}</span>
                            {command.executedAt && (
                              <span>Executed: {new Date(command.executedAt).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {command.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelCommand(command.id)}
                          className="ml-4 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Send Command Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Remote Command</h2>
            <form onSubmit={handleSendCommand}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="child" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Child *
                  </label>
                  <select
                    id="child"
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a child...</option>
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Command Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {commandTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          sendForm.commandType === type.value
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="commandType"
                          value={type.value}
                          checked={sendForm.commandType === type.value}
                          onChange={(e) => setSendForm({ ...sendForm, commandType: e.target.value })}
                          className="sr-only"
                        />
                        <div className="font-medium text-gray-900 mb-1">{type.label}</div>
                        <div className="text-xs text-gray-600">{type.description}</div>
                      </label>
                    ))}
                  </div>
                </div>

                {sendForm.commandType === 'EMERGENCY_MESSAGE' && (
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={sendForm.message}
                      onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter your urgent message..."
                      rows={3}
                      required
                    />
                  </div>
                )}

                {sendForm.commandType !== 'EMERGENCY_MESSAGE' && (
                  <div>
                    <label htmlFor="optionalMessage" className="block text-sm font-medium text-gray-700 mb-2">
                      Optional Message
                    </label>
                    <textarea
                      id="optionalMessage"
                      value={sendForm.message}
                      onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Add a message for your child..."
                      rows={2}
                    />
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 text-xl">⚠️</span>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Command will be sent immediately</p>
                    <p>The command will expire in 5 minutes if not executed by the device.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowSendModal(false)
                    setSendForm({ commandType: "PAUSE", message: "" })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={sending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Send Command"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

