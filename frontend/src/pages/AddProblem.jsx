import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userProblemsAPI } from "../api/userProblems";
import { AlertCircle, Plus, Loader } from 'lucide-react'

export function AddProblem() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    titleSlug: '',
    difficulty: 'Medium',
    leetcodeUrl: '',
    tags: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      titleSlug: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!formData.title.trim()) {
      setError('Problem title is required')
      setLoading(false)
      return
    }

    if (!formData.titleSlug.trim()) {
      setError('Problem title slug is required')
      setLoading(false)
      return
    }

    if (!['Easy', 'Medium', 'Hard'].includes(formData.difficulty)) {
      setError('Difficulty must be Easy, Medium, or Hard')
      setLoading(false)
      return
    }

    try {
      const payload = {
        title: formData.title.trim(),
        titleSlug: formData.titleSlug.trim(),
        difficulty: formData.difficulty,
        tags: formData.tags.trim(),
        leetcodeUrl: formData.leetcodeUrl.trim(),
      }

      await userProblemsAPI.createUserProblem(payload)
      setSuccess(true)
      setTimeout(() => navigate('/problems'), 1500)
    } catch (err) {
      console.error('Error adding problem:', err)
      setError(err.response?.data?.message || 'Failed to add problem. Check required fields and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="text-green-600 mb-4 text-4xl">✓</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Problem Added!</h2>
          <p className="text-green-700 mb-6">Your problem has been added to the learning queue.</p>
          <p className="text-gray-600">Redirecting to problems list...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Problem</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Problem Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g., Two Sum"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title Slug *</label>
            <input
              type="text"
              name="titleSlug"
              value={formData.titleSlug}
              onChange={(e) => setFormData(prev => ({ ...prev, titleSlug: e.target.value }))}
              placeholder="e.g., two-sum"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-600 mt-1">Auto-generated from title. Must match LeetCode slug style.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LeetCode URL</label>
            <input
              type="url"
              name="leetcodeUrl"
              value={formData.leetcodeUrl}
              onChange={handleChange}
              placeholder="https://leetcode.com/problems/two-sum/"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Array, Hash Map"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Add Problem</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/problems')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Required backend fields:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• title</li>
          <li>• titleSlug</li>
          <li>• difficulty</li>
        </ul>
      </div>
    </div>
  )
}
