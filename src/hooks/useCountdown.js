import { useState, useEffect, useCallback } from 'react'
import { SITE } from '../config/site'

function getTimeLeft(target) {
  const diff = new Date(target) - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isLive: false,
  }
}

export function useCountdown(targetDate = SITE.launchDate) {
  const compute = useCallback(() => getTimeLeft(targetDate), [targetDate])
  const [timeLeft, setTimeLeft] = useState(compute)

  useEffect(() => {
    setTimeLeft(compute())
    const id = setInterval(() => setTimeLeft(compute()), 1000)
    return () => clearInterval(id)
  }, [compute])

  return timeLeft
}
