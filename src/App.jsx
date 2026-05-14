import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { isSupabaseConfigured, supabase } from './lib/supabase'

function App() {
  const [instruments, setInstruments] = useState([])
  const [status, setStatus] = useState(
    isSupabaseConfigured ? 'Connecting to Supabase' : 'Waiting for env vars',
  )
  const [error, setError] = useState('')

  const loadInstruments = useCallback(async () => {
    if (!supabase) return

    setStatus('Loading instruments')
    setError('')

    const { data, error } = await supabase
      .from('instruments')
      .select('id, name')
      .order('id', { ascending: true })

    if (error) {
      setStatus('Supabase is configured')
      setError(error.message)
      return
    }

    setInstruments(data ?? [])
    setStatus('Supabase connected')
  }, [])

  useEffect(() => {
    const refresh = window.setTimeout(loadInstruments, 0)

    return () => window.clearTimeout(refresh)
  }, [loadInstruments])

  return (
    <main>
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">React + Vercel + Supabase</p>
        <h1 id="page-title">Hello world from Peply</h1>
        <p className="lede">
          A tiny Vite React app wired for Supabase data and ready to deploy on
          Vercel.
        </p>
      </section>

      <section className="workspace" aria-label="Project status">
        <article className="panel">
          <div className="panel-header">
            <h2>Supabase</h2>
            <span className="status">{status}</span>
          </div>

          {!isSupabaseConfigured && (
            <div className="notice">
              Add your project URL and publishable key to{' '}
              <code>.env.local</code> using <code>.env.example</code> as the
              template.
            </div>
          )}

          {error && (
            <div className="notice warning">
              {error}. Run <code>supabase/instruments.sql</code> in your
              Supabase SQL editor to create the sample table.
            </div>
          )}

          <ul className="instrument-list">
            {instruments.length > 0 ? (
              instruments.map((instrument) => (
                <li key={instrument.id}>{instrument.name}</li>
              ))
            ) : (
              <li className="empty">Sample instruments will appear here.</li>
            )}
          </ul>

          <button
            type="button"
            onClick={loadInstruments}
            disabled={!isSupabaseConfigured}
          >
            Refresh data
          </button>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Vercel</h2>
            <span className="status">Configured</span>
          </div>
          <p>
            SPA rewrites live in <code>vercel.json</code>. Set the same
            Supabase env vars in Vercel before deploying.
          </p>
          <div className="commands" aria-label="Deployment commands">
            <code>npm run build</code>
            <code>npm run deploy</code>
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
