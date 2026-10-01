import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api/auth'
import { problemsAPI } from '../api/problems'
import { AlertCircle, CheckCircle, Save, Loader, RefreshCw } from 'lucide-react'

export function Settings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    dailyReviewLimit: 10,
    emailTime: '09:00',
    timeZone: 'UTC',
    leetcodeUsername: '',
    name: '',
    email: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        dailyReviewLimit: user.dailyReviewLimit || 10,
        emailTime: user.emailTime || '09:00',
        timeZone: user.timeZone || 'UTC',
        leetcodeUsername: user.leetcodeUsername || '',
        name: user.name || '',
        email: user.email || '',
      })
      setLoading(false)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      await authAPI.updatePreferences(formData)
      setMessage({
        type: 'success',
        text: 'Settings saved successfully! 🎉'
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save settings'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSync = async () => {
    if (!formData.leetcodeUsername.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter your LeetCode username first'
      })
      return
    }

    setSyncing(true)
    setMessage({ type: '', text: '' })
    
    try {
      const response = await problemsAPI.syncLeetCode(formData.leetcodeUsername)
      setMessage({
        type: 'success',
        text: `✅ Synced successfully! Added ${response.data.problemsAdded || 0} new problems.`
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (err) {
      console.error('Error syncing with LeetCode:', err)
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to sync with LeetCode. Please check your username.'
      })
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
      <p className="text-gray-600 mb-8">Manage your preferences and profile</p>

      {/* Messages */}
      {message.text && (
        <div
          className={`rounded-lg p-4 flex items-start space-x-3 mb-6 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}
          >
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LeetCode Username</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="leetcodeUsername"
                  value={formData.leetcodeUsername}
                  onChange={handleChange}
                  placeholder="Enter your LeetCode username"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing || !formData.leetcodeUsername}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
                >
                  {syncing ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      <span>Sync</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">Sync your solved LeetCode problems automatically</p>
            </div>
          </div>
        </div>

        {/* Review Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Review Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Review Limit
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  name="dailyReviewLimit"
                  value={formData.dailyReviewLimit}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-600 text-sm">problems per day</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Maximum problems to review daily</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Email Time
              </label>
              <input
                type="time"
                name="emailTime"
                value={formData.emailTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-1">When to send daily reminder emails</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="GMT">GMT</option>
                <option value="EST">EST (Eastern)</option>
                <option value="CST">CST (Central)</option>
                <option value="MST">MST (Mountain)</option>
                <option value="PST">PST (Pacific)</option>
                <option value="IST">IST (India)</option>
                <option value="JST">JST (Japan)</option>
                <option value="AEST">AEST (Australia)</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">Your local timezone</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {saving ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Enter your LeetCode username to enable automatic problem syncing</li>
          <li>• Click "Sync" to fetch your solved problems from LeetCode</li>
          <li>• Adjust daily review limit based on your availability</li>
          <li>• Email reminders will be sent at your preferred time in your timezone</li>
        </ul>
      </div>
    </div>
  )
}
