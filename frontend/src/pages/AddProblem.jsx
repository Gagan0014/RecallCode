import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { problemsAPI } from '../api/problems'
import { AlertCircle, Plus, Loader } from 'lucide-react'

export function AddProblem() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    problemNumber: '',
    difficulty: 'Medium',
    leetcodeUrl: '',
    tags: '',
    notes: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Prepare data
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        problemNumber: parseInt(formData.problemNumber) || null,
      }

      // Call API
      await problemsAPI.createProblem(data)
      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/problems')
      }, 2000)
    } catch (err) {
      console.error('Error adding problem:', err)
      setError(err.response?.data?.message || 'Failed to add problem')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="text-green-600 mb-4">✓</div>
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
          {/* Problem Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Problem Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Two Sum"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Problem Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LeetCode Problem Number</label>
            <input
              type="number"
              name="problemNumber"
              value={formData.problemNumber}
              onChange={handleChange}
              placeholder="e.g., 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty */}
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

          {/* LeetCode URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LeetCode URL</label>
            <input
              type="url"
              name="leetcodeUrl"
              value={formData.leetcodeUrl}
              onChange={handleChange}
              placeholder="https://leetcode.com/problems/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., Array, Hash Map, Two Pointers"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about your approach or solution..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
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

      {/* Helper Text */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Fill in the LeetCode URL to easily access the problem during review</li>
          <li>• Add relevant tags to categorize and filter problems</li>
          <li>• Your notes will help you remember your approach</li>
        </ul>
      </div>
    </div>
  )
}
