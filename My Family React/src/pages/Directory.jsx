import React, { useState, useEffect } from 'react';
import { Search, User, Edit2, Trash2, X, Camera } from 'lucide-react';
import { FamilyDB } from '../db';
import { useLanguage } from '../i18n';

export default function Directory() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    id: '', name: '', gender: 'M', dob: '', status: 'alive', bio: '', picture: '', parents: [], spouse: ''
  });

  const loadMembers = () => setMembers(FamilyDB.getMembers());
  useEffect(() => loadMembers(), []);

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (id) => {
    const m = members.find(x => x.id === id);
    if (m) {
      setFormData({
        id: m.id, name: m.name, gender: m.gender, dob: m.dob || '', status: m.status || 'alive', 
        bio: m.bio || '', picture: m.picture || '', parents: m.parents || [], spouse: m.spouse || ''
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(t('confirmDelete'))) {
      FamilyDB.deleteMember(id);
      loadMembers();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setFormData(prev => ({ ...prev, picture: evt.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    FamilyDB.saveMember(formData);
    setIsModalOpen(false);
    loadMembers();
  };

  const getAge = (dob) => {
    if (!dob) return '';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970) + ' yrs';
  };

  const openNewModal = () => {
    setFormData({ id: '', name: '', gender: 'M', dob: '', status: 'alive', bio: '', picture: '', parents: [], spouse: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="view active">
      <button className="btn-primary" style={{ position: 'fixed', top: '15px', right: '32px', zIndex: 10 }} onClick={openNewModal}>
        {t('addMember')}
      </button>

      <div className="search-bar">
        <Search />
        <input 
          type="text" 
          placeholder={t('search')} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="members-grid">
        {filteredMembers.map(m => (
          <div key={m.id} className="member-card">
            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px', zIndex: 5 }}>
              <button className="btn-icon" style={{ width: '30px', height: '30px', background: 'var(--bg-primary)' }} onClick={() => handleEdit(m.id)}>
                <Edit2 size={14} />
              </button>
              <button className="btn-icon" style={{ width: '30px', height: '30px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }} onClick={() => handleDelete(m.id)}>
                <Trash2 size={14} />
              </button>
            </div>
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
        {filteredMembers.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
            {t('noMembers')}
          </div>
        )}
      </div>

      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>{formData.id ? t('editFamilyMember') : t('addFamilyMember')}</h2>
            <button className="btn-close" onClick={() => setIsModalOpen(false)}><X /></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group picture-upload">
                <label className="picture-preview">
                  {formData.picture ? (
                    <img src={formData.picture} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <Camera size={24} style={{ marginBottom: '8px' }} />
                      <span>{t('uploadPhoto')}</span>
                    </>
                  )}
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('fullName')}</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('gender')}</label>
                  <select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="M">{t('male')}</option>
                    <option value="F">{t('female')}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('dob')}</label>
                  <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('status')}</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="alive">{t('alive')}</option>
                    <option value="deceased">{t('deceased')}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{t('bio')}</label>
                <textarea rows="3" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}></textarea>
              </div>

              <h3 className="section-title">{t('relationships')}</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{t('selectParents')}</label>
                  <select 
                    multiple 
                    value={formData.parents} 
                    onChange={e => {
                      const options = Array.from(e.target.selectedOptions).map(o => o.value);
                      setFormData({...formData, parents: options});
                    }}
                    style={{ height: '100px' }}
                  >
                    {members.filter(m => m.id !== formData.id).map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.gender === 'M' ? t('male') : t('female')})</option>
                    ))}
                  </select>
                  <small style={{ color: 'var(--text-secondary)' }}>{t('holdCtrl')}</small>
                </div>
                <div className="form-group">
                  <label>{t('selectSpouse')}</label>
                  <select value={formData.spouse} onChange={e => setFormData({...formData, spouse: e.target.value})}>
                    <option value="">{t('none')}</option>
                    {members.filter(m => m.id !== formData.id).map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.gender === 'M' ? t('male') : t('female')})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>{t('cancel')}</button>
                <button type="submit" className="btn-primary">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
