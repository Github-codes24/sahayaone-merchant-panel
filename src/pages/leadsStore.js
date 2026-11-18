export const leadsData = [
  {
    id: 1,
    clientId: 2,
    applicationNumber: "LN1234567890",
    customerName: "Yash Godbole",
    phone: "9876543210",
    address: "Yash Nivas 369,Manewada Road,Nagpur-440034",
    status: "New",
    region: "South Region",
    branch: "Nagpur Branch",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", // Purple-ish tinted portrait
    initials: "YG"
  },
  {
    id: 2,
    clientId: 3,
    applicationNumber: "LN1234567890",
    customerName: "Harsh Wankhede",
    phone: "9876543210",
    address: "4517 Washington Ave. Manchester, Kentucky 39495",
    status: "Active",
    region: "Western Region",
    branch: "Nagpur Branch",
    avatar: null,
    initials: "TS"
  },
  {
    id: 3,
    clientId: 4,
    applicationNumber: "LN1234567890",
    customerName: "Ayush Thakare",
    phone: "9876543210",
    address: "3891 Ranchview Dr. Richardson, California 62639",
    status: "Completed",
    region: "Northern Region",
    branch: "Kolkata Branch",
    avatar: null,
    initials: "BW"
  },
  {
    id: 4,
    clientId: 5,
    applicationNumber: "LN1234567890",
    customerName: "Jeet Narvariya",
    phone: "9876543210",
    address: "Shivay Garage Rd. Manewada,Besa, Dadar 31134",
    status: "Rejected",
    region: "Eastern Region",
    branch: "Mumbai Branch",
    avatar: null,
    initials: "BA"
  },
  {
    id: 5,
    clientId: 6,
    applicationNumber: "LN1234567890",
    customerName: "Vansh Khamele",
    phone: "9876543210",
    address: "8502 Preston Rd. Inglewood, Maine 43805",
    status: "Active",
    region: "Western Region",
    branch: "Nagpur Branch",
    avatar: null,
    initials: "SR"
  },
  {
    id: 6,
    clientId: 8,
    applicationNumber: "LN1234567890",
    customerName: "Rajesh Khandelwal",
    phone: "9876543210",
    address: "8502 Preston Rd. Inglewood, Maine 43805",
    status: "New",
    region: "Northern Region",
    branch: "Kolkata Branch",
    avatar: null,
    initials: "SL"
  },
  {
    id: 7,
    clientId: 8,
    applicationNumber: "LN1234567890",
    customerName: "Pankaj Shukla",
    phone: "9876543210",
    address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
    status: "New",
    region: "Eastern Region",
    branch: "Mumbai Branch",
    avatar: null,
    initials: "SL"
  },
  {
    id: 8,
    clientId: 9,
    applicationNumber: "LN1234567890",
    customerName: "Faizan ansari",
    phone: "9876543210",
    address: "6391 Elgin St. Celina, Delaware 10299",
    status: "Completed",
    region: "Western Region",
    branch: "Nagpur Branch",
    avatar: null,
    initials: "PP"
  }
];

let _leads = [...leadsData];
let _nextId = 9;

export function getLeads() {
  return _leads;
}

export function addLead(data) {
  const newLead = { id: _nextId++, ...data };
  _leads = [newLead, ..._leads];
  return newLead;
}

export function updateLead(id, data) {
  _leads = _leads.map((l) => (l.id === Number(id) ? { ...l, ...data } : l));
}

export function deleteLead(id) {
  _leads = _leads.filter((l) => l.id !== Number(id));
}
