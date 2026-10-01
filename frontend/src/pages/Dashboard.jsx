import { useEffect, useState } from 'react'
import { problemsAPI } from '../api/problems'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { TrendingUp, BookOpen, AlertCircle, Calendar, Activity } from 'lucide-react'

export function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProblems: 0,
    dueToday: 0,
    completedToday: 0,
  })
  const [dueProblems, setDueProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const allProblems = await problemsAPI.getUserProblems()
        const due = await problemsAPI.getDueProblems()
        
        setStats({
          totalProblems: allProblems.data.length,
          dueToday: due.data.length,
          completedToday: 0, // This would come from backend if tracked
        })
        setDueProblems(due.data.slice(0, 5)) // Show first 5 due problems
      } catch (err) {
        console.error('Error loading dashboard:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-600">Keep your coding patterns fresh with spaced repetition</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Problems */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Problems</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalProblems}</p>
            </div>
            <BookOpen className="text-blue-500 opacity-20" size={40} />
          </div>
          <p className="text-gray-600 text-xs mt-4">Problems in your learning queue</p>
        </div>

        {/* Due Today */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Due Today</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.dueToday}</p>
            </div>
            <Calendar className="text-orange-500 opacity-20" size={40} />
          </div>
          <Link
            to="/review"
            className="text-orange-500 hover:text-orange-600 text-sm font-medium mt-4 inline-block"
          >
            Start review →
          </Link>
        </div>

        {/* Completed Today */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed Today</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.completedToday}</p>
            </div>
            <Activity className="text-green-500 opacity-20" size={40} />
          </div>
          <p className="text-gray-600 text-xs mt-4">Great job! Keep it up</p>
        </div>
      </div>

      {/* Due Problems Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <TrendingUp size={24} className="text-blue-500" />
          <span>Due for Review</span>
        </h2>

        {dueProblems.length > 0 ? (
          <div className="space-y-3">
            {dueProblems.map((problem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{problem.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Repetition: {problem.repetitions || 0} | Last reviewed: {problem.lastReviewDate || 'Never'}
                  </p>
                </div>
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
              </div>
            ))}
            <Link
              to="/review"
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg text-center transition-colors"
            >
              Start Review Session
            </Link>
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="mx-auto text-gray-400 mb-3" size={40} />
            <p className="text-gray-600 mb-4">No problems due today!</p>
            <Link
              to="/problems"
              className="text-blue-500 hover:underline font-medium"
            >
              Add new problems to your queue
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
