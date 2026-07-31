import { type PropsWithChildren, useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

import type { InsightData } from '@/services/aiService'
import { askGeminiChat } from '@/services/aiService'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import type { SimulationRecord } from '@/data/simulation'

interface ContentProps {
  insight: InsightData
  simulationId: string
}

interface Message {
  role: 'user' | 'model'
  text: string
}

function Paragraph({ children }: PropsWithChildren) {
  return <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
}

function FormattedMessage({ text }: { text: string }) {
  const parts = text.split('\n').map((line, lineIndex) => {
    const cleanLine = line.replace(/#{1,6}\s?/g, '')

    const boldParts = cleanLine.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
      }
      return part
    })

    return (
      <span key={lineIndex} className="block mb-2">
        {boldParts}
      </span>
    )
  })

  return <div className="text-muted-foreground text-sm leading-relaxed">{parts}</div>
}

function SectionTitle({ children }: PropsWithChildren) {
  return (
    <h3 className="text-foreground mt-5 mb-1.5 text-sm leading-relaxed font-semibold">
      {children}
    </h3>
  )
}

function OrderedList({ items }: { items: string[] }) {
  return (
    <ol className="text-muted-foreground ml-6 list-decimal text-sm leading-relaxed">
      {items.map((item, index) => (
        <li key={index} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  )
}

const statusStyles = {
  viable: {
    label: 'Meta viável no prazo',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  needs_adjustment: {
    label: 'Ajuste necessário',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  unfeasible: {
    label: 'Meta inviável no prazo',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}

export function Content({ insight, simulationId }: ContentProps) {
  const { getFormData, updateSimulation } = useSimulationStorage()
  const simulation = getFormData(simulationId)

  const [messages, setMessages] = useState<Message[]>(simulation?.messages || [])
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isSending])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isSending || !simulation) return

    const userQuestion = inputValue.trim()
    setInputValue('')
    setErrorMessage(null)

    const updatedMessages: Message[] = [...messages, { role: 'user', text: userQuestion }]
    setMessages(updatedMessages)
    setIsSending(true)

    try {
      const contextSummary = `Meta: ${simulation.goalName}, Custo: ${simulation.goalAmount}, Prazo: ${simulation.goalDeadline} meses. Diagnóstico inicial: ${insight.diagnosis.content}`
      const answer = await askGeminiChat(contextSummary, userQuestion)

      const finalMessages: Message[] = [...updatedMessages, { role: 'model', text: answer }]
      setMessages(finalMessages)

      updateSimulation(simulationId, {
        ...simulation,
        messages: finalMessages,
      } as SimulationRecord)
    } catch {
      setErrorMessage('Erro ao obter resposta da IA. Tente novamente.')
    } finally {
      setIsSending(false)
    }
  }

  const status = statusStyles[insight.feasibility.status] ?? null

  return (
    <div className="flex flex-col h-[600px]">
      {/* Container com scroll contendo os insights e o chat */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto pr-2 lg:scrollbar-thin lg:[scrollbar-color:var(--border)_transparent]"
      >
        <section className="flex flex-col gap-2">
          <div className="flex flex-col items-start gap-2 sm:flex-row">
            <span className="text-foreground text-sm font-semibold">
              🎯 Viabilidade da Meta
            </span>
            {status && (
              <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
                {status.label}
              </span>
            )}
          </div>
          <Paragraph>{insight.feasibility.content}</Paragraph>
        </section>

        <section>
          <SectionTitle>💰 Diagnóstico Financeiro</SectionTitle>
          <Paragraph>{insight.diagnosis.content}</Paragraph>
        </section>

        <section>
          <SectionTitle>📋 Sugestões Práticas</SectionTitle>
          <OrderedList items={insight.suggestions.items} />
        </section>

        <section>
          <SectionTitle>💡 Como Aumentar sua Renda</SectionTitle>
          <OrderedList items={insight.extraIncome.items} />
        </section>

        <section>
          <SectionTitle>🏦 Sugestões de Investimento</SectionTitle>
          <OrderedList items={insight.investment.items} />
        </section>

        <section>
          <SectionTitle>🚀 Mensagem Final</SectionTitle>
          <Paragraph>{insight.motivation.content}</Paragraph>
        </section>

        {/* Histórico de Mensagens do Chat */}
        {messages.map((msg, index) => (
          <div key={index} className="mt-6 border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary text-sm">💬</span>
              <span className="text-foreground text-xs font-semibold uppercase tracking-wider">
                {msg.role === 'user' ? 'Você' : 'Resposta da IA'}
              </span>
            </div>
            {msg.role === 'user' ? (
              <Paragraph>{msg.text}</Paragraph>
            ) : (
              <FormattedMessage text={msg.text} />
            )}
          </div>
        ))}

        {/* Feedback de Carregamento (Loading) */}
        {isSending && (
          <div className="mt-6 border-t border-border pt-4 flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Educador financeiro está digitando a resposta...</span>
          </div>
        )}

        {/* Feedback de Erro */}
        {errorMessage && (
          <div className="mt-4 rounded-xl bg-red-100 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-400">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Campo de input fixo no rodapé do card */}
      <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-border flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Quais são os investimentos mais seguros que posso usar para que minha renda aumente?"
          className="flex-1 bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={isSending || !inputValue.trim()}
          className="bg-primary text-primary-foreground p-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer flex items-center justify-center shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
