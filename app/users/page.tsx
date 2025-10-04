"use client"

import { useEffect, useState } from "react"
import { Search, UserPlus, Ban, CheckCircle, XCircle, Mail, Calendar, Shield, Wallet, X, User as UserIcon, UserCheck } from "lucide-react"
import type { User } from "@/lib/types"
import ConfirmationModal from "@/components/confirmation-modal"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [confirmation, setConfirmation] = useState<{
    show: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    type: 'danger' | 'warning' | 'info' | 'success'
    onConfirm: () => void
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by isActive
    if (isActiveFilter != "all") {
      filtered = filtered.filter(user => isActiveFilter === 'active' ? user.isActive : !user.isActive)
    }

    setFilteredUsers(filtered)
  }, [searchTerm, users, isActiveFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      const data = await response.json()

      if (response.ok && data.users) {
        setUsers(data.users)
      } else {
        console.error('Failed to fetch users:', data.error)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }


  const handleBanUser = async (userId: string) => {
    showConfirmation(
      "Ban User",
      "Are you sure you want to ban this user? They will lose access to the platform.",
      "Yes, Ban User",
      "Cancel",
      "warning",
      async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/users/${userId}/ban`, { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'ban' })
          })
          const data = await response.json()

          if (response.ok) {
            showToast("User banned successfully", "success")
            fetchUsers()
          } else {
            showToast(data.error || "Failed to ban user", "error")
          }
        } catch (error) {
          console.error("Error banning user:", error)
          showToast("Failed to ban user", "error")
        } finally {
          setIsLoading(false)
        }
      }
    )
  }

  const handleDeleteUser = async (userId: string) => {
    showConfirmation(
      "Delete User",
      "Are you sure you want to delete this user? This action cannot be undone and all user data will be permanently removed.",
      "Yes, Delete User",
      "Cancel",
      "danger",
      async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
          const data = await response.json()

          if (response.ok) {
            showToast("User deleted successfully", "success")
            fetchUsers()
          } else {
            showToast(data.error || "Failed to delete user", "error")
          }
        } catch (error) {
          console.error("Error deleting user:", error)
          showToast("Failed to delete user", "error")
        } finally {
          setIsLoading(false)
        }
      }
    )
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const closeUserModal = () => {
    setSelectedUser(null)
    setShowUserModal(false)
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const showConfirmation = (
    title: string,
    message: string,
    confirmText: string,
    cancelText: string,
    type: 'danger' | 'warning' | 'info' | 'success',
    onConfirm: () => void
  ) => {
    setConfirmation({
      show: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm
    })
  }

  const hideConfirmation = () => {
    setConfirmation(null)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          User Management
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage all platform users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Users</p>
              <p className="text-3xl font-bold text-green-600">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Subscribers</p>
              <p className="text-3xl font-bold text-purple-600">
                {/* {users.filter(u => u.isSubscribed).length} */}
                0
              </p>
            </div>
            <Wallet className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:col-span-1 max-w-xs">
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
              Active Users
            </label>
            <select
              id="isActive"
              value={isActiveFilter}
              onChange={(e) => setIsActiveFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No users found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Families
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user: User) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewUser(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
             
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.familyCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isActive ? (
                        <span className="px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3" />
                          Banned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleBanUser(user.id)}
                          className={user.isActive ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"}
                          title={user.isActive ? "Ban User" : "Unban User"}
                        >
                          {user.isActive ? <Ban className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <UserIcon className="h-6 w-6 text-blue-600" />
                User Details
              </h2>
              <button
                onClick={closeUserModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Avatar and Basic Info */}
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 flex-shrink-0">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-2xl">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Mail className="h-4 w-4" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {selectedUser.isActive ? (
                      <span className="px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3" />
                        Banned
                      </span>
                    )}
                    {selectedUser.isDeleted && (
                      <span className="px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        <XCircle className="h-3 w-3" />
                        Deleted
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <div className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                      {selectedUser.id}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div className="text-sm text-gray-900 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      {selectedUser.role}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family Count</label>
                    <div className="text-sm text-gray-900 flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-green-600" />
                      {selectedUser.familyCount || 0} families
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                    <div className="text-sm text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                    <div className="text-sm text-gray-900">
                      {selectedUser.isActive ? (
                        <span className="text-green-600 font-medium">Active Account</span>
                      ) : (
                        <span className="text-red-600 font-medium">Inactive Account</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <div className="text-sm text-gray-900">
                      Regular User
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    closeUserModal()
                    const action = selectedUser.isActive ? 'ban' : 'unban'
                    const actionText = selectedUser.isActive ? 'Ban' : 'Unban'
                    const message = selectedUser.isActive 
                      ? "Are you sure you want to ban this user? They will lose access to the platform."
                      : "Are you sure you want to unban this user? They will regain access to the platform."
                    
                    showConfirmation(
                      `${actionText} User`,
                      message,
                      `Yes, ${actionText} User`,
                      "Cancel",
                      selectedUser.isActive ? "warning" : "success",
                      async () => {
                        setIsLoading(true)
                        try {
                          const response = await fetch(`/api/users/${selectedUser.id}/ban`, { 
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ action })
                          })
                          const data = await response.json()

                          if (response.ok) {
                            showToast(`User ${action}ned successfully`, "success")
                            fetchUsers()
                          } else {
                            showToast(data.error || `Failed to ${action} user`, "error")
                          }
                        } catch (error) {
                          console.error(`Error ${action}ning user:`, error)
                          showToast(`Failed to ${action} user`, "error")
                        } finally {
                          setIsLoading(false)
                        }
                      }
                    )
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                    selectedUser.isActive 
                      ? 'bg-orange-600 text-white hover:bg-orange-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedUser.isActive ? <Ban className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  {selectedUser.isActive ? 'Ban User' : 'Unban User'}
                </button>
                <button
                  onClick={() => {
                    closeUserModal()
                    handleDeleteUser(selectedUser.id)
                  }}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Delete User
                </button>
                <button
                  onClick={closeUserModal}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : toast.type === 'error' 
              ? 'bg-red-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {toast.type === 'error' && <XCircle className="h-5 w-5" />}
            {toast.type === 'info' && <Shield className="h-5 w-5" />}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-75"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation?.show || false}
        onClose={hideConfirmation}
        onConfirm={() => {
          confirmation?.onConfirm()
          hideConfirmation()
        }}
        title={confirmation?.title || ""}
        message={confirmation?.message || ""}
        confirmText={confirmation?.confirmText || ""}
        cancelText={confirmation?.cancelText || ""}
        type={confirmation?.type || "info"}
        isLoading={isLoading}
      />
    </div>
  )
}

