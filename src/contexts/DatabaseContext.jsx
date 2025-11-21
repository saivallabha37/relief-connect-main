import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const DatabaseContext = createContext();

export const useDatabase = () => useContext(DatabaseContext);

// This is our initial fake database data.
const initialSampleAlerts = [
  {
    id: 1,
    title: 'Cyclone Michaung - Hyderabad Alert',
    description: 'Severe cyclone approaching Hyderabad. Heavy rainfall and strong winds expected. Immediate evacuation required for low-lying areas.',
    severity: 'critical',
    location: 'Hyderabad, Telangana',
    alert_type: 'weather',
    source: 'Telangana State Emergency Management',
    lat: 17.3850,
    lng: 78.4867,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    active: true,
    status: 'In-Progress',
    volunteers_needed: 25,
    volunteers_assigned: 18
  },
  {
    id: 2,
    title: 'Flash Flood - Kukatpally Housing Board',
    description: 'Urgent help needed for 50 families trapped in flooded apartments. Rescue boats and medical aid required immediately.',
    severity: 'critical',
    location: 'Kukatpally, Hyderabad',
    alert_type: 'flood',
    source: 'GHMC Emergency Response',
    lat: 17.4851,
    lng: 78.4110,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    active: true,
    status: 'Pending',
    volunteers_needed: 15,
    volunteers_assigned: 8
  },
  {
    id: 3,
    title: 'Emergency Shelter - Gachibowli',
    description: 'Temporary shelter established for displaced families. Need volunteers for food distribution and medical assistance.',
    severity: 'high',
    location: 'Gachibowli, Hyderabad',
    alert_type: 'relief',
    source: 'Red Cross Hyderabad',
    lat: 17.4400,
    lng: 78.3489,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    active: true,
    status: 'In-Progress',
    volunteers_needed: 20,
    volunteers_assigned: 20
  },
  {
    id: 4,
    title: 'Medical Emergency - HITEC City',
    description: 'Power outage at local hospital. Backup generators needed urgently. Patients need immediate evacuation assistance.',
    severity: 'critical',
    location: 'HITEC City, Hyderabad',
    alert_type: 'medical',
    source: 'Apollo Hospital Emergency',
    lat: 17.4435,
    lng: 78.3772,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    active: true,
    status: 'Completed',
    volunteers_needed: 10,
    volunteers_assigned: 12
  },
  {
    id: 5,
    title: 'Urban Flooding and Road Closures',
    description: 'Heavy overnight rains have caused flooding in low-lying areas and major arterial roads. Commuters should avoid vulnerable routes.',
    severity: 'high',
    location: 'Hyderabad (GHMC area)',
    alert_type: 'flood',
    source: 'Greater Hyderabad Municipal Corporation (GHMC)',
    lat: 17.385044,
    lng: 78.486671,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    active: true,
  },
  {
    id: 6,
    title: 'Coastal Evacuation Advisory',
    description: 'High tidal surges expected along the coastline. Coastal residents should move to temporary shelters until the advisory is lifted.',
    severity: 'critical',
    location: 'Chennai Coastline',
    alert_type: 'storm_surge',
    source: 'IMD / Local Authorities',
    lat: 13.082680,
    lng: 80.270721,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    active: true,
  }
];

// Sample volunteers data
const initialVolunteers = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 9876543210',
    skills: ['Medical Care', 'Emergency Response'],
    experience: '5+ years emergency medicine',
    location: 'Banjara Hills, Hyderabad',
    availability: 'Available Now',
    rating: 4.9,
    completed_missions: 23,
    badge: 'Gold Volunteer',
    joined: '2023-01-15',
    lat: 17.4126,
    lng: 78.4482
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    email: 'rajesh.k.volunteer@gmail.com',
    phone: '+91 8765432109',
    skills: ['Search & Rescue', 'Logistics'],
    experience: '3 years disaster relief',
    location: 'Jubilee Hills, Hyderabad',
    availability: 'Available Now',
    rating: 4.7,
    completed_missions: 15,
    badge: 'Silver Volunteer',
    joined: '2023-06-10',
    lat: 17.4239,
    lng: 78.4084
  },
  {
    id: 3,
    name: 'Anita Reddy',
    email: 'anita.reddy.help@gmail.com',
    phone: '+91 7654321098',
    skills: ['Food Distribution', 'Child Care'],
    experience: '2 years community service',
    location: 'Gachibowli, Hyderabad',
    availability: 'Off Duty',
    rating: 4.8,
    completed_missions: 12,
    badge: 'Bronze Volunteer',
    joined: '2024-02-20',
    lat: 17.4400,
    lng: 78.3489
  },
  {
    id: 4,
    name: 'Mohammed Ali',
    email: 'mohammed.ali.rescue@gmail.com',
    phone: '+91 6543210987',
    skills: ['Transportation', 'Emergency Response'],
    experience: '4 years rescue operations',
    location: 'Kukatpally, Hyderabad',
    availability: 'Available Now',
    rating: 4.6,
    completed_missions: 18,
    badge: 'Silver Volunteer',
    joined: '2023-09-05',
    lat: 17.4851,
    lng: 78.4110
  }
];

