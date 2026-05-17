// app.js - Smart Tourist Safety Prototype
// Implements Edge-AI simulation, Multi-Tier connectivity, Mesh & Blockchain mock

(function() {
  // ---------- DOM Elements ----------
  let activeTab = 'dashboard';

  // Screens
  const dashboardScreen = document.getElementById('dashboardScreen');
  const meshScreen = document.getElementById('meshScreen');
  const identityScreen = document.getElementById('identityScreen');
  const navItems = document.querySelectorAll('.nav-item');

  // Dashboard elements
  const connLevelSpan = document.getElementById('connLevelText');
  const meshCountSpan = document.getElementById('meshCount');
  const aiStatusSpan = document.getElementById('aiStatusText');
  const audioClassSpan = document.getElementById('audioClassLabel');
  const confidenceFill = document.getElementById('confidenceFill');
  const anomalyTextSpan = document.getElementById('anomalyText');
  const sosStateBadge = document.getElementById('sosStateBadge');
  const tier1Status = document.getElementById('tier1Status');
  const tier2Status = document.getElementById('tier2Status');
  const tier3Status = document.getElementById('tier3Status');
  const lastSosMsg = document.getElementById('lastSosMessage');
  const weatherRiskSpan = document.getElementById('weatherRisk');
  const newsAlertSpan = document.getElementById('newsAlert');
  const riskScoreSpan = document.getElementById('riskScoreValue');
  const zoneBadge = document.getElementById('zoneBadge');
  const movementSpan = document.getElementById('movementStatus');
  const globalRiskBadge = document.getElementById('globalRiskBadge');

  // Mesh screen dynamic
  const nodeGraphDiv = document.getElementById('nodeGraph');
  const activePeersSpan = document.getElementById('activePeersCount');
  const gatewayStatusSpan = document.getElementById('gatewayStatus');
  const lastRelaySpan = document.getElementById('lastRelay');

  // Identity elements
  const emergencyAccessBadge = document.getElementById('emergencyAccessBadge');
  const decryptedInfoDiv = document.getElementById('decryptedInfo');

  // State variables
  let connectivityLevel = 1;       // 1=internet, 2=SMS, 3=Mesh
  let meshPeers = 3;               // simulated nodes
  let sosActive = false;
  let currentRiskScore = 32;
  let highRiskMode = false;
  let lastSosTimestamp = null;

  // Helper: update connectivity tier UI and fallback simulation
  function updateConnectivityUI() {
    if (connectivityLevel === 1) {
      connLevelSpan.innerText = 'Level 1';
      connLevelSpan.style.color = '#10b981';
      tier1Status.innerHTML = '✅ Active';
      tier2Status.innerHTML = '⚡ Standby';
      tier3Status.innerHTML = '🔍 Scanning';
    } else if (connectivityLevel === 2) {
      connLevelSpan.innerText = 'Level 2 (SMS)';
      connLevelSpan.style.color = '#f59e0b';
      tier1Status.innerHTML = '❌ Failed';
      tier2Status.innerHTML = '📱 SMS Sent';
      tier3Status.innerHTML = '🔍 Standby';
    } else {
      connLevelSpan.innerText = 'Level 3 (Mesh)';
      connLevelSpan.style.color = '#8b5cf6';
      tier1Status.innerHTML = '❌ Offline';
      tier2Status.innerHTML = '❌ No Signal';
      tier3Status.innerHTML = '🕸️ Mesh Relaying';
    }
  }

  // simulate dynamic risk and geofence
  function refreshRiskContext() {
    const baseRisk = Math.floor(Math.random() * 50) + 10;
    const newsRisks = ['⚠️ Landslide watch', '🌊 Flash flood alert', '🔥 Wildfire nearby', '✅ No active alerts'];
    const weatherOps = ['⛅ Clear skies', '🌧️ Heavy rain risk', '🌬️ Strong winds', '🌡️ Extreme heat'];
    const randomNews = newsRisks[Math.floor(Math.random() * newsRisks.length)];
    const randomWeather = weatherOps[Math.floor(Math.random() * weatherOps.length)];
    let finalRisk = baseRisk;
    if (randomNews.includes('alert') || randomNews.includes('watch')) finalRisk += 25;
    if (randomWeather.includes('rain') || randomWeather.includes('Extreme')) finalRisk += 15;
    finalRisk = Math.min(finalRisk, 98);
    currentRiskScore = finalRisk;
    riskScoreSpan.innerText = `${currentRiskScore} / 100`;
    riskScoreSpan.style.color = currentRiskScore > 65 ? '#dc2626' : currentRiskScore > 35 ? '#f59e0b' : '#10b981';
    newsAlertSpan.innerText = randomNews;
    weatherRiskSpan.innerText = randomWeather;

    // update global badge
    if (currentRiskScore > 65) {
      globalRiskBadge.innerHTML = '<span>🔴 RISK: HIGH</span>';
      globalRiskBadge.style.background = '#fee2e2';
    } else if (currentRiskScore > 35) {
      globalRiskBadge.innerHTML = '<span>🟡 RISK: MODERATE</span>';
      globalRiskBadge.style.background = '#fff3e6';
    } else {
      globalRiskBadge.innerHTML = '<span>🟢 RISK: LOW</span>';
      globalRiskBadge.style.background = '#e0f2fe';
    }
  }

  // simulate anomaly detection (stoppage / route deviation)
  let anomalyActive = false;
  function simulateAnomalyDetection() {
    const randomAnomaly = Math.random();
    if (randomAnomaly < 0.25 && !sosActive) {
      if (!anomalyActive) {
        anomalyActive = true;
        anomalyTextSpan.innerText = '⚠️ Abnormal Stoppage (>10min in high-risk)';
        anomalyTextSpan.style.color = '#e05a3a';
        movementSpan.innerText = '🚨 Stopped - possible distress';
        zoneBadge.innerText = '⚠️ High Alert Zone';
      }
    } else if (randomAnomaly > 0.7) {
      anomalyActive = false;
      anomalyTextSpan.innerText = 'None detected';
      anomalyTextSpan.style.color = 'inherit';
      movementSpan.innerText = '🚶 Normal movement';
      if (!highRiskMode) zoneBadge.innerText = '🌿 Safe Zone';
      else zoneBadge.innerText = '⚠️ High Risk Zone';
    }
  }

  // audio classification mock
  function simulateAudioAI() {
    const sounds = ['Ambient noise', '🗣️ Speech', '🔊 SCREAM DETECTED', '💥 Glass break'];
    const probs = [0.7, 0.15, 0.1, 0.05];
    const r = Math.random();
    let idx = 0;
    let accum = 0;
    for (let i = 0; i < probs.length; i++) {
      accum += probs[i];
      if (r < accum) { idx = i; break; }
    }
    const detected = sounds[idx];
    audioClassSpan.innerText = detected;
    let confidence = 0.55 + Math.random() * 0.4;
    confidenceFill.style.width = `${confidence * 100}%`;
    if ((detected.includes('SCREAM') || detected.includes('Glass')) && !sosActive) {
      triggerSosProtocol('Edge-AI Trigger: Scream/Glass break');
    }
  }

  // ----- Multi-tier SOS logic -----
  async function triggerSosProtocol(origin) {
    if (sosActive) return;
    sosActive = true;
    sosStateBadge.innerText = '🚨 SOS ACTIVE';
    lastSosMsg.innerText = `⚠️ SOS sent via ${origin} at ${new Date().toLocaleTimeString()}`;
    
    // simulate Level 1 attempt
    let success = false;
    if (connectivityLevel === 1) {
      await delay(400);
      lastSosMsg.innerText = `✅ SOS delivered via Internet (Supabase/FastAPI) - ${new Date().toLocaleTimeString()}`;
      success = true;
    } 
    if (!success && connectivityLevel <= 2) {
      // fallback SMS
      await delay(500);
      lastSosMsg.innerText = `📱 SMS Fallback: encoded payload lat:12.97,lon:77.59,type:SOS - ${new Date().toLocaleTimeString()}`;
      success = true;
      connectivityLevel = 2;
      updateConnectivityUI();
    }
    if (!success) {
      // Mesh level 3 active
      await delay(600);
      lastSosMsg.innerText = `🕸️ Mesh Network: A* routing via ${meshPeers} nodes → Gateway reached! SOS relayed.`;
      success = true;
      connectivityLevel = 3;
      updateConnectivityUI();
      // update mesh screen stats
      if (activePeersSpan) activePeersSpan.innerText = meshPeers;
      if (lastRelaySpan) lastRelaySpan.innerText = `SOS packet relayed via A* (${new Date().toLocaleTimeString()})`;
    }
    setTimeout(() => {
      sosActive = false;
      sosStateBadge.innerText = 'Standby';
    }, 4000);
  }

  // user manual SOS
  function manualSos() {
    if (sosActive) return;
    triggerSosProtocol('Manual button');
  }

  // simulate mesh network + A* demo refresh
  function updateMeshVisualization() {
    if (!nodeGraphDiv) return;
    const nodesCount = meshPeers + 1; // + user
    let html = `<div class="mesh-node" style="background:#ffddd6;">📍 You (Sender)</div>`;
    for (let i=1; i<=meshPeers; i++) {
      let isGateway = (i === meshPeers);
      html += `<div class="mesh-node ${isGateway ? 'gateway' : ''}">🔗 Node ${String.fromCharCode(64+i)} ${isGateway ? '(Gateway)' : ''}</div>`;
      if (i < meshPeers) html += `<span style="font-size:1.2rem;"> → </span>`;
    }
    nodeGraphDiv.innerHTML = html;
    gatewayStatusSpan.innerText = meshPeers >= 2 ? '✅ Ranger Station (Internet Gateway reachable)' : '⚠️ Gateway distant';
    activePeersSpan.innerText = meshPeers;
    const astarDiv = document.getElementById('astarExplanation');
    if (astarDiv) astarDiv.innerText = `✨ A* best path: ${meshPeers} hops, estimated latency ${(meshPeers * 0.2).toFixed(1)}s → SOS delivered.`;
  }

  function simulateMeshHopRelay() {
    lastRelaySpan.innerText = `🔄 Test relay: SOS packet forwarded (A* routing) at ${new Date().toLocaleTimeString()}`;
    triggerSosProtocol('Mesh Relay Test');
  }

  // Blockchain identity: emergency responder decrypt
  function simulateEmergencyUnlock() {
    emergencyAccessBadge.innerText = '🔓 UNLOCKED (Responder)';
    emergencyAccessBadge.style.color = '#10b981';
    decryptedInfoDiv.style.display = 'block';
    decryptedInfoDiv.innerHTML = `<strong>🔐 Decrypted PII (mock):</strong> Name: Emma Watson, Passport: ****, Emergency Contact: +91 98765 43210. Blockchain hash verified.`;
  }

  // High risk zone simulation: increases AI sensitivity
  function enterHighRiskZone() {
    highRiskMode = true;
    zoneBadge.innerText = '⚠️ HIGH RISK ZONE (Landslide)';
    zoneBadge.style.background = '#fee2e2';
    const geoAlert = document.getElementById('geoAlert');
    if (geoAlert) geoAlert.innerText = '🚨 Geofence: Active high-risk zone. Edge-AI switched to HIGH SENSITIVITY mode.';
    movementSpan.innerText = '⚠️ Caution: High-risk geofence active';
    // Simulate risk increase
    currentRiskScore = Math.min(currentRiskScore + 28, 95);
    riskScoreSpan.innerText = `${currentRiskScore} / 100`;
    riskScoreSpan.style.color = '#dc2626';
    globalRiskBadge.innerHTML = '<span>🔴 RISK: HIGH</span>';
  }

  // periodic simulation updates
  function startBackgroundSimulation() {
    setInterval(() => {
      if (activeTab === 'dashboard') {
        simulateAudioAI();
        simulateAnomalyDetection();
        // occasionally toggle connectivity for demonstration (dynamic mesh)
        if (Math.random() < 0.1) {
          connectivityLevel = connectivityLevel === 1 ? 2 : (connectivityLevel === 2 ? 3 : 1);
          updateConnectivityUI();
        }
        meshPeers = 2 + Math.floor(Math.random() * 3);
        meshCountSpan.innerText = meshPeers;
        updateMeshVisualization();
      }
    }, 3800);
    setInterval(() => {
      if (activeTab === 'dashboard') refreshRiskContext();
    }, 12000);
  }

  // Helper delay
  function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  // Tab switching
  function switchTab(tabId) {
    activeTab = tabId;
    dashboardScreen.classList.remove('active');
    meshScreen.classList.remove('active');
    identityScreen.classList.remove('active');
    if (tabId === 'dashboard') dashboardScreen.classList.add('active');
    if (tabId === 'mesh') meshScreen.classList.add('active');
    if (tabId === 'identity') identityScreen.classList.add('active');
    navItems.forEach(item => {
      const tabAttr = item.getAttribute('data-tab');
      if ((tabAttr === 'dashboard' && tabId === 'dashboard') ||
          (tabAttr === 'mesh' && tabId === 'mesh') ||
          (tabAttr === 'identity' && tabId === 'identity')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    if (tabId === 'mesh') updateMeshVisualization();
  }

  // Event listeners
  document.getElementById('triggerSosBtn')?.addEventListener('click', manualSos);
  document.getElementById('testScreamBtn')?.addEventListener('click', () => triggerSosProtocol('Test Scream (Demo)'));
  document.getElementById('refreshRiskBtn')?.addEventListener('click', refreshRiskContext);
  document.getElementById('simulateMeshHopBtn')?.addEventListener('click', simulateMeshHopRelay);
  document.getElementById('simulateEmergencyUnlock')?.addEventListener('click', simulateEmergencyUnlock);
  document.getElementById('enterHighRiskZoneBtn')?.addEventListener('click', enterHighRiskZone);
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });

  // Initialization
  function init() {
    updateConnectivityUI();
    refreshRiskContext();
    meshCountSpan.innerText = meshPeers;
    updateMeshVisualization();
    startBackgroundSimulation();
    switchTab('dashboard');
    setInterval(() => {
      if (!sosActive && document.getElementById('audioClassLabel')?.innerText.includes('SCREAM')) {
        // safety trigger already in simulation; but we ensure no duplicate
      }
    }, 1000);
  }
  init();
})();