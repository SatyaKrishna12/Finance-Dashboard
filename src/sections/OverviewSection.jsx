import SummaryCard from '../components/SummaryCard'
import BalanceTrendChart from '../components/BalanceTrendChart'
import SpendingDonut from '../components/SpendingDonut'

function OverviewSection({ summaryCards, balanceTrend, spendingBreakdown, id = 'overview' }) {
  return (
    <section className="grid gap-5 scroll-mt-4" id={id}>
      <div className="grid gap-4 grid-cols-3 max-[1120px]:grid-cols-2 max-[720px]:grid-cols-1">
        {summaryCards.map((item, index) => (
          <SummaryCard key={item.title} {...item} delay={index * 0.08} />
        ))}
      </div>

      <div className="grid gap-4 [grid-template-columns:1.55fr_1fr] max-[1120px]:grid-cols-1">
        <BalanceTrendChart data={balanceTrend} />
        <SpendingDonut data={spendingBreakdown} />
      </div>
    </section>
  )
}

export default OverviewSection
