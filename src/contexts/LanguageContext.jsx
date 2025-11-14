import React, { createContext, useContext, useState, useMemo } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

const translations = {
  en: {
    header: { title: 'Disaster Response Hub', tagline: 'Emergency Support & Community Aid', signIn: 'Sign In', logout: 'Logout' },
    home: {
      heroTitle: 'Disaster Response',
      heroSubtitle: 'Help and updates tailored for your region',
      getHelp: 'Get Emergency Help Now',
      reportIncident: 'Report Incident',
      advisoryTitle: 'Active Advisory',
      advisoryBody: 'Stay updated via Live Updates. For emergencies in India, call 112 (national), 100 (police), 108 (ambulance), 101 (fire).',
      recentUpdates: 'Recent Updates'
    },
    live: {
      title: 'Live Updates',
      desc: 'Real-time disaster alerts and emergency information',
      lastUpdated: 'Last updated',
      refresh: 'Refresh',
      filterLabel: 'Filter by severity:',
      noAlertsAll: 'There are currently no active alerts in your area.',
      noAlertsSeverity: (sev) => `No ${sev} severity alerts at this time.`,
      sampleAlerts: [
        {
          title: 'Severe Cyclonic Storm Warning',
          description: 'A severe cyclonic storm is expected to make landfall. Strong winds and heavy rain likely; secure loose objects and follow evacuation orders.',
          severity: 'critical',
          location: 'Odisha Coast',
          alert_type: 'weather',
          source: 'India Meteorological Department (IMD)'
        },
        {
          title: 'Flash Flood Alert',
          description: 'Intense rainfall has caused water levels to rise rapidly in low-lying areas. Avoid flooded roads and move to higher ground if necessary.',
          severity: 'high',
          location: 'Assam (Brahmaputra basin)',
          alert_type: 'flood',
          source: 'State Disaster Management Authority'
        },
        {
          title: 'Forest Fire Evacuation Notice',
          description: 'Rapid spread of wildfires in hill slopes. Immediate evacuation advised for nearby settlements.',
          severity: 'high',
          location: 'Uttarakhand - Chamoli District',
          alert_type: 'wildfire',
          source: 'Forest Department'
        },
        {
          title: 'Widespread Power Outage',
          description: 'Power supply disrupted across multiple wards due to grid damage. Crews are working on restoration; expect intermittent outages.',
          severity: 'medium',
          location: 'Mumbai Suburban',
          alert_type: 'infrastructure',
          source: 'Local Electricity Distribution Company'
        },
        {
          title: 'Urban Flooding and Road Closures',
          description: 'Heavy overnight rains have caused flooding in low-lying areas and major arterial roads. Commuters should avoid vulnerable routes.',
          severity: 'high',
          location: 'Hyderabad (GHMC area)',
          alert_type: 'flood',
          source: 'Greater Hyderabad Municipal Corporation (GHMC)'
        },
        {
          title: 'Coastal Evacuation Advisory',
          description: 'High tidal surges expected along the coastline. Coastal residents should move to temporary shelters until the advisory is lifted.',
          severity: 'critical',
          location: 'Chennai Coastline',
          alert_type: 'storm_surge',
          source: 'IMD / Local Authorities'
        }
      ],
      source: 'Source:',
    },
    emergency: {
      modalTitle: 'Emergency Contacts',
      important: 'Important:',
      importantBody: 'In life-threatening emergencies, call 112 immediately. This app provides support resources but is not a substitute for emergency services.'
    },
    emergencyContacts: 'Emergency Contacts',
    national: 'Emergency Services (National)',
    police: 'Police',
    ambulance: 'Ambulance',
    fire: 'Fire',
    kitTitle: 'Emergency Kit Essentials',
    kitItems: [
      'Water (1 gallon per person per day)',
      'Non-perishable food (3-day supply)',
      'Battery-powered radio',
      'Flashlight and extra batteries',
      'First aid kit',
      'Medications',
      'Important documents',
      'Cash and credit cards',
      'Emergency contact information',
      'Blankets and clothing'
    ]
  },
  hi: {
    header: { title: 'आपदा सहायता केंद्र', tagline: 'आपातकालीन सहायता और सामुदायिक सहयोग', signIn: 'साइन इन', logout: 'लॉगआउट' },
    home: {
      heroTitle: 'आपदा प्रतिक्रिया',
      heroSubtitle: 'आपके क्षेत्र के अनुसार सहायता और अपडेट',
      getHelp: 'तुरंत मदद प्राप्त करें',
      reportIncident: 'घटना रिपोर्ट करें',
      advisoryTitle: 'महत्वपूर्ण परामर्श',
      advisoryBody: 'लाइव अपडेट देखें। भारत में आपातकाल के लिए 112 (राष्ट्रीय), 100 (पुलिस), 108 (एम्बुलेंस), 101 (अग्निशमन) पर कॉल करें।',
      recentUpdates: 'हालिया अपडेट'
    },
    live: {
      title: 'लाइव अपडेट',
      desc: 'रीयल-टाइम आपदा अलर्ट और आपात जानकारी',
      lastUpdated: 'अंतिम अपडेट',
      refresh: 'रिफ्रेश',
      filterLabel: 'गंभीरता के अनुसार फ़िल्टर:',
      noAlertsAll: 'आपके क्षेत्र में फिलहाल कोई सक्रिय अलर्ट नहीं है।',
      noAlertsSeverity: (sev) => `फिलहाल ${sev} स्तर के अलर्ट नहीं हैं।`,
      sampleAlerts: [
        {
          title: 'तूफान चेतावनी',
          description: 'एक तीव्र चक्रवात तट पर प्रभाव डालने की संभावना है। तेज हवाएँ और भारी वर्षा हो सकती है; सुरक्षित स्थान पर जाएँ और आवश्यकतानुसार निकासी का पालन करें।',
          severity: 'critical',
          location: 'ओडिशा तट',
          alert_type: 'weather',
          source: 'भारतीय मौसम विभाग (IMD)'
        },
        {
          title: 'तुरन्त बाढ़ चेतावनी',
          description: 'तीव्र वर्षा से निचले इलाकों में जलस्तर तेज़ी से बढ़ रहा है। बाढ़ वाले रास्तों से बचें और आवश्यकता होने पर ऊँचे स्थानों पर चले जाएं।',
          severity: 'high',
          location: 'असम (ब्रह्मपुत्र बेसिन)',
          alert_type: 'flood',
          source: 'राज्य आपदा प्रबंधन प्राधिकरण'
        },
        {
          title: 'जंगल में आग निकासी सूचना',
          description: 'पहाड़ी ढलानों पर जंगल की आग तेजी से फैल रही है। पास के बस्तियों के लिए तुरंत निकासी की सलाह दी जाती है।',
          severity: 'high',
          location: 'उत्तराखंड - चमोली जिला',
          alert_type: 'wildfire',
          source: 'वन विभाग'
        },
        {
          title: 'बड़ी बिजली कटौती',
          description: 'ग्रिड क्षति के कारण कई वार्डों में बिजली आपूर्ति प्रभावित। मरम्मत कार्य जारी है; अंतराल हो सकते हैं।',
          severity: 'medium',
          location: 'मुंबई उपनगरीय',
          alert_type: 'infrastructure',
          source: 'स्थानीय विद्युत वितरण कंपनी'
        },
        {
          title: 'शहरी बाढ़ और सड़क बंद',
          description: 'रात भर भारी वर्षा से निचले इलाकों और प्रमुख रास्तों में जलभराव हुआ है। यात्रियों को संवेदनशील मार्गों से बचना चाहिए।',
          severity: 'high',
          location: 'हैदराबाद (GHMC क्षेत्र)',
          alert_type: 'flood',
          source: 'ग्रेटर हैदराबाद म्युनिसिपल कॉर्पोरेशन (GHMC)'
        },
        {
          title: 'तटीय निकासी सलाह',
          description: 'तटरेखा पर ऊँचे ज्वार की आशंका है। तटीय निवासी अस्थायी शरण स्थलों में चले जाएँ।',
          severity: 'critical',
          location: 'चेन्नई तट',
          alert_type: 'storm_surge',
          source: 'IMD / स्थानीय अधिकारी'
        }
      ],
      source: 'स्रोत:',
    },
    emergency: {
      modalTitle: 'आपातकालीन संपर्क',
      important: 'महत्वपूर्ण:',
      importantBody: 'जानलेवा आपात स्थिति में तुरंत 112 पर कॉल करें। यह ऐप सहायता संसाधन प्रदान करता है, आपात सेवाओं का विकल्प नहीं है।'
    },
    emergencyContacts: 'आपातकालीन संपर्क',
    national: 'आपातकालीन सेवाएं (राष्ट्रीय)',
    police: 'पुलिस',
    ambulance: 'एम्बुलेंस',
    fire: 'अग्निशमन',
    kitTitle: 'आपातकालीन किट आवश्यकताएँ',
    kitItems: [
      'पानी (प्रति व्यक्ति प्रति दिन 1 गैलन)',
      'नाश न होने वाला भोजन (3 दिन की मात्रा)',
      'बैटरी से चलने वाला रेडियो',
      'टॉर्च और अतिरिक्त बैटरियाँ',
      'फर्स्ट एड किट',
      'दवाइयाँ',
      'महत्वपूर्ण दस्तावेज',
      'नकद और कार्ड',
      'आपातकालीन संपर्क जानकारी',
      'कंबल और कपड़े'
    ]
  },
  te: {
    header: { title: 'విపత్తు సహాయ కేంద్రం', tagline: 'అత్యవసర సహాయం & కమ్యూనిటీ సాయం', signIn: 'సైన్ ఇన్', logout: 'లాగ్ అవుట్' },
    home: {
      heroTitle: 'విపత్తు ప్రతిస్పందన',
      heroSubtitle: 'మీ ప్రాంతానికి అనుగుణంగా సహాయం మరియు నవీకరణలు',
      getHelp: 'తక్షణ సహాయం పొందండి',
      reportIncident: 'ఘటనను నివేదించండి',
      advisoryTitle: 'ప్రస్తుత హెచ్చరిక',
      advisoryBody: 'లైవ్ అప్డేట్స్ చూడండి. అత్యవసర పరిస్థితుల్లో: 112 (జాతీయ), 100 (పోలీసు), 108 (ఆంబులెన్స్), 101 (ఫైర్) కాల్ చేయండి.',
      recentUpdates: 'తాజా నవీకరణలు'
    },
    live: {
      title: 'లైవ్ అప్డేట్స్',
      desc: 'రియల్-టైమ్ విపత్తు హెచ్చరికలు మరియు సమాచారం',
      lastUpdated: 'చివరి నవీకరణ',
      refresh: 'రిఫ్రెష్',
      filterLabel: 'తీవ్రత ప్రకారం ఫిల్టర్:',
      noAlertsAll: 'మీ ప్రాంతంలో ప్రస్తుతం హెచ్చరికలు లేవు.',
      noAlertsSeverity: (sev) => `ప్రస్తుతం ${sev} హెచ్చరికలు లేవు.`,
      sampleAlerts: [
        {
          title: 'తీవ్రమైన తుపాను హెచ్చరిక',
          description: 'తీవ్రమైన తుపాను తీరంపై ప్రభావం చూపే అవకాశం ఉంది. బలమైన గాలులు మరియు భారీ వర్షం ఉండొచ్చు; అవసరమైతే ఎవాక్యుయేట్ చేయండి.',
          severity: 'critical',
          location: 'ఒడిశా తీరము',
          alert_type: 'weather',
          source: 'ఇండియా మెట్ రికలజికల్ డిపార్ట్‌మెంట్ (IMD)'
        },
        {
          title: 'ఫ్లాష్ వరద హెచ్చరిక',
          description: 'తీవ్ర వర్షం కారణంగా నీటి స్థాయిలు వేగంగా పెరుగుతున్నాయి. వరద ప్రాంతాలు మరియు బాహుబల రహదారులను এవాయిడ్ చేయండి.',
          severity: 'high',
          location: 'అస్సాం (బ్రహ్మపుత్రా бассేన్)',
          alert_type: 'flood',
          source: 'రాజ్య అత్యవసర నిర్వహణ సంస్థ'
        },
        {
          title: 'అరణ్య మంటల నుంచి నిరాకరణ సూచన',
          description: 'పర్వతాల బాగా అగ్నిప్రమాదం వేగంగా వ్యాప్తి చెందుతోంది. సమీప గ్రామాల కోసం తక్షణం నిరాకరణ సలహా.',
          severity: 'high',
          location: 'ఉత్తరాఖండ్ - చమోలి జిల్లా',
          alert_type: 'wildfire',
          source: ' వన విభాగం'
        },
        {
          title: 'విస్తృత విద్యుత్ విఫలమయ్యింది',
          description: 'గ్రిడ్ నష్టంతో అనేక వార్డులలో విద్యుత్ సరఫరా విఫలమైంది. రెస్టోరేషన్ పని కొనసాగుతోంది; విరామాలు ఉండొచ్చు.',
          severity: 'medium',
          location: 'ముంబాయి ఉపనగర',
          alert_type: 'infrastructure',
          source: 'స్థానిక విద్యుత్ పంపిణీ సంస్థ'
        },
        {
          title: 'నగరఫలం వరదలు మరియు రోడ్డు మూసివేతలు',
          description: 'నిందలో భారీ వర్షాల కారణంగా రోడ్లలో మరియు లో-లయింగ్ ప్రాంతాల్లో నీరు నిలిచిపోయింది. పర్యటనదారులు ప్రమాదకర మార్గాలను నివారించాలి.',
          severity: 'high',
          location: 'హైదరాబాదు (GHMC ప్రాంతం)',
          alert_type: 'flood',
          source: 'గ్రేటర్ హైదరాబాదు మునిసిపల్ కార్పొరేషన్ (GHMC)'
        },
        {
          title: 'తీరవ సహాయ సూచన',
          description: 'తీరప్రాంతాల్లో అధిక జ్వార్లు ఉంటాయని అంచనా. తీరవాసులు తాత్కాలిక శ్రేయోభిలాష స్థలాలకు వెళ్లండి.',
          severity: 'critical',
          location: 'చెన్నై తీరము',
          alert_type: 'storm_surge',
          source: 'IMD / స్థానిక అధికారులు'
        }
      ],
      source: 'మూలం:',
    },
    emergency: {
      modalTitle: 'అత్యవసర సంపర్కాలు',
      important: 'ముఖ్యం:',
      importantBody: 'ప్రాణాపాయం ఉన్నప్పుడు వెంటనే 112 కి కాల్ చేయండి. ఈ యాప్ సూచనలు మాత్రమే ఇస్తుంది, ఇది అత్యవసర సేవలకు ప్రత్యామ్నాయం కాదు.'
    },
    emergencyContacts: 'అత్యవసర సంపర్కాలు',
    national: 'అత్యవసర సేవలు (జాతీయ)',
    police: 'పోలీసు',
    ambulance: 'ఆంబులెన్స్',
    fire: 'అగ్నిమాపక',
    kitTitle: 'ఎమర్జెన్సీ కిట్ అవసరాలు',
    kitItems: [
      'నీరు (ప్రతి వ్యక్తికి రోజుకు 1 గ్యాలన్)',
      'దీర్ఘకాలిక ఆహారం (3 రోజుల సరఫరా)',
      'బ్యాటరీ రేడియో',
      'టార్చ్ మరియు అదనపు బ్యాటరీలు',
      'ఫస్ట్ ఎయిడ్ కిట్',
      'ఔషధాలు',
      'ముఖ్య పత్రాలు',
      'నగదు మరియు కార్డులు',
      'అత్యవసర సంప్రదింపు సమాచారం',
      'బ్లాంకెట్లు మరియు బట్టలు'
    ]
  },
  kn: {
    header: { title: 'ವಿಪತ್ತು ಪ್ರತಿಕ್ರಿಯೆ ಕೇಂದ್ರ', tagline: 'ತುರ್ತು ಬೆಂಬಲ ಮತ್ತು ಸಮುದಾಯ ಸಹಾಯ', signIn: 'ಸೈನ್ ಇನ್', logout: 'ಲಾಗ್ ಔಟ್' },
    home: {
      heroTitle: 'ವಿಪತ್ತು ಪ್ರತಿಕ್ರಿಯೆ',
      heroSubtitle: 'ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕೆ ಹೊಂದುವ ಸಹಾಯ ಮತ್ತು ನವೀಕರಣಗಳು',
      getHelp: 'ತತ್ಕ್ಷಣ ಸಹಾಯ',
      reportIncident: ' ಘಟನೆ ವರದಿ ',
      advisoryTitle: 'ಸಕ್ರಿಯ ಸಲಹೆ',
      advisoryBody: 'ಲೈವ್ ನವೀಕರಣಗಳನ್ನು ನೋಡಿ. ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ 112 (ರಾಷ್ಟ್ರೀಯ), 100 (ಪೊಲೀಸ್), 108 (ಆಂಬ್ಯುಲೆನ್ಸ್), 101 (ಅಗ್ನಿಶಾಮಕ) ಕರೆ ಮಾಡಿ.',
      recentUpdates: 'ಇತ್ತೀಚಿನ ನವೀಕರಣಗಳು'
    },
    live: {
      title: 'ಲೈವ್ ನವೀಕರಣಗಳು',
      desc: 'ರಿಯಲ್-ಟೈಮ್ ವಿಪತ್ತು ಎಚ್ಚರಿಕೆಗಳು',
      lastUpdated: 'ಕೊನೆಯ ನವೀಕರಣ',
      refresh: 'ರಿಫ್ರೆಶ್',
      filterLabel: 'ತೀವ್ರತೆ ಆಧಾರಿತ ಫಿಲ್ಟರ್:',
      noAlertsAll: 'ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಪ್ರಸ್ತುತ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ.',
      noAlertsSeverity: (sev) => `ಪ್ರಸ್ತುತ ${sev} ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ.`,
      source: 'ಮೂಲ:',
    },
    emergency: {
      modalTitle: 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
      important: 'ಮುಖ್ಯ:',
      importantBody: 'ಪ್ರಾಣಾಪಾಯದ ಸಂದರ್ಭಗಳಲ್ಲಿ ತಕ್ಷಣ 112 ಕರೆ ಮಾಡಿ. ಈ ಅಪ್ಲಿಕೇಶನ್ ಮಾಹಿತಿ ಮಾತ್ರ ಒದಗಿಸುತ್ತದೆ.'
    },
    emergencyContacts: 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
    national: 'ತುರ್ತು ಸೇವೆಗಳು (ರಾಷ್ಟ್ರೀಯ)',
    police: 'ಪೊಲೀಸ್',
    ambulance: 'ಆಂಬ್ಯುಲೆನ್ಸ್',
    fire: 'ಅಗ್ನಿಶಾಮಕ',
    kitTitle: 'ತುರ್ತು ಕಿಟ್ ಅವಶ್ಯಕತೆಗಳು',
    kitItems: [
      'ನೀರು (ಒಬ್ಬರಿಗೆ ದಿನಕ್ಕೆ 1 ಗ್ಯಾಲನ್)',
      'ನಾಶವಾಗದ ಆಹಾರ (3 ದಿನಗಳ ಪೂರೈಕೆ)',
      'ಬ್ಯಾಟರಿ ರೇಡಿಯೋ',
      'ಟಾರ್ಚ್ ಮತ್ತು ಹೆಚ್ಚುವರಿ ಬ್ಯಾಟರಿಗಳು',
      'ಫಸ್ಟ್ ಎಯ್ಡ್ ಕಿಟ್',
      'ಔಷಧಿಗಳು',
      'ಮುಖ್ಯ ದಾಖಲೆಗಳು',
      'ನಗದು ಮತ್ತು ಕಾರ್ಡ್‌ಗಳು',
      'ತುರ್ತು ಸಂಪರ್ಕ ಮಾಹಿತಿ',
      'ಬ್ಲ್ಯಾಂಕೆಟ್‌ಗಳು ಮತ್ತು ಬಟ್ಟೆಗಳು'
    ]
  },
  bn: {
    header: { title: 'দুর্যোগ সহায়তা কেন্দ্র', tagline: 'জরুরি সহায়তা ও কমিউনিটি সাপোর্ট', signIn: 'সাইন ইন', logout: 'লগ আউট' },
    home: {
      heroTitle: 'দুর্যোগ প্রতিক্রিয়া',
      heroSubtitle: 'আপনার অঞ্চলের জন্য সহায়তা ও আপডেট',
      getHelp: 'তৎক্ষণাৎ সাহায্য নিন',
      reportIncident: 'ঘটনা রিপোর্ট করুন',
      advisoryTitle: 'সক্রিয় পরামর্শ',
      advisoryBody: 'লাইভ আপডেট দেখুন। জরুরিতে 112 (জাতীয়), 100 (পুলিশ), 108 (অ্যাম্বুলেন্স), 101 (দমকল) কল করুন।',
      recentUpdates: 'সাম্প্রতিক আপডেট'
    },
    live: {
      title: 'লাইভ আপডেট',
      desc: 'রিয়েল-টাইম দুর্যোগ সতর্কতা',
      lastUpdated: 'সর্বশেষ আপডেট',
      refresh: 'রিফ্রেশ',
      filterLabel: 'তীব্রতা অনুযায়ী ফিল্টার:',
      noAlertsAll: 'আপনার এলাকায় বর্তমানে কোনো সতর্কতা নেই।',
      noAlertsSeverity: (sev) => `বর্তমানে ${sev} সতর্কতা নেই।`,
      source: 'উৎস:',
    },
    emergency: {
      modalTitle: 'জরুরি যোগাযোগ',
      important: 'গুরুত্বপূর্ণ:',
      importantBody: 'জরুরি অবস্থায় অবিলম্বে 112 ডায়াল করুন। এই অ্যাপ কেবল সহায়ক তথ্য দেয়।'
    },
    emergencyContacts: 'জরুরি যোগাযোগ',
    national: 'জরুরি পরিষেবা (জাতীয়)',
    police: 'পুলিশ',
    ambulance: 'অ্যাম্বুলেন্স',
    fire: 'দমকল',
    kitTitle: 'জরুরি কিটের প্রয়োজনীয় সামগ্রী',
    kitItems: [
      'পানি (প্রতি ব্যক্তি দৈনিক ১ গ্যালন)',
      'নষ্ট না হওয়া খাদ্য (৩ দিনের সরবরাহ)',
      'ব্যাটারিচালিত রেডিও',
      'টর্চ ও অতিরিক্ত ব্যাটারি',
      'ফার্স্ট এইড কিট',
      'ওষুধপত্র',
      'গুরুত্বপূর্ণ নথি',
      'নগদ ও কার্ড',
      'জরুরি যোগাযোগের তথ্য',
      'কম্বল ও পোশাক'
    ]
  },
  ta: {
    header: { title: 'அபாய உதவி மையம்', tagline: 'அவசர உதவி & சமூக ஆதரவு', signIn: 'சைன் இன்', logout: 'லாக்அவுட்' },
    home: {
      heroTitle: 'பேரிடர் உதவி',
      heroSubtitle: 'உங்கள் மண்டலத்திற்கான உதவி மற்றும் புதுப்பிப்புகள்',
      getHelp: 'உடனடி உதவி பெற',
      reportIncident: 'நிகழ்வை அறிவிக்க',
      advisoryTitle: 'செயலில் அறிவிப்பு',
      advisoryBody: 'லைவ் அப்டேட்ஸை பார்க்கவும். அவசரத்தில் 112 (தேசிய), 100 (போலீஸ்), 108 (ஆம்புலன்ஸ்), 101 (தீயணைப்பு) அழைக்கவும்.',
      recentUpdates: 'சமீபத்திய புதுப்பிப்புகள்'
    },
    live: {
      title: 'நேரடி புதுப்பிப்புகள்',
      desc: 'நேரடி பேரிடர் எச்சரிக்கைகள்',
      lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
      refresh: 'ரீஃப்ரெஷ்',
      filterLabel: 'தீவிரம் படி வடிகட்டி:',
      noAlertsAll: 'உங்கள் பகுதியில் தற்போதைக்கு எச்சரிக்கைகள் இல்லை.',
      noAlertsSeverity: (sev) => `தற்போது ${sev} எச்சரிக்கை இல்லை.`,
      source: 'மூலம்:',
    },
    emergency: {
      modalTitle: 'அவசர தொடர்புகள்',
      important: 'முக்கியம்:',
      importantBody: 'அவசர நிலைகளில் உடனே 112 அழைக்கவும். இந்த பயன்பாடு தகவல் மட்டுமே வழங்குகிறது.'
    },
    emergencyContacts: 'அவசர தொடர்புகள்',
    national: 'அவசர சேவைகள் (தேசிய)',
    police: 'காவல் துறை',
    ambulance: 'மருத்துவ அவசர வண்டி',
    fire: 'தீ அணைப்பு',
    kitTitle: 'அவசரக் கிட் அத்தியாவசியங்கள்',
    kitItems: [
      'தண்ணீர் (ஒருவர் ஒரு நாளுக்கு 1 காலன்)',
      'நீண்டநாள் கெடாத உணவு (3 நாள் அளவு)',
      'பேட்டரி ரேடியோ',
      'டார்ச் மற்றும் கூடுதல் பேட்டரிகள்',
      'முதல் உதவி பெட்டி',
      'மருந்துகள்',
      'முக்கிய ஆவணங்கள்',
      'பணம் மற்றும் கார்டுகள்',
      'அவசர தொடர்பு தகவல்',
      'பிளாங்கெட்டுகள் மற்றும் உடைகள்'
    ]
  }
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en')
  const value = useMemo(() => ({ lang, setLang, t: translations[lang] }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}


