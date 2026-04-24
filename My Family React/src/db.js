import { sampleMembers } from './sampleData';

const DB_KEY = 'my_family_db_react_v4';

export const FamilyDB = {
    getData: () => {
        const data = localStorage.getItem(DB_KEY);
        if (!data) {
            const initialData = { members: sampleMembers };
            localStorage.setItem(DB_KEY, JSON.stringify(initialData));
            return initialData;
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
        // Clean relationships
        data.members.forEach(m => {
            if (m.parents) m.parents = m.parents.filter(pid => pid !== id);
            if (m.spouse === id) m.spouse = '';
        });
        FamilyDB.saveData(data);
    }
};
