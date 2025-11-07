export interface CTFChallenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  category: string
  flag_hash: string
  created_at: string
}

export interface CTFSubmission {
  id: string
  user_id: string
  challenge_id: string
  submitted_flag: string
  correct: boolean
  submitted_at: string
}

export interface LeaderboardEntry {
  user_id: string
  score: number
  full_name?: string
}