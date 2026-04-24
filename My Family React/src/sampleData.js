const maleNames = ["Ahmad", "Muhammad", "Hafiz", "Zainal", "Amir", "Syed", "Luqman", "Faris", "Adam", "Hakim", "Zaqwan", "Irfan", "Khairul", "Tariq", "Imran", "Razi", "Harith", "Yusof", "Firdaus", "Izzat"];
const femaleNames = ["Fatimah", "Aisyah", "Siti", "Nurul", "Nadia", "Dania", "Zulaikha", "Hana", "Sara", "Amina", "Safiya", "Yasmin", "Maya", "Laila", "Nabila", "Dira", "Alia", "Husna", "Safiah", "Zahirah"];

const getRandomName = (gender) => {
  const arr = gender === "M" ? maleNames : femaleNames;
  return arr[Math.floor(Math.random() * arr.length)];
};

export const sampleMembers = (() => {
  const members = [];
  let idCounter = 1;
  const genId = () => `mem_${idCounter++}`;

  const add = (name, gender, dob, params = {}) => {
    const isElder = parseInt(dob.split('-')[0]) < 1970;
    const type = isElder ? 'elder' : 'young';
    const m = {
      id: genId(),
      name,
      gender,
      dob,
      status: params.status || 'alive',
      bio: params.bio || '',
      picture: `/images/${type}_${gender === 'M' ? 'man' : 'woman'}.png`,
      parents: params.parents || [],
      spouse: params.spouse || ''
    };
    members.push(m);
    return m;
  };

  // --- GENERATION 1 ---
  const pat = add("Datuk Haji Rahman bin Othman", "M", "1940-02-14", { bio: "Patriarch of the family, a respected teacher.", status: "deceased" });
  const mat = add("Datin Hajah Aminah binti Salleh", "F", "1943-07-22", { bio: "Matriarch of the family, known for her kindness.", status: "deceased", spouse: pat.id });
  pat.spouse = mat.id;

  // --- GENERATION 2 ---
  // 11 children: 1st M, 2nd F, 3rd F, 4th M, 5th M, 6th M, 7th M, 8th F, 9th F, 10th F, 11th F.
  const gen2Genders = ["M", "F", "F", "M", "M", "M", "M", "F", "F", "F", "F"];
  const gen2 = [];
  
  gen2Genders.forEach((g, idx) => {
    const n = getRandomName(g);
    const childName = g === "M" ? `${n} bin Rahman` : `${n} binti Rahman`;
    const child = add(childName, g, `196${Math.floor(idx/2)}-0${(idx%9)+1}-15`, { parents: [pat.id, mat.id] });
    
    // Create spouse for gen 2
    const spouseGender = g === "M" ? "F" : "M";
    const sn = getRandomName(spouseGender);
    const spouseLastName = spouseGender === "M" ? "bin Mahmud" : "binti Kamal";
    const spouse = add(`${sn} ${spouseLastName}`, spouseGender, `196${Math.floor(idx/2)+1}-05-05`, { spouse: child.id });
    child.spouse = spouse.id;

    gen2.push(child);
  });

  // --- GENERATION 3 ---
  // Each of the 11 children has exactly 5 children
  const gen3 = [];
  gen2.forEach((g2) => {
    const familyName = g2.gender === "M" ? g2.name.split(" ")[0] : (members.find(m => m.id === g2.spouse) || {}).name.split(" ")[0];
    
    for(let i=0; i<5; i++) {
      const g = Math.random() > 0.5 ? "M" : "F";
      const cn = getRandomName(g);
      const childName = g === "M" ? `${cn} bin ${familyName}` : `${cn} binti ${familyName}`;
      const child = add(childName, g, `198${5+Math.floor(i/2)}-01-01`, { parents: [g2.id, g2.spouse] });
      gen3.push(child);
    }
  });

  // --- GENERATION 4 ---
  // Each children at least 1/3 married and at least 1 child
  // Iterate gen3, about 35% chance to marry and have 1 child
  gen3.forEach(g3 => {
    if (Math.random() < 0.35) { // approx 1/3 married
        const spouseGender = g3.gender === "M" ? "F" : "M";
        const sn = getRandomName(spouseGender);
        const spouse = add(sn, spouseGender, `1990-06-10`, { spouse: g3.id });
        g3.spouse = spouse.id;

        // Have 1 child
        const childGender = Math.random() > 0.5 ? "M" : "F";
        const cn = getRandomName(childGender);
        const familyName = g3.gender === "M" ? g3.name.split(" ")[0] : spouse.name.split(" ")[0];
        const childName = childGender === "M" ? `${cn} bin ${familyName}` : `${cn} binti ${familyName}`;
        add(childName, childGender, `2015-08-08`, { parents: [g3.id, spouse.id] });
    }
  });

  return members;
})();
