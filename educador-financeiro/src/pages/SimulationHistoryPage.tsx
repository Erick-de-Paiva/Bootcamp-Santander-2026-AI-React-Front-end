import { Trash2, ExternalLink, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

export function SimulationHistoryPage() {
  const navigate = useNavigate()
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState(() => getAllSimulations())

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteSimulation(id)
    setSimulations(getAllSimulations())
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros."
      />

      {simulations.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma simulação encontrada. Crie uma nova simulação para começar!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {simulations.map((sim) => {
            const monthlySavings = calcMonthlySavings(sim)
            const formattedDate = new Date().toLocaleDateString('pt-BR')

            return (
              <div
                key={sim.id}
                onClick={() => navigate(`/resultado/${sim.id}`)}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md cursor-pointer"
              >
                {/* Ícone e Título */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted-primary/20 text-primary">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {sim.goalName}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Métricas (Custo, Prazo, Economia) */}
                <div className="grid grid-cols-3 gap-6 w-full md:w-auto text-left md:text-center border-t md:border-t-0 pt-4 md:pt-0 border-border">
                  <div>
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Custo da Meta
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {sim.goalAmount}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Prazo
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {sim.goalDeadline} meses
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Economia Mensal
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      R$ {monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Ações (Excluir e Ver detalhes) */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-border">
                  <button
                    onClick={(e) => handleDelete(sim.id, e)}
                    title="Excluir simulação"
                    className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/resultado/${sim.id}`)}
                    className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary-button transition-colors"
                  >
                    <span>Ver detalhes</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
