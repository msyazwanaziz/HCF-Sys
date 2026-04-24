/**
 * My Family - Dashboard System
 * Core Application Logic
 */

// --- 1. Database (LocalStorage) ---
const DB_KEY = 'my_family_db';

const FamilyDB = {
    getData: () => {
        const data = localStorage.getItem(DB_KEY);
        if (!data) {
            return { members: [] };
        }
        return JSON.parse(data);
    },
    saveData: (data) => {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    },
    getMembers: () => {
        return FamilyDB.getData().members || [];
    },
    saveMember: (memberData) => {
        const data = FamilyDB.getData();
        if (memberData.id) {
            // Update
            const index = data.members.findIndex(m => m.id === memberData.id);
            if (index !== -1) {
                data.members[index] = memberData;
            }
        } else {
            // Add new
            memberData.id = 'mem_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
            data.members.push(memberData);
        }
        FamilyDB.saveData(data);
        return memberData;
    },
    deleteMember: (id) => {
        const data = FamilyDB.getData();
        data.members = data.members.filter(m => m.id !== id);
        // Also remove relationships
        data.members.forEach(m => {
            if (m.parents) m.parents = m.parents.filter(pid => pid !== id);
            if (m.spouse === id) m.spouse = '';
        });
        FamilyDB.saveData(data);
    }
};

