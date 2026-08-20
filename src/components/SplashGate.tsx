import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { waitForStorefront } from '../lib/preload'

const SPLASH_ID = 'lumi-splash'

function splashEl() {
  return document.getElementById(SPLASH_ID)
}

function dismissSplash() {
  const el = splashEl()
  if (!el || el.classList.contains('is-done')) return
  el.classList.add('is-done')
  document.body.classList.remove('splash-locked')
  window.setTimeout(() => {
    el.remove()
  }, 800)
}

export function SplashGate() {
  const location = useLocation()
  const { catalog, loading } = useCatalog()

  useEffect(() => {
    if (!splashEl()) return

    document.body.classList.add('splash-locked')
    const startedAt = Date.now()

    if (location.pathname.startsWith('/admin')) {
      dismissSplash()
      return
    }

    if (loading) return

    let cancelled = false
    void waitForStorefront(catalog, startedAt).then(() => {
      if (!cancelled) dismissSplash()
    })

    return () => {
      cancelled = true
    }
  }, [catalog, loading, location.pathname])

  return null
}
