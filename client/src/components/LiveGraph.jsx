import { useState, useEffect } from 'react'

function LiveGraph() {
  const [graphData, setGraphData] = useState([])
  const [topEvents, setTopEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('24h')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const [statsResponse, eventsResponse] = await Promise.all([
          fetch('http://localhost:8000/api/events/stats/hourly', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:8000/api/events/stats/top', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ])

        const statsData = await statsResponse.json()
        const eventsData = await eventsResponse.json()

        if (statsData.success) {
          setGraphData(statsData.hourlyStats)
        } else {
          console.error('Failed to load statsData')
        }

        if (eventsData.success) {
          setTopEvents(eventsData.topEvents)
          console.log(topEvents)
        } else {
          console.error('Failed to load eventsData')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (topEvents.length > 0) {
      console.log(topEvents);
    }
  }, [topEvents]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const maxValue = Math.max(...graphData.map(d => d.count))
  const hours = [...Array(24)].map((_, i) => i)
  const totalUploads = graphData.reduce((acc, curr) => acc + curr.count, 0)
  const averagePerHour = (totalUploads / 24).toFixed(1)
  const peakHour = graphData.reduce((max, curr) => curr.count > max.count ? curr : max, { count: 0 }).hour

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
            <p className="text-gray-400 mt-1">Real-time event creation monitoring</p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            {['12h', '24h', '7d'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                          ${selectedPeriod === period
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {period.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-500/20 rounded-lg">
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Uploads</p>
                <p className="text-2xl font-bold text-white">{totalUploads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary-500/20 rounded-lg">
                <svg className="w-6 h-6 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Average Per Hour</p>
                <p className="text-2xl font-bold text-white">{averagePerHour}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Peak Hour</p>
                <p className="text-2xl font-bold text-white">{peakHour}:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Upload Activity</h2>
        <div className="h-[400px] relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-sm text-gray-400">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-right pr-4">
                {Math.round((maxValue * (5 - i)) / 5)}
              </span>
            ))}
          </div>

          <div className="ml-12 h-full flex items-end">
            {hours.map((hour) => {
              const data = graphData.find(d => d.hour === hour) || { count: 0 }
              const height = maxValue ? (data.count / maxValue) * 100 : 0

              return (
                <div key={hour} className="flex-1 flex flex-col items-center group">

                  <div className="w-full px-1">
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full bg-gradient-to-t from-primary-500 to-secondary-500 
                               rounded-t-lg transition-all duration-300 group-hover:from-primary-400 
                               group-hover:to-secondary-400 relative"
                    >

                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900/95 
                                    text-white px-3 py-2 rounded-lg text-sm opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300 
                                    whitespace-nowrap border border-white/10 shadow-xl">
                        <div className="font-medium">{data.count} uploads</div>
                        <div className="text-gray-400 text-xs">{hour}:00</div>
                      </div>
                    </div>
                  </div>

                  <span className="mt-2 text-xs text-gray-400">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              )
            })}
          </div>

          <div className="absolute inset-y-0 left-12 right-0 flex flex-col justify-between pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border-t border-white/5 w-full h-0" />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Top 10 Events</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Total Uploads:</span>
            <span className="text-lg font-bold text-white">
              {topEvents.reduce((acc, event) => acc + event.uploadCount, 0)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {topEvents.map((event, index) => {
            const percentage = event.uploadCount / Math.max(...topEvents.map(e => e.uploadCount)) * 100

            return (
              <div key={event._id} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                    <h3 className="text-sm font-medium text-white truncate max-w-[200px]">
                      {event.title}
                    </h3>
                  </div>
                  <span className="text-sm font-medium text-primary-400">
                    {event.uploadCount} uploads
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 
                             rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                  <span>{new Date(event.startDate).toLocaleDateString()}</span>
                  <span>{event.category}</span>
                </div>
              </div>
            )
          })}

          {topEvents.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-400">
              No event data available
            </div>
          )}

          {isLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-white/5 rounded-full w-3/4 mb-2" />
                  <div className="h-2 bg-white/5 rounded-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveGraph 