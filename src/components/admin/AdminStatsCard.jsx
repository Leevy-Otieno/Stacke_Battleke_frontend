const AdminStatsCard = ({ title, value, icon, trend, trendNegative = false }) => (
  <div style={{
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px', padding: '1.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.75rem',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <p style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </p>
      <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: '7px', color: '#10B981' }}>
        {icon}
      </div>
    </div>

    <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
      {value ?? '—'}
    </h3>

    {trend && (
      <p style={{ fontSize: '0.78rem', fontWeight: '500', color: trendNegative ? '#EF4444' : '#10B981' }}>
        {trend}
      </p>
    )}
  </div>
);

export default AdminStatsCard;