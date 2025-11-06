'use client'
import { useState } from 'react'
import '@/styles/terminal.css'

export default function TerminalSimulator() {
  const [lines, setLines] = useState<string[]>(['Welcome to Virtual Lab Terminal'])
  const [input, setInput] = useState('')

  function handleCommand(e: React.FormEvent) {
    e.preventDefault()
    let output = ''
    switch (input.trim()) {
      case 'help': output = 'Available commands: help, clear, about'; break
      case 'about': output = 'Virtual Lab Sister - simulated Linux shell'; break
      case 'clear': setLines([]); setInput(''); return
      default: output = `Command not found: ${input}`
    }
    setLines([...lines, `$ ${input}`, output])
    setInput('')
  }

  return (
    <div className="terminal">
      <div className="terminal-header">Simulated Shell</div>
      <div className="terminal-body">
        {lines.map((l, i) => <pre key={i}>{l}</pre>)}
        <form onSubmit={handleCommand}>
          <span>$ </span>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
        </form>
      </div>
    </div>
  )
}
