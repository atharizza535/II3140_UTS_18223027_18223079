'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: string
  points: number
  category: string
  solved?: boolean
}

export default function CTFPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, { correct: boolean; message: string }>>({})

  useEffect(() => {
    loadChallenges()
  }, [])

  async function loadChallenges() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('User not authenticated')
        return
      }

      // Get all challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('ctf_challenges')
        .select('*')
        .order('points', { ascending: true })

      if (challengesError) {
        console.error('Error loading challenges:', challengesError)
        return
      }

      // Get user's solved challenges
      const { data: submissionsData } = await supabase
        .from('ctf_submissions')
        .select('challenge_id')
        .eq('user_id', user.id)
        .eq('correct', true)

      const solvedIds = new Set(submissionsData?.map(s => s.challenge_id) || [])

      const enrichedChallenges = challengesData?.map(c => ({
        ...c,
        solved: solvedIds.has(c.id)
      })) || []

      setChallenges(enrichedChallenges)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function submitFlag(challengeId: string) {
    const flag = flagInputs[challengeId]?.trim()
    
    if (!flag) {
      setResults({
        ...results,
        [challengeId]: { correct: false, message: 'Please enter a flag' }
      })
      return
    }

    setSubmitting(challengeId)
    
    try {
      const response = await fetch('/api/ctf/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: challengeId, flag })
      })

      const data = await response.json()

      if (response.ok) {
        setResults({
          ...results,
          [challengeId]: {
            correct: data.correct,
            message: data.correct ? '✅ Correct! Challenge solved!' : '❌ Incorrect flag. Try again!'
          }
        })

        if (data.correct) {
          // Reload challenges to update solved status
          setTimeout(() => loadChallenges(), 1000)
        }
      } else {
        setResults({
          ...results,
          [challengeId]: {
            correct: false,
            message: `Error: ${data.error || 'Failed to submit'}`
          }
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      setResults({
        ...results,
        [challengeId]: {
          correct: false,
          message: 'Network error. Please try again.'
        }
      })
    } finally {
      setSubmitting(null)
    }
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🎯 CTF Challenges</h1>
        <p className="text-gray-600 mt-1">Capture the flag and earn points!</p>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No challenges available yet</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for new challenges</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                challenge.solved ? 'border-2 border-green-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {challenge.title}
                    </h3>
                    {challenge.solved && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                        ✓ SOLVED
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{challenge.description}</p>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      difficultyColors[challenge.difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {challenge.difficulty?.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">
                      📂 {challenge.category}
                    </span>
                    <span className="text-sm font-semibold text-indigo-600">
                      🏆 {challenge.points} pts
                    </span>
                  </div>
                </div>
              </div>

              {!challenge.solved && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={flagInputs[challenge.id] || ''}
                      onChange={(e) => setFlagInputs({
                        ...flagInputs,
                        [challenge.id]: e.target.value
                      })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submitFlag(challenge.id)
                      }}
                      placeholder="Enter flag (e.g., FLAG{...})"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={submitting === challenge.id}
                    />
                    <button
                      onClick={() => submitFlag(challenge.id)}
                      disabled={submitting === challenge.id}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting === challenge.id ? 'Checking...' : 'Submit'}
                    </button>
                  </div>

                  {results[challenge.id] && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      results[challenge.id].correct 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {results[challenge.id].message}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
