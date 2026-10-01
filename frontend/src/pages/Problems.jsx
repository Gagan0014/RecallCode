import { useEffect, useState } from 'react'
import { problemsAPI } from '../api/problems'
import { Link } from 'react-router-dom'
import { AlertCircle, Trash2, ExternalLink } from 'lucide-react'

export function Problems() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, easy, medium, hard

  useEffect(() => {
    loadProblems()
  }, [])

  const loadProblems = async () => {
    try {
      setLoading(true)
      const response = await problemsAPI.getUserProblems()
      setProblems(response.data)
    } catch (err) {
      console.error('Error loading problems:', err)
      setError('Failed to load problems')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (problemId) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return
    
    try {
      // Add delete endpoint when backend supports it
      setProblems(problems.filter(p => p._id !== problemId))
    } catch (err) {
      console.error('Error deleting problem:', err)
    }
  }

  const filteredProblems = problems.filter(p => {
    if (filter === 'all') return true
    return p.difficulty?.toLowerCase() === filter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading problems...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Problems</h1>
          <p className="text-gray-600">Total: {filteredProblems.length} problems</p>
        </div>
        <Link
          to="/add-problem"
          className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Problem
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        {['all', 'easy', 'medium', 'hard'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Problems Table */}
      {filteredProblems.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Difficulty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reps</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Interval</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Next Review</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <tr key={problem._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{problem.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        problem.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-800'
                          : problem.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{problem.repetitions || 0}</td>
                  <td className="px-6 py-4 text-gray-600">{problem.interval || 1}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {problem.nextReviewDate
                      ? new Date(problem.nextReviewDate).toLocaleDateString()
                      : 'Not scheduled'}
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <a
                      href={problem.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                      title="View on LeetCode"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">No problems found</p>
          <Link
            to="/add-problem"
            className="text-blue-500 hover:underline font-medium"
          >
            Add your first problem
          </Link>
        </div>
      )}
    </div>
  )
}