// Sample help requests data
const initialHelpRequests = [
  {
    id: 1,
    title: 'Family Trapped in Flooded Building',
    description: 'Family of 5 including elderly and children trapped on 2nd floor. Water level rising rapidly.',
    category: 'Emergency Rescue',
    priority: 'Critical',
    status: 'Pending',
    requester_name: 'Suresh Babu',
    requester_phone: '+91 9988776655',
    location: 'Nizampet, Hyderabad',
    lat: 17.5123,
    lng: 78.3911,
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 mins ago
    volunteers_needed: 3,
    volunteers_assigned: 1,
    estimated_time: '1-2 hours'
  },
  {
    id: 2,
    title: 'Medical Emergency - Diabetic Patient',
    description: 'Diabetic patient needs insulin urgently. Local pharmacy flooded. Need medical volunteer with supplies.',
    category: 'Medical Assistance',
    priority: 'High',
    status: 'In Progress',
    requester_name: 'Lakshmi Devi',
    requester_phone: '+91 8877665544',
    location: 'Madhapur, Hyderabad',
    lat: 17.4485,
    lng: 78.3908,
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    volunteers_needed: 2,
    volunteers_assigned: 2,
    estimated_time: '30-45 minutes'
  },
  {
    id: 3,
    title: 'Food & Water for Stranded Families',
    description: '15 families in apartment complex without food/water for 8+ hours. Road access blocked by fallen trees.',
    category: 'Relief Distribution',
    priority: 'High',
    status: 'Completed',
    requester_name: 'Apartment Residents Association',
    requester_phone: '+91 7766554433',
    location: 'Kondapur, Hyderabad',
    lat: 17.4616,
    lng: 78.3659,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    volunteers_needed: 5,
    volunteers_assigned: 6,
    estimated_time: 'Completed',
    completion_note: 'Food packets distributed successfully. Road cleared.'
  },
  {
    id: 4,
    title: 'Elderly Care - Power Outage',
    description: 'Senior citizen with oxygen machine. Power out for 3+ hours. Need generator or evacuation assistance.',
    category: 'Medical Assistance',
    priority: 'Critical',
    status: 'Pending',
    requester_name: 'Dr. Venkat',
    requester_phone: '+91 6655443322',
    location: 'Ameerpet, Hyderabad',
    lat: 17.4376,
    lng: 78.4482,
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
    volunteers_needed: 2,
    volunteers_assigned: 0,
    estimated_time: 'ASAP'
  }
];