// --- 2. App State & Core Logic ---
const App = {
    init: () => {
        lucide.createIcons();
        App.initTheme();
        App.initNavigation();
        App.initModal();
        App.loadDashboard();
        
        // Listeners for views
        document.getElementById('btn-add-member').addEventListener('click', App.openMemberModal);
        document.getElementById('search-members').addEventListener('input', (e) => App.renderMembers(e.target.value));

        // Global member events
        window.editMember = App.editMember;
        window.deleteMember = App.confirmDeleteMember;
    },

    // Theme Management
    initTheme: () => {
        const toggleBtn = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('family_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        toggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('family_theme', target);
        });
    },

    // Navigation Subsystem
    initNavigation: () => {
        const navItems = document.querySelectorAll('.nav-item');
        const views = document.querySelectorAll('.view');
        const pageTitle = document.getElementById('page-title');
        const btnAdd = document.getElementById('btn-add-member');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                
                // Update active states
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                views.forEach(view => view.classList.remove('active'));
                document.getElementById(`view-${page}`).classList.add('active');

                // Update Title and actions
                if (page === 'dashboard') {
                    pageTitle.textContent = 'Dashboard Overview';
                    btnAdd.style.display = 'none';
                    App.loadDashboard();
                } else if (page === 'members') {
                    pageTitle.textContent = 'Family Directory';
                    btnAdd.style.display = 'flex';
                    App.renderMembers();
                } else if (page === 'tree') {
                    pageTitle.textContent = 'Interactive Family Tree';
                    btnAdd.style.display = 'none';
                    App.renderTree();
                }
            });
        });
    },

    // --- 3. Dashboard Logic ---
    loadDashboard: () => {
        const members = FamilyDB.getMembers();
        const statsEl = document.getElementById('dashboard-stats');

        const totalMembers = members.length;
        const maleCount = members.filter(m => m.gender === 'M').length;
        const femaleCount = members.filter(m => m.gender === 'F').length;
        
        // Very basic generation estimation based on parent links
        let rootCount = members.filter(m => !m.parents || m.parents.length === 0).length;

        statsEl.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon"><i data-lucide="users"></i></div>
                <div class="stat-content">
                    <h3>Total Members</h3>
                    <p>${totalMembers}</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i data-lucide="user"></i></div>
                <div class="stat-content">
                    <h3>Demographics</h3>
                    <p style="font-size: 16px; margin-top: 5px;">${maleCount} Male / ${femaleCount} Female</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i data-lucide="git-branch"></i></div>
                <div class="stat-content">
                    <h3>Family Roots</h3>
                    <p>${rootCount}</p>
                </div>
            </div>
        `;

        // Load 4 latest
        const recent = [...members].sort((a,b) => {
            // we dont keep created_at yet, just reverse
            return -1;
        }).slice(0, 4);

        const recentGrid = document.getElementById('recent-members-grid');
        recentGrid.innerHTML = recent.map(m => App.createMemberCardHTML(m)).join('');
        lucide.createIcons();
    },

    // --- 4. Directory Logic ---
    renderMembers: (searchQuery = '') => {
        let members = FamilyDB.getMembers();
        if (searchQuery) {
            const lowerq = searchQuery.toLowerCase();
            members = members.filter(m => m.name.toLowerCase().includes(lowerq));
        }
        const grid = document.getElementById('members-list-grid');
        if (members.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">No family members found.</div>`;
            return;
        }
        grid.innerHTML = members.map(m => App.createMemberCardHTML(m, true)).join('');
        lucide.createIcons();
    },

    createMemberCardHTML: (m, showActions = false) => {
        const getAge = (dob) => {
            if (!dob) return '';
            const diff = Date.now() - new Date(dob).getTime();
            const ageDate = new Date(diff);
            return Math.abs(ageDate.getUTCFullYear() - 1970) + ' yrs';
        };

        const ageStr = getAge(m.dob);
        const imgHtml = m.picture 
            ? `<img src="${m.picture}" alt="${m.name}">` 
            : `<i data-lucide="user"></i>`;

        let actionHtml = '';
        if (showActions) {
            actionHtml = `
                <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 8px;">
                    <button class="btn-icon" style="width: 30px; height: 30px; background: var(--bg-primary);" onclick="editMember('${m.id}')" title="Edit">
                        <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
                    </button>
                    <button class="btn-icon" style="width: 30px; height: 30px; background: rgba(239, 68, 68, 0.1); color: #ef4444;" onclick="deleteMember('${m.id}')" title="Delete">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                </div>
            `;
        }

        return `
            <div class="member-card">
                ${actionHtml}
                <div class="member-banner" style="background: ${m.gender === 'F' ? 'linear-gradient(135deg, var(--bg-primary), #ec4899)' : 'linear-gradient(135deg, var(--bg-primary), var(--accent))'};"></div>
                <div class="member-avatar-wrapper">
                    ${imgHtml}
                </div>
                <div class="member-info">
                    <div class="member-name">${m.name}</div>
                    <div class="member-meta">
                        <span class="badge" style="background: ${m.status === 'alive' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.2)'}; color: ${m.status === 'alive' ? '#10b981' : '#6b7280'};">
                            ${m.status || 'Alive'}
                        </span>
                        ${ageStr ? `<span>• ${ageStr}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    confirmDeleteMember: (id) => {
        if (confirm("Are you sure you want to delete this family member?")) {
            FamilyDB.deleteMember(id);
            App.renderMembers();
            App.loadDashboard();
        }
    },

    // --- 5. Modal & Form Logic ---
    initModal: () => {
        const modal = document.getElementById('member-modal');
        const btnClose = document.getElementById('close-modal');
        const btnCancel = document.getElementById('cancel-modal');
        const form = document.getElementById('member-form');
        const picInput = document.getElementById('member-picture');

        const closeModal = () => modal.classList.remove('active');
        btnClose.addEventListener('click', closeModal);
        btnCancel.addEventListener('click', closeModal);

        picInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    document.getElementById('picture-preview-img').src = evt.target.result;
                    document.getElementById('picture-preview-img').style.display = 'block';
                    document.getElementById('member-picture-data').value = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get multiple parents
            const parentSelect = document.getElementById('member-parents');
            const parents = Array.from(parentSelect.selectedOptions).map(opt => opt.value).filter(val => val !== "");

            const memberData = {
                id: document.getElementById('member-id').value,
                name: document.getElementById('member-name').value,
                gender: document.getElementById('member-gender').value,
                dob: document.getElementById('member-dob').value,
                status: document.getElementById('member-status').value,
                bio: document.getElementById('member-bio').value,
                picture: document.getElementById('member-picture-data').value,
                parents: parents,
                spouse: document.getElementById('member-spouse').value
            };

            FamilyDB.saveMember(memberData);
            closeModal();
            
            // Refresh Active View
            const activePage = document.querySelector('.nav-item.active').getAttribute('data-page');
            if (activePage === 'dashboard') App.loadDashboard();
            if (activePage === 'members') App.renderMembers(document.getElementById('search-members').value);
            if (activePage === 'tree') App.renderTree();
        });
    },

    populateRelationshipSelects: (currentId = null) => {
        const members = FamilyDB.getMembers();
        const parentSelect = document.getElementById('member-parents');
        const spouseSelect = document.getElementById('member-spouse');
        
        let optionsHtml = '';
        members.forEach(m => {
            if (m.id !== currentId) {
                optionsHtml += `<option value="${m.id}">${m.name} (${m.gender})</option>`;
            }
        });

        parentSelect.innerHTML = optionsHtml;
        spouseSelect.innerHTML = `<option value="">None</option>` + optionsHtml;
    },

    openMemberModal: () => {
        document.getElementById('member-form').reset();
        document.getElementById('member-id').value = '';
        document.getElementById('picture-preview-img').style.display = 'none';
        document.getElementById('member-picture-data').value = '';
        document.getElementById('modal-title').textContent = 'Add Family Member';
        
        App.populateRelationshipSelects();
        document.getElementById('member-modal').classList.add('active');
    },

    editMember: (id) => {
        const members = FamilyDB.getMembers();
        const m = members.find(x => x.id === id);
        if (!m) return;

        App.openMemberModal();
        document.getElementById('modal-title').textContent = 'Edit Family Member';
        
        document.getElementById('member-id').value = m.id;
        document.getElementById('member-name').value = m.name;
        document.getElementById('member-gender').value = m.gender;
        document.getElementById('member-dob').value = m.dob || '';
        document.getElementById('member-status').value = m.status || 'alive';
        document.getElementById('member-bio').value = m.bio || '';
        
        if (m.picture) {
            document.getElementById('picture-preview-img').src = m.picture;
            document.getElementById('picture-preview-img').style.display = 'block';
            document.getElementById('member-picture-data').value = m.picture;
        }

        App.populateRelationshipSelects(m.id);
        
        // Select parents
        if (m.parents && m.parents.length > 0) {
            const pSelect = document.getElementById('member-parents');
            Array.from(pSelect.options).forEach(opt => {
                if(m.parents.includes(opt.value)) opt.selected = true;
            });
        }
        
        // Select spouse
        if (m.spouse) {
            document.getElementById('member-spouse').value = m.spouse;
        }
    },

    // --- 6. Tree View Logic ---
    renderTree: () => {
        const members = FamilyDB.getMembers();
        const container = document.getElementById('family-tree-container');
        
        if (members.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding-top: 100px; color: var(--text-secondary);">No family members to display. Go to Directory to add some!</div>`;
            return;
        }

        // We will build a simple D3-like flex box tree.
        // Step 1: Find roots (individuals without parents)
        let roots = members.filter(m => !m.parents || m.parents.length === 0);
        
        // If no strict root, pick the first one as root
        if(roots.length === 0 && members.length > 0) {
            roots = [members[0]];
        }

        container.innerHTML = `<div class="tree-canvas" id="tree-canvas" style="transform: translate(-50%, 0) scale(1);">
            <div style="display:flex; justify-content:center; gap: 80px;">
                ${roots.map(root => App.buildTreeNode(root, members)).join('')}
            </div>
        </div>`;

        lucide.createIcons();
        App.initTreeZoomAndPan();
    },

    buildTreeNode: (member, allMembers) => {
        // Find children
        const children = allMembers.filter(m => m.parents && m.parents.includes(member.id));
        
        // Find Spouse
        let spouseHtml = '';
        if (member.spouse) {
            const spouse = allMembers.find(m => m.id === member.spouse);
            if (spouse) {
                const img = spouse.picture ? `<img src="${spouse.picture}">` : `<i data-lucide="heart" style="width: 20px; height: 20px; color: #ef4444; margin-top: 15px;"></i>`;
                spouseHtml = `
                    <div class="tree-node" style="border-color: #ec4899;">
                        <div class="tree-node-avatar">${img}</div>
                        <div class="tree-node-name">${spouse.name}</div>
                        <div class="tree-node-dates" style="color: #ec4899; font-weight: 600;">Spouse</div>
                    </div>
                `;
            }
        }

        const memberImg = member.picture ? `<img src="${member.picture}">` : `<i data-lucide="user" style="width: 24px; height: 24px; color:var(--text-secondary); margin-top: 12px;"></i>`;
        
        let childrenHtml = '';
        if (children.length > 0) {
            childrenHtml = `
                <div class="tree-level">
                    ${children.map(child => App.buildTreeNode(child, allMembers)).join('')}
                </div>
            `;
        }

        return `
            <div class="tree-node-wrapper">
                <div style="display: flex; gap: 20px; margin-bottom: ${children.length > 0 ? '60px' : '20px'}; position: relative; z-index: 10;">
                    <div class="tree-node" onclick="App.showMemberInfo('${member.id}')">
                        <div class="tree-node-avatar">${memberImg}</div>
                        <div class="tree-node-name">${member.name}</div>
                        <div class="tree-node-dates">${member.dob ? new Date(member.dob).getFullYear() : 'Unknown'} - ${member.status==='deceased' ? 'Deceased' : 'Present'}</div>
                    </div>
                    ${spouseHtml}
                    ${spouseHtml ? '<div style="position: absolute; top:50%; left:160px; width:20px; height:2px; background:var(--accent);"></div>' : ''}
                </div>
                ${childrenHtml}
            </div>
        `;
    },

    showMemberInfo: (id) => {
        // Just jump to directory and search
        document.querySelector('[data-page="members"]').click();
        document.getElementById('search-members').value = FamilyDB.getMembers().find(m => m.id === id)?.name || '';
        App.renderMembers(document.getElementById('search-members').value);
    },

    // Tree Pan and Zoom
    initTreeZoomAndPan: () => {
        const container = document.getElementById('family-tree-container');
        const canvas = document.getElementById('tree-canvas');
        if (!canvas) return;

        let scale = 1;
        let isDragging = false;
        let startX, startY;
        let translateX = -50; // Use percentage for centering horizontally
        let translateY = 40; // Initial top offset

        // Setup init transform
        canvas.style.transform = `translate(calc(${translateX}% + 0px), ${translateY}px) scale(${scale})`;
        let absX = 0; // absolute px drag offset

        const updateTransform = () => {
             canvas.style.transform = `translate(calc(-50% + ${absX}px), ${translateY}px) scale(${scale})`;
        };

        // Zoom Controls
        document.getElementById('zoom-in').onclick = () => { scale += 0.1; updateTransform(); };
        document.getElementById('zoom-out').onclick = () => { scale = Math.max(0.2, scale - 0.1); updateTransform(); };
        document.getElementById('reset-zoom').onclick = () => { scale = 1; absX = 0; translateY = 40; updateTransform(); };

        // Mouse Drag
        container.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.clientX - absX;
            startY = e.clientY - translateY;
        });

        window.addEventListener('mousemove', e => {
            if (!isDragging) return;
            absX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Initial setup
        updateTransform();
    }
};

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', App.init);
