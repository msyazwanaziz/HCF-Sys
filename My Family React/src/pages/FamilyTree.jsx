import React, { useEffect, useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize, User, Heart, PlusCircle, MinusCircle } from 'lucide-react';
import { FamilyDB } from '../db';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';

export default function FamilyTree() {
  const [members, setMembers] = useState([]);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: -50, y: 40 }); 
  const [absX, setAbsX] = useState(0); 
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [collapsedNodes, setCollapsedNodes] = useState({});

  const toggleCollapse = (e, id) => {
    e.stopPropagation();
    setCollapsedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    setMembers(FamilyDB.getMembers());
  }, []);

  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startPos.current = {
      x: e.clientX - absX,
      y: e.clientY - translate.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    setAbsX(e.clientX - startPos.current.x);
    setTranslate(prev => ({ ...prev, y: e.clientY - startPos.current.y }));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const buildTree = (member) => {
    const children = members.filter(m => m.parents && m.parents.includes(member.id));
    const spouse = member.spouse ? members.find(m => m.id === member.spouse) : null;

    return (
      <div key={member.id} className="tree-node-wrapper">
        <div style={{ display: 'flex', gap: '20px', marginBottom: children.length > 0 ? '60px' : '20px', position: 'relative', zIndex: 10 }}>
          
          <div className="tree-node" onClick={() => navigate('/directory')}>
            <div className="tree-node-avatar">
              {member.picture ? <img src={member.picture} alt={member.name} /> : <User size={24} style={{ color: 'var(--text-secondary)' }} />}
            </div>
            <div className="tree-node-name">{member.name}</div>
            <div className="tree-node-dates">
              {member.dob ? new Date(member.dob).getFullYear() : t('unknown')} - {member.status === 'deceased' ? t('deceased') : t('present')}
            </div>
          </div>

          {spouse && (
            <>
              <div style={{ position: 'absolute', top: '50%', left: '160px', width: '20px', height: '2px', background: 'var(--accent)' }}></div>
              <div className="tree-node" style={{ borderColor: '#ec4899', zIndex: 10 }}>
                <div className="tree-node-avatar">
                  {spouse.picture ? <img src={spouse.picture} alt={spouse.name} /> : <Heart size={20} color="#ef4444" />}
                </div>
                <div className="tree-node-name">{spouse.name}</div>
                <div className="tree-node-dates" style={{ color: '#ec4899', fontWeight: 600 }}>{t('spouse')}</div>
              </div>
            </>
          )}
          
          {/* Downward stalk to children */}
          {children.length > 0 && (
            <div style={{ position: 'absolute', bottom: '-40px', left: spouse ? '170px' : '50%', width: '2px', height: '40px', background: 'var(--border-color)', zIndex: 0 }}>
              <button 
                onClick={(e) => toggleCollapse(e, member.id)}
                style={{ 
                  position: 'absolute', 
                  bottom: '0', 
                  left: '50%', 
                  transform: 'translate(-50%, 50%)', 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '50%', 
                  cursor: 'pointer', 
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  color: 'var(--accent)'
                }}
                title={collapsedNodes[member.id] ? "Expand Branch" : "Collapse Branch"}
              >
                {collapsedNodes[member.id] ? <PlusCircle size={20} /> : <MinusCircle size={20} />}
              </button>
            </div>
          )}

        </div>

        {children.length > 0 && !collapsedNodes[member.id] && (
          <div className="tree-level">
            {children.map(child => buildTree(child))}
          </div>
        )}
      </div>
    );
  };

  let rawRoots = members.filter(m => !m.parents || m.parents.length === 0);
  let roots = [];
  rawRoots.forEach(r => {
    // Prevent duplicate roots if mutually spouses
    if (!roots.find(existing => existing.spouse === r.id)) {
      roots.push(r);
    }
  });

  if (roots.length === 0 && members.length > 0) {
    roots = [members[0]]; 
  }

  return (
    <div className="view active" style={{ height: '100%', overflow: 'hidden' }}>
      <div className="tree-controls">
        <button className="btn-icon" onClick={() => setScale(s => s + 0.1)}><ZoomIn size={18} /></button>
        <button className="btn-icon" onClick={() => setScale(s => Math.max(0.2, s - 0.1))}><ZoomOut size={18} /></button>
        <button className="btn-icon" onClick={() => { setScale(1); setAbsX(0); setTranslate({x: -50, y: 40}); }}><Maximize size={18} /></button>
      </div>

      <div 
        className="tree-container" 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {members.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '100px', color: 'var(--text-secondary)' }}>
            {t('noTreeData')}
          </div>
        ) : (
          <div 
            className="tree-canvas"
            style={{ 
              transform: `translate(calc(${translate.x}% + ${absX}px), ${translate.y}px) scale(${scale})`,
              transition: isDragging.current ? 'none' : 'transform 0.1s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: '80px' }}>
              {roots.map(root => buildTree(root))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
