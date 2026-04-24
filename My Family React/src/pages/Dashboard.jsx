import React, { useEffect, useState } from 'react';
import { Users, User, GitBranch } from 'lucide-react';
import { FamilyDB } from '../db';
import { useLanguage } from '../i18n';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0, roots: 0 });
  const [recent, setRecent] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const members = FamilyDB.getMembers();
    setStats({
      total: members.length,
      male: members.filter(m => m.gender === 'M').length,
      female: members.filter(m => m.gender === 'F').length,
      roots: members.filter(m => !m.parents || m.parents.length === 0).length
    });
    setRecent([...members].reverse().slice(0, 4));
  }, []);

  const getAge = (dob) => {
    if (!dob) return '';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970) + ' yrs';
  };

  return (
    <div className="view active">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users /></div>
          <div className="stat-content">
            <h3>{t('totalMembers')}</h3>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><User /></div>
          <div className="stat-content">
            <h3>{t('demographics')}</h3>
            <p style={{ fontSize: '16px', marginTop: '5px' }}>{stats.male} {t('male')} / {stats.female} {t('female')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><GitBranch /></div>
          <div className="stat-content">
            <h3>{t('roots')}</h3>
            <p>{stats.roots}</p>
          </div>
        </div>
      </div>

      <div className="recent-members-section">
        <h2 style={{ marginBottom: '24px' }}>{t('recentlyAdded')}</h2>
        <div className="recent-grid">
          {recent.map(m => (
            <div key={m.id} className="member-card">
              <div className="member-banner" style={{ background: m.gender === 'F' ? 'linear-gradient(135deg, var(--bg-primary), #ec4899)' : 'linear-gradient(135deg, var(--bg-primary), var(--accent))' }}></div>
              <div className="member-avatar-wrapper">
                {m.picture ? <img src={m.picture} alt={m.name} /> : <User size={32} />}
              </div>
              <div className="member-info">
                <div className="member-name">{m.name}</div>
                <div className="member-meta">
                  <span className="badge" style={{ background: m.status === 'alive' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.2)', color: m.status === 'alive' ? '#10b981' : '#6b7280' }}>
                    {m.status === 'alive' ? t('alive') : t('deceased')}
                  </span>
                  {m.dob && <span>• {getAge(m.dob)}</span>}
                </div>
              </div>
            </div>
          ))}
          {recent.length === 0 && (
            <div style={{ color: 'var(--text-secondary)' }}>{t('noMembers')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
