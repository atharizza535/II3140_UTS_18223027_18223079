'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Notification {
  id: string
  message: string
  created_at: string
  is_read: boolean
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    try {
      console.log('🔔 Fetching notifications...')
      const response = await fetch('/api/notifications')
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Notifications fetched:', data)
        setNotifications(data.notifications || [])
      } else {
        const errorData = await response.json()
        console.error('❌ Failed to fetch notifications:', errorData)
      }
    } catch (err) {
      console.error('💥 Error fetching notifications:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)

    // Subscribe to real-time notifications
    const channel = supabase
      .channel('notifications_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          console.log('🔔 New notification received:', payload)
          fetchNotifications()
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status)
      })

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      })

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== notificationId))
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    if (notifications.length === 0) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
      })

      if (response.ok) {
        setNotifications([])
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.length

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-indigo-600 rounded transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown - positioned to the left to avoid cutoff */}
          <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-40 max-h-96 overflow-hidden flex flex-col">
            <div className="p-3 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900">Notifikasi</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Tandai semua'}
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm">Tidak ada notifikasi baru</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm text-gray-700 flex-1">
                          {notification.message}
                        </p>
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs shrink-0"
                        >
                          ✓
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}