import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const DatabaseContext = createContext();

export const useDatabase = () => useContext(DatabaseContext);

// This is our initial fake database data.
const initialSampleAlerts = [
  {
    id: 1,
    title: 'Severe Cyclonic Storm Warning',
    description: 'A severe cyclonic storm is expected to make landfall. Strong winds and heavy rain likely; secure loose objects and follow evacuation orders.',
    severity: 'critical',
    location: 'Odisha Coast',
    alert_type: 'weather',
    source: 'India Meteorological Department (IMD)',
    lat: 19.820664,
    lng: 85.906167,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    active: true,
  },
  {
    id: 2,
    title: 'Flash Flood Alert',
    description: 'Intense rainfall has caused water levels to rise rapidly in low-lying areas. Avoid flooded roads and move to higher ground if necessary.',
    severity: 'high',
    location: 'Assam (Brahmaputra basin)',
    alert_type: 'flood',
    source: 'State Disaster Management Authority',
    lat: 26.200557,
    lng: 92.937576,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    active: true,
  },
  {
    id: 3,
    title: 'Forest Fire Evacuation Notice',
    description: 'Rapid spread of wildfires in hill slopes. Immediate evacuation advised for nearby settlements.',
    severity: 'high',
    location: 'Uttarakhand - Chamoli District',
    alert_type: 'wildfire',
    source: 'Forest Department',
    lat: 30.7183,
    lng: 79.5157,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    active: true,
  },
  {
    id: 4,
    title: 'Widespread Power Outage',
    description: 'Power supply disrupted across multiple wards due to grid damage. Crews are working on restoration; expect intermittent outages.',
    severity: 'medium',
    location: 'Mumbai Suburban',
    alert_type: 'infrastructure',
    source: 'Local Electricity Distribution Company',
    lat: 19.075984,
    lng: 72.877656,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    active: true,
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

// This component will provide the database functions to the rest of the app.
export const DatabaseProvider = ({ children }) => {
  // Use state to make our mock database mutable (for INSERTs)
  const [alerts, setAlerts] = useState(initialSampleAlerts);
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
    <DatabaseContext.Provider value={{ executeQuery, alerts }}>
      {children}
    </DatabaseContext.Provider>
  );
};

