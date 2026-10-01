import { useEffect, useState } from 'react'
import { problemsAPI } from '../api/problems'
import { AlertCircle, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'

// SM-2 Rating meanings
const RATINGS = [
  { value: 0, label: 'Complete blackout', color: 'red' },
  { value: 1, label: 'Incorrect recall', color: 'red' },
  { value: 2, label: 'Difficult recall', color: 'orange' },
  { value: 3, label: 'Correct with effort', color: 'yellow' },
  { value: 4, label: 'Good recall', color: 'blue' },
  { value: 5, label: 'Perfect recall', color: 'green' },
]

export function Review() {
  const [problems, setProblems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  useEffect(() => {
    const loadProblems = async () => {
      try {
        setLoading(true)
        const response = await problemsAPI.getDueProblems()
        setProblems(response.data)
      } catch (err) {
        console.error('Error loading problems:', err)
        setError('Failed to load problems for review')
      } finally {
        setLoading(false)
      }
    }
    loadProblems()
  }, [])

  const handleRating = async (rating) => {
    if (currentIndex >= problems.length) return

    try {
      setSubmitting(true)
      const problem = problems[currentIndex]
      await problemsAPI.rateProblem(problem._id, rating)
      setReviewedCount(reviewedCount + 1)
      
      // Move to next problem
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // All problems reviewed
        setProblems([])
      }
    } catch (err) {
      console.error('Error submitting rating:', err)
      setError('Failed to submit rating')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading problems for review...</p>
        </div>
      </div>
    )
  }

  if (problems.length === 0 && reviewedCount > 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Great work! 🎉</h1>
        <p className="text-gray-600 mb-4">You've completed {reviewedCount} review(s) today.</p>
        <p className="text-gray-600 mb-6">Come back tomorrow for more problems to review.</p>
        <a
          href="/dashboard"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">No problems due today</h1>
        <p className="text-gray-600 mb-6">Great! You're all caught up. Review problems will appear here when they're due.</p>
        <a
          href="/dashboard"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    )
  }

  const currentProblem = problems[currentIndex]
  const progress = ((currentIndex + 1) / problems.length) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Review Session</h1>
          <span className="text-gray-600 text-sm">
            {currentIndex + 1} of {problems.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Problem Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentProblem.title}</h2>
              <p className="text-gray-600 mt-1">Problem #{currentProblem.problemNumber}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                currentProblem.difficulty === 'Easy'
                  ? 'bg-green-100 text-green-800'
                  : currentProblem.difficulty === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {currentProblem.difficulty}
            </span>
          </div>

          {/* Problem Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-600 text-xs font-medium uppercase">Repetitions</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{currentProblem.repetitions || 0}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-medium uppercase">Interval (days)</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{currentProblem.interval || 1}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-medium uppercase">Ease Factor</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{currentProblem.easeFactor || 2.5}</p>
            </div>
          </div>
        </div>

        {/* LeetCode Link */}
        <div className="mt-6 pt-6 border-t">
          <a
            href={currentProblem.leetcodeUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 font-medium flex items-center space-x-2"
          >
            <span>View on LeetCode →</span>
          </a>
        </div>
      </div>

      {/* Rating Instructions */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>How well did you recall this problem?</strong> Rate your recall quality (0-5):
        </p>
      </div>

      {/* Rating Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {RATINGS.map((rating) => (
          <button
            key={rating.value}
            onClick={() => handleRating(rating.value)}
            disabled={submitting}
            className={`p-4 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              rating.color === 'red'
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : rating.color === 'orange'
                ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                : rating.color === 'yellow'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : rating.color === 'blue'
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                : rating.color === 'green'
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : ''
            }`}
          >
            <div className="font-bold text-lg">{rating.value}</div>
            <div className="text-xs mt-1">{rating.label}</div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Previous</span>
        </button>
        <span className="text-gray-600 text-sm">Reviewed: {reviewedCount}</span>
        <button
          onClick={() => setCurrentIndex(Math.min(problems.length - 1, currentIndex + 1))}
          disabled={currentIndex === problems.length - 1}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
