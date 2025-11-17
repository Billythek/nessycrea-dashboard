'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Redirect to site HTML
    window.location.href = '/site/index.html'
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'system-ui'
    }}>
      <p>Chargement...</p>
    </div>
  )
}