// This component will provide the database functions to the rest of the app.
export const DatabaseProvider = ({ children }) => {
  // Use state to make our mock database mutable (for INSERTs)
  const [alerts, setAlerts] = useState(initialSampleAlerts);
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [helpRequests, setHelpRequests] = useState(initialHelpRequests);
  const bcRef = useRef(null);

  useEffect(() => {
    // Setup BroadcastChannel to receive incidents from other tabs
    try {
      const bc = new BroadcastChannel('relief-connect');
      bcRef.current = bc;
      bc.onmessage = (ev) => {
        const incoming = ev.data;
        if (incoming && incoming.type === 'new-incident' && incoming.incident) {
          setAlerts(prev => [...prev, incoming.incident]);
          // Show browser notification if permitted
          try {
            if (window.Notification && Notification.permission === 'granted') {
              new Notification(incoming.incident.title || 'New Incident', { body: incoming.incident.description || '' });
            }
          } catch (e) {
            // ignore
          }
        }
      };
      return () => {
        bc.close();
      };
    } catch (e) {
      // BroadcastChannel not supported - ignore
    }
  }, []);

  // This function pretends to run a SQL query with more realistic logic.
  const executeQuery = async (query, params = []) => {
    console.log("Executing mock query:", query.trim().split('\n')[0], "...");

    const upperQuery = query.trim().toUpperCase();

    // Handle COUNT queries
    if (upperQuery.startsWith('SELECT COUNT(*)')) {
        return Promise.resolve({ success: true, data: [{ count: alerts.length }] });
    }

    // Handle INSERT queries
    if (upperQuery.startsWith('INSERT INTO')) {
        // Check for optional broadcast flag as last param (boolean)
        let doBroadcast = true;
        if (params.length && typeof params[params.length - 1] === 'boolean') {
          doBroadcast = params[params.length - 1];
          params = params.slice(0, params.length - 1);
        }

        const newAlert = {
            id: Date.now(),
            title: params[0],
            description: params[1],
            severity: params[2],
            location: params[3],
            alert_type: params[4],
            source: params[5],
            created_at: new Date().toISOString(),
            active: true,
        };

        // Add additional fields based on parameter count and content
        if (params.length > 6) {
          newAlert.image_url = params[6];
        }
        if (params.length > 7) {
          newAlert.age = params[7];
        }
        if (params.length > 8) {
          newAlert.gender = params[8];
        }
        if (params.length > 9) {
          newAlert.last_seen_date = params[9];
        }
        // Optional contact info as final param for either flow
        if (params.length > 10) {
          newAlert.contact_info = params[10];
        }
        // Handle lost items structure where params include category and contact_info positions 7 and 8
        if (upperQuery.includes('ALERT_TYPE') && typeof params[4] !== 'undefined') {
          const alertType = params[4];
          if (alertType === 'lost_item') {
            newAlert.category = params[7];
            newAlert.contact_info = params[8];
          }
        }

        setAlerts(prevAlerts => [...prevAlerts, newAlert]);
        // Broadcast to other tabs/clients that a new incident was published (if allowed)
        if (doBroadcast) {
          try {
            if (bcRef.current) {
              bcRef.current.postMessage({ type: 'new-incident', incident: newAlert });
            }
            // Also dispatch a window event for any listeners
            window.dispatchEvent(new CustomEvent('relief:new-incident', { detail: newAlert }));
            // Request notification permission if not yet decided, then notify
            if (window.Notification) {
              if (Notification.permission === 'default') {
                Notification.requestPermission().then((perm) => {
                  if (perm === 'granted') {
                    try { new Notification(newAlert.title || 'New Incident', { body: newAlert.description || '' }); } catch (e) {}
                  }
                })
              } else if (Notification.permission === 'granted') {
                try { new Notification(newAlert.title || 'New Incident', { body: newAlert.description || '' }); } catch (e) {}
              }
            }
          } catch (e) {
            // ignore
          }
        }
        return Promise.resolve({ success: true, data: [] });
    }

  // Handle UPDATE queries for simple status changes like marking resolved/found
  if (upperQuery.startsWith('UPDATE')) {
    // Expected usage: UPDATE alerts SET active = ? WHERE id = ?
    try {
      const [activeValue, id] = params;
      setAlerts(prevAlerts => prevAlerts.map(a => a.id === id ? { ...a, active: !!activeValue, status: (!!activeValue ? a.status : 'found') } : a));
      return Promise.resolve({ success: true, data: [] });
    } catch (e) {
      return Promise.resolve({ success: false, error: 'Malformed UPDATE params' });
    }
  }

    // Handle SELECT queries
    if (upperQuery.startsWith('SELECT')) {
      let data = [...alerts];

      // If caller provided a WHERE alert_type = ? clause with params, filter by that type
      try {
        if (upperQuery.includes('WHERE') && params && params.length && upperQuery.includes('ALERT_TYPE')) {
          const requestedType = params[0]
          data = data.filter(a => a.alert_type === requestedType)
        }
      } catch (e) {
        // ignore and return unfiltered data
      }

      // If the query includes the specific ORDER BY clause, sort the data
      if (upperQuery.includes('ORDER BY')) {
        const severityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
        data.sort((a, b) => {
          const severityA = severityOrder[a.severity] || 5;
          const severityB = severityOrder[b.severity] || 5;
          if (severityA !== severityB) {
            return severityA - severityB; // Sort by severity first
          }
          // If severity is the same, sort by date descending
          return new Date(b.created_at) - new Date(a.created_at);
        });
      }
      
      return Promise.resolve({ success: true, data });
    }
    
    // Default fallback for any other query type
    return Promise.resolve({ success: false, error: 'Unsupported query type' });
  };

  return (
    <DatabaseContext.Provider value={{ executeQuery, alerts, volunteers, helpRequests }}>
      {children}
    </DatabaseContext.Provider>
  );
};

