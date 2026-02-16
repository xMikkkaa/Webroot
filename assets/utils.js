/**
 * utils.js - Utility functions
 */

document.addEventListener('DOMContentLoaded', function() {
    initNavigationUI();
    initDaemonConnector();
});

function initNavigationUI() {
    // Init check
    if (document.querySelector('.floating-nav-btn')) return;

    // CSS
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: sans-serif;
        }
        /* Floating Button */
        .floating-nav-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
            background-color: #1e1e1e;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            z-index: 10000;
            cursor: pointer;
            border: 1px solid #333;
            transition: transform 0.2s ease;
        }
        .floating-nav-btn:active {
            transform: scale(0.95);
        }
        
        /* Menu Container */
        .nav-menu-container {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 180px;
            background-color: #1e1e1e;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6);
            z-index: 9999;
            border: 1px solid #333;
            overflow: hidden;
            transform-origin: top right;
            transform: scale(0);
            opacity: 0;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        }
        .nav-menu-container.open {
            transform: scale(1);
            opacity: 1;
            pointer-events: auto;
        }

        /* Menu Items */
        .nav-menu-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            color: #ccc;
            cursor: pointer;
            transition: background-color 0.2s;
            border-bottom: 1px solid #2a2a2a;
            font-size: 14px;
            user-select: none;
        }
        .nav-menu-item:last-child {
            border-bottom: none;
        }
        .nav-menu-item:active {
            background-color: #333;
        }
        .nav-menu-item.active {
            color: #3b82f6;
            background-color: rgba(59, 130, 246, 0.1);
        }
        .menu-item-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
        }
        .view-section {
            display: none;
            animation: fadeIn 0.2s ease-out;
        }
        .view-section.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .placeholder-box {
            padding: 40px 20px;
            text-align: center;
            color: #666;
        }
        
        /* Backdrop */
        .nav-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            display: none;
        }
        .nav-backdrop.open {
            display: block;
        }

        /* Refactored Tweak Card Styles */
        .bypass-bg {
            background-color: #1e1e1e;
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 12px;
            border: 1px solid #333;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .bypass-control {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
        }
        .bypass-header {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            min-width: 0;
        }
        .bypass-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background-color: rgba(255,255,255,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
        }
        .bypass-header h3 {
            margin: 0;
            font-size: 15px;
            font-weight: 500;
            white-space: normal;
            line-height: 1.2;
        }
        .bypass-toggle {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
            cursor: pointer;
            user-select: none;
            padding-right: 4px;
        }
        .toggle-label {
            font-size: 13px;
            color: #888;
            min-width: 32px;
            text-align: right;
        }
        .toggle-track {
            width: 48px;
            height: 26px;
            background-color: #333;
            border-radius: 13px;
            position: relative;
            transition: background-color 0.3s ease;
        }
        .toggle-track.on {
            background-color: #3b82f6;
        }
        .toggle-thumb {
            width: 20px;
            height: 20px;
            background-color: #fff;
            border-radius: 50%;
            position: absolute;
            top: 3px;
            left: 3px;
            transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .toggle-track.on .toggle-thumb {
            transform: translateX(22px);
            left: 3px !important;
        }

        /* App Manager Styles */
        .app-card {
            display: flex;
            align-items: center;
            background: #1e1e1e;
            padding: 12px;
            border-radius: 12px;
            margin-bottom: 8px;
            border: 1px solid #333;
            cursor: pointer;
        }
        .app-card:active {
            background: #252525;
        }
        .app-icon-placeholder {
            width: 40px;
            height: 40px;
            background: #333;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 20px;
        }
        .app-info {
            flex: 1;
            min-width: 0;
        }
        .app-name {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .app-pkg {
            font-size: 11px;
            color: #888;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .app-mode-badge {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            background: #333;
            color: #aaa;
            margin-left: 8px;
        }
        
        /* Modal & Segmented Control */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
        }
        .modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }
        .modal-content {
            background: #1e1e1e;
            width: 90%;
            max-width: 320px;
            border-radius: 16px;
            padding: 20px;
            border: 1px solid #333;
            transform: scale(0.9);
            transition: transform 0.2s;
        }
        .modal-overlay.active .modal-content {
            transform: scale(1);
        }
        .modal-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }
        .modal-title {
            font-size: 16px;
            font-weight: 600;
            flex: 1;
        }
        .modal-close {
            background: none;
            border: none;
            color: #888;
            font-size: 24px;
            cursor: pointer;
            padding: 0 8px;
            line-height: 1;
        }
        .segmented-control {
            display: flex;
            background: #2a2a2a;
            border-radius: 10px;
            padding: 4px;
            margin-top: 8px;
        }
        .segment-btn {
            flex: 1;
            padding: 8px 4px;
            text-align: center;
            background: transparent;
            color: #888;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }
        .segment-btn.active {
            background: #3b82f6;
            color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .fab-add {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 56px;
            height: 56px;
            background: #3b82f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            color: white;
            font-size: 28px;
            z-index: 9000;
            cursor: pointer;
            border: none;
            outline: none;
        }
        .fab-add:active { transform: scale(0.95); }
        .modal-input {
            width: 100%;
            background: #2a2a2a;
            border: 1px solid #333;
            padding: 12px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            outline: none;
            margin-bottom: 16px;
        }
        .btn-block {
            width: 100%;
            padding: 12px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
        }
        .btn-danger {
            background: transparent;
            border: 1px solid #ef4444;
            color: #ef4444;
            margin-top: 16px;
        }
        
        /* Toast Notification */
        .toast {
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background-color: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 20001;
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            font-size: 14px;
            text-align: center;
        }
        .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        .toast.error { background-color: rgba(239, 68, 68, 0.95); }
        .toast.success { background-color: rgba(16, 185, 129, 0.95); }
    `;
    document.head.appendChild(style);

    // Dashboard
    const dashboardView = document.createElement('div');
    dashboardView.id = 'view-dashboard';
    dashboardView.className = 'view-section active';

    // Move content
    while (document.body.firstChild) {
        dashboardView.appendChild(document.body.firstChild);
    }
    document.body.appendChild(dashboardView);

    // Awake info
    const systemBg = dashboardView.querySelector('.system-bg');
    if (systemBg) {
        const awakeDiv = document.createElement('div');
        awakeDiv.className = 'system-bg';
        awakeDiv.style.marginBottom = '10px';
        awakeDiv.innerHTML = `
            <div id="autdAwakeMethod" class="info-content" style="color: #81c784; font-weight: 500;">Checking Daemon...</div>
        `;
        systemBg.parentNode.insertBefore(awakeDiv, systemBg);

        // Check status
        setTimeout(checkAutdMethod, 200);
    }

    // Views
    const views = [
        { id: 'view-tweak', title: 'Tweak', content: 'System Tweaks' },
        { id: 'view-app-manager', title: 'App Manager', content: 'App Manager' }
    ];

    views.forEach(v => {
        const div = document.createElement('div');
        div.id = v.id;
        div.className = 'view-section';
        
        if (v.id === 'view-tweak') {
            const bypassEl = dashboardView.querySelector('.bypass-bg');
            if (bypassEl) {
                div.innerHTML = `<div class="container"><div class="content"><div class="placeholder-box" style="padding-bottom: 0;"><h2>${v.title}</h2></div></div></div>`;
                const content = div.querySelector('.content');

                // RAM card
                const ramDiv = document.createElement('div');
                ramDiv.className = 'bypass-bg';
                ramDiv.innerHTML = generateRamMonitorHtml();
                content.appendChild(ramDiv);
                setTimeout(initRamMonitor, 200);

                bypassEl.style.margin = '0 0 12px 0';
                content.appendChild(bypassEl);

                // Opt toggle
                const optDiv = document.createElement('div');
                optDiv.className = 'bypass-bg';
                optDiv.innerHTML = generateToggleHtml('Optimize Game Thread', '🎮', 'gameOpt');
                content.appendChild(optDiv);
                setTimeout(initGameOptLogic, 200);
            } else {
                div.innerHTML = `<div class="placeholder-box"><h2>${v.title}</h2><p>${v.content}</p></div>`;
            }
        } else if (v.id === 'view-app-manager') {
            div.innerHTML = `
                <div class="container">
                    <div class="content">
                        <div class="placeholder-box" style="padding-bottom: 0;"><h2>App Lists</h2></div>
                        <div id="appList" class="app-list-container" style="padding-bottom: 80px;">
                            <div class="placeholder-box">Loading config...</div>
                        </div>
                    </div>
                    <button class="fab-add" onclick="openAddAppModal()">+</button>
                </div>
                
                <!-- Modal -->
                <div class="modal-overlay" id="appModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="modal-title" id="modalAppName">App Settings</div>
                            <button class="modal-close" onclick="closeAppModal()">×</button>
                        </div>
                        <div style="margin-bottom: 12px; font-size: 12px; color: #888;" id="modalPkgName"></div>
                        
                        <div style="font-size: 13px; margin-bottom: 8px; color: #ccc;">Select Mode</div>
                        <div class="segmented-control">
                            <button class="segment-btn" onclick="setAppMode('gaming')" id="btn-gaming">Gaming</button>
                            <button class="segment-btn" onclick="setAppMode('gaming2')" id="btn-gaming2">Gaming Plus</button>
                            <button class="segment-btn" onclick="setAppMode('performance')" id="btn-performance">Performance</button>
                        </div>
                        <button class="btn-block btn-danger" onclick="removeCurrentApp()">Remove from List</button>
                    </div>
                </div>

                <!-- Add Modal -->
                <div class="modal-overlay" id="addAppModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="modal-title">Add Game/App</div>
                            <button class="modal-close" onclick="closeAddAppModal()">×</button>
                        </div>
                        <input type="text" id="newPkgInput" class="modal-input" placeholder="com.example.game">
                        
                        <div style="font-size: 13px; margin-bottom: 8px; color: #ccc;">Select Mode</div>
                        <div class="segmented-control">
                            <button class="segment-btn" onclick="selectAddMode('gaming')" id="add-btn-gaming">Gaming</button>
                            <button class="segment-btn" onclick="selectAddMode('gaming2')" id="add-btn-gaming2">Gaming Plus</button>
                            <button class="segment-btn active" onclick="selectAddMode('performance')" id="add-btn-performance">Performance</button>
                        </div>
                        <div style="margin-bottom: 16px;"></div>

                        <button class="btn-block" onclick="saveNewApp()">Add to List</button>
                    </div>
                </div>
            `;
            setTimeout(loadAppsFromConfig, 500);
        } else {
            div.innerHTML = `<div class="placeholder-box"><h2>${v.title}</h2><p>${v.content}</p></div>`;
        }
        
        document.body.appendChild(div);
    });

    // Nav
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    
    const menuContainer = document.createElement('div');
    menuContainer.className = 'nav-menu-container';
    
    const fab = document.createElement('div');
    fab.className = 'floating-nav-btn';
    fab.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    
    function toggleMenu() {
        if (menuContainer.classList.contains('open')) {
            menuContainer.classList.remove('open');
            backdrop.classList.remove('open');
        } else {
            menuContainer.classList.add('open');
            backdrop.classList.add('open');
        }
    }

    fab.onclick = toggleMenu;
    backdrop.onclick = toggleMenu;
    
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>' },
        { id: 'tweak', label: 'Tweaks', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>' },
        { id: 'app-manager', label: 'Apps', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>' }
    ];

    navItems.forEach(item => {
        const navEl = document.createElement('div');
        navEl.className = `nav-menu-item ${item.id === 'dashboard' ? 'active' : ''}`;
        navEl.onclick = () => {
            // Nav switch
            document.querySelectorAll('.nav-menu-item').forEach(n => n.classList.remove('active'));
            navEl.classList.add('active');
            // View switch
            document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
            document.getElementById(`view-${item.id}`).classList.add('active');
            // Close
            toggleMenu();
        };
        navEl.innerHTML = `<span class="menu-item-icon">${item.icon}</span><span>${item.label}</span>`;
        menuContainer.appendChild(navEl);
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(fab);
    document.body.appendChild(menuContainer);

    // Flush modal
    const flushModal = document.createElement('div');
    flushModal.id = 'flushModal';
    flushModal.className = 'modal-overlay';
    flushModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">Flush RAM & Cached RAM</div>
                <button class="modal-close" onclick="closeFlushModal()">×</button>
            </div>
            <div style="margin-bottom: 24px; color: #ccc; font-size: 14px;">Do you want to flush RAM?</div>
            <div style="display: flex; gap: 12px;">
                <button class="btn-block" style="background: transparent; border: 1px solid #555; color: #ccc;" onclick="closeFlushModal()">No</button>
                <button class="btn-block" onclick="confirmFlush()">Yes</button>
            </div>
        </div>
    `;
    document.body.appendChild(flushModal);
}

function checkAutdMethod() {
    const element = document.getElementById('autdAwakeMethod');
    if (!element) return;

    try {
        if (typeof ksu !== 'undefined') {
            const path = '/data/data/com.xandroid.booster/files/autd_awake_method.info';
            const content = ksu.exec(`cat '${path}'`);
            
            if (content && content.trim().length > 0 && !content.includes('No such file')) {
                element.textContent = content.trim();
            } else {
                element.textContent = "Daemon info unavailable";
                element.style.color = "#ef4444";
            }
        }
    } catch (e) {
        console.log("Autd check failed: " + e);
    }
}

function generateToggleHtml(title, icon, idBase) {
    return `
    <div class="bypass-control">
        <div class="bypass-header">
            <div class="bypass-icon">${icon}</div>
            <h3>${title}</h3>
        </div>
        <div class="bypass-toggle" id="${idBase}Toggle">
            <div class="toggle-label" id="${idBase}Label">...</div>
            <div class="toggle-track" id="${idBase}Track"><div class="toggle-thumb"></div></div>
        </div>
    </div>`;
}

function initGameOptLogic() {
    const toggle = document.getElementById('gameOptToggle');
    const track = document.getElementById('gameOptTrack');
    const label = document.getElementById('gameOptLabel');
    const PATH = '/data/data/com.xandroid.booster/files/autd_opt_allow';

    if (!toggle) return;

    const updateUI = (isOn) => {
        if (isOn) {
            track.classList.add('on');
            label.textContent = "ON";
            label.style.color = "#10b981";
        } else {
            track.classList.remove('on');
            label.textContent = "OFF";
            label.style.color = "#dc2626";
        }
    };

    const check = () => {
        try {
            if (typeof ksu !== 'undefined') {
                const res = ksu.exec(`cat '${PATH}'`);
                updateUI(res.trim() === '1');
            }
        } catch(e) { console.error(e); }
    };

    toggle.onclick = () => {
        const isOn = track.classList.contains('on');
        const newState = isOn ? '0' : '1';
        updateUI(!isOn);
        try {
            if (typeof ksu !== 'undefined') {
                ksu.exec(`echo "${newState}" > '${PATH}'`);
                setTimeout(check, 100);
            }
        } catch(e) {
            console.error(e);
            updateUI(isOn);
        }
    };

    check();
}

// App logic

let currentModalPkg = '';

function loadAppsFromConfig() {
    const list = document.getElementById('appList');
    if (!list) return;
    
    if (typeof ksu === 'undefined') {
        list.innerHTML = '<div class="placeholder-box">Root access required</div>';
        return;
    }

    setTimeout(() => {
        try {
            // Read config
            const path = '/data/data/com.xandroid.booster/files/applist';
            const content = ksu.exec(`cat '${path}' | tr '\\n' '|'`) || '';

            // Parse
            const lines = content.split('|')
                                 .map(l => l.trim())
                                 .filter(l => l && l.length > 2 && !l.startsWith('#')); // Validate

            renderApps(lines);
        } catch(e) {
            list.innerHTML = `<div class="placeholder-box">Error: ${e}</div>`;
        }
    }, 100);
}

function initDaemonConnector() {
    // Hook profile
    const maxRetries = 20;
    let attempts = 0;

    const hook = setInterval(() => {
        if (typeof window.switchProfile === 'function') {
            clearInterval(hook);
            const originalSwitchProfile = window.switchProfile;
            
            window.switchProfile = function(profileName) {
                originalSwitchProfile.apply(this, arguments);

                // Sync daemon
                if (this && this.classList && this.classList.contains('disabled')) return;

                // Skip cleaner
                if (typeof ksu !== 'undefined' && profileName !== 'cachecleaner') {
                    const BASE = '/data/data/com.xandroid.booster/files/autd_base_mode';
                    const STATUS = '/data/data/com.xandroid.booster/files/autd_status';
                    try {
                        ksu.exec(`echo "${profileName}" > '${BASE}'; echo "${profileName}" > '${STATUS}'`);
                    } catch (e) { console.error("Daemon sync error: " + e); }
                }
            };
        } else if (++attempts >= maxRetries) {
            clearInterval(hook);
        }
    }, 100);

    // Poll status
    setInterval(() => {
        if (typeof ksu !== 'undefined') {
            try {
                const STATUS = '/data/data/com.xandroid.booster/files/autd_status';
                const active = ksu.exec(`cat '${STATUS}'`).trim();
                
                if (active) {
                    const cards = document.querySelectorAll('.profile-card');
                    cards.forEach(card => {
                        if (card.classList.contains('disabled')) return;
                        const profile = card.getAttribute('data-profile');
                        const status = card.querySelector('.profile-status');
                        
                        // Skip loading
                        if (card.classList.contains('loading')) return;

                        if (profile === active) {
                            if (!card.classList.contains('active')) {
                                card.classList.add('active');
                                if (status) status.textContent = "Active";
                            }
                        } else {
                            if (card.classList.contains('active')) {
                                card.classList.remove('active');
                                if (status) status.textContent = "Tap to activate";
                            }
                        }
                    });
                }
            } catch (e) { }
        }
    }, 1000);
}

// RAM logic

function generateRamMonitorHtml() {
    return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 15px; font-weight: 500;">RAM</h3>
        <div id="ramPercent" style="font-size: 13px; color: #ccc; font-family: monospace;">used: --%</div>
    </div>
    <div style="background: #333; height: 16px; border-radius: 8px; overflow: hidden; margin-bottom: 12px; border: 1px solid #444;">
        <div id="ramBar" style="background: #3b82f6; width: 0%; height: 100%; transition: width 0.5s ease;"></div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #888; margin-bottom: 16px; font-family: monospace;">
        <span id="ramUsed">Used: -- MB</span>
        <span id="ramFree">Free: -- MB</span>
    </div>
    <button id="btnFlushRam" onclick="openFlushModal()" class="btn-block" style="display: flex; justify-content: space-between; align-items: center; background: #2a2a2a; border: 1px solid #333;">
        <span style="color: #ccc;">Flush RAM & Cached RAM</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </button>
    `;
}

let ramInterval;
function initRamMonitor() {
    if (ramInterval) clearInterval(ramInterval);
    updateRamStats();
    ramInterval = setInterval(updateRamStats, 2000);
}

function updateRamStats() {
    if (typeof ksu === 'undefined') return;
    try {
        const totalStr = ksu.exec("grep MemTotal /proc/meminfo | awk '{print $2}'").trim();
        const availStr = ksu.exec("grep MemAvailable /proc/meminfo | awk '{print $2}'").trim();

        if (!totalStr || !availStr) {
            return;
        }

        const totalKB = parseInt(totalStr);
        const availableKB = parseInt(availStr);

        // Calc
        const usedKB = totalKB - availableKB;
        const usedMB = Math.round(usedKB / 1024);
        const freeMB = Math.round(availableKB / 1024);
        const percent = Math.round((usedKB / totalKB) * 100);
        
        // UI update
        const bar = document.getElementById('ramBar');
        if (bar) bar.style.width = percent + '%';
        
        document.getElementById('ramPercent').textContent = 'used: ' + percent + '%';
        document.getElementById('ramUsed').textContent = 'Used: ' + usedMB + ' MB';
        document.getElementById('ramFree').textContent = 'Free: ' + freeMB + ' MB';

    } catch (e) {
        console.error("RAM Error: " + e);
    }
}

function openFlushModal() {
    document.getElementById('flushModal').classList.add('active');
}

function closeFlushModal() {
    document.getElementById('flushModal').classList.remove('active');
}

function confirmFlush() {
    closeFlushModal();
    if (typeof ksu !== 'undefined') {
        try {
            const cmd = "sync; echo 3 > /proc/sys/vm/drop_caches; EXCLUDE='kernel|ksu|webui|android|termux|launcher|io.github.a13e300.ksuwebui'; for pkg in $(pm list packages -3 | cut -d':' -f2); do if ! echo \"$pkg\" | grep -iqE \"$EXCLUDE\"; then am force-stop \"$pkg\"; fi; done &";
            ksu.exec(cmd);
            showToast('♻️ Flushing RAM...', false);
            
            // Refresh UI
            setTimeout(updateRamStats, 500);
            setTimeout(updateRamStats, 1500);
            setTimeout(updateRamStats, 3000);
        } catch (e) {
            showToast('Error executing flush', true);
        }
    }
}

function renderApps(lines) {
    const list = document.getElementById('appList');
    list.innerHTML = '';
    
    if (lines.length === 0) {
        list.innerHTML = '<div class="placeholder-box">No apps in list.<br>Click + to add.</div>';
        return;
    }

    // Sort
    lines.sort();

    lines.forEach(line => {
        // Parse line
        let pkg = line;
        let mode = 'p'; // Default
        
        if (line.endsWith('_g2')) {
            pkg = line.substring(0, line.length - 3);
            mode = 'g2';
        } else if (line.endsWith('_g')) {
            pkg = line.substring(0, line.length - 2);
            mode = 'g';
        } else if (line.endsWith('_p')) {
            pkg = line.substring(0, line.length - 2);
            mode = 'p';
        }
        
        const controllerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4"/><path d="M8 10v4"/><path d="M15 13h.01"/><path d="M18 11h.01"/></svg>`;
        
        const card = document.createElement('div');
        card.className = 'app-card';
        card.onclick = () => openAppModal(pkg, pkg, mode);
        
        let badgeHtml = '';
        if (mode) {
            let label = mode === 'g' ? 'Gaming' : (mode === 'g2' ? 'Gaming+' : 'Perf');
            let color = mode === 'g' ? '#f59e0b' : (mode === 'g2' ? '#ef4444' : '#3b82f6');
            badgeHtml = `<div class="app-mode-badge" style="color: ${color}">${label}</div>`;
        }

        card.innerHTML = `
            <div class="app-icon-placeholder">${controllerIcon}</div>
            <div class="app-info">
                <div class="app-name" style="font-family: monospace; font-size: 14px;">${pkg}</div>
            </div>
            ${badgeHtml}
        `;
        list.appendChild(card);
    });
}

function readAppListConfig() {
    try {
        return ksu.exec('cat /data/data/com.xandroid.booster/files/applist') || '';
    } catch(e) { return ''; }
}

function getAppModeFromConfig(content, pkg) {
    if (content.includes(pkg + '_g2')) return 'g2';
    if (content.includes(pkg + '_g')) return 'g';
    if (content.includes(pkg + '_p')) return 'p';
    return null;
}

function openAppModal(pkg, name, currentMode) {
    currentModalPkg = pkg;
    document.getElementById('modalAppName').textContent = name;
    document.getElementById('modalPkgName').textContent = pkg;
    document.getElementById('appModal').classList.add('active');
    
    const mode = currentMode || 'p'; 
    
    ['gaming', 'gaming2', 'performance'].forEach(m => {
        document.getElementById('btn-' + m).classList.remove('active');
    });
    
    let map = { 'g': 'gaming', 'g2': 'gaming2', 'p': 'performance' };
    let id = map[mode] || 'performance';
    document.getElementById('btn-' + id).classList.add('active');
}

function closeAppModal() {
    document.getElementById('appModal').classList.remove('active');
    loadAppsFromConfig(); 
}

function setAppMode(modeName) {
    const suffixMap = { 'gaming': '_g', 'gaming2': '_g2', 'performance': '_p' };
    const suffix = suffixMap[modeName];
    const pkg = currentModalPkg;
    const path = '/data/data/com.xandroid.booster/files/applist';

    // Update UI
    ['gaming', 'gaming2', 'performance'].forEach(m => document.getElementById('btn-' + m).classList.remove('active'));
    document.getElementById('btn-' + modeName).classList.add('active');

    try {
        ksu.exec(`sed -i "/^${pkg}_/d" '${path}'; echo "${pkg}${suffix}" >> '${path}'; sed -i '/^$/d' '${path}'`);
    } catch(e) { console.error(e); }
}

// Add/Remove

let addAppMode = 'performance';

function selectAddMode(mode) {
    addAppMode = mode;
    ['gaming', 'gaming2', 'performance'].forEach(m => {
        const btn = document.getElementById('add-btn-' + m);
        if(btn) {
             if (m === mode) btn.classList.add('active');
             else btn.classList.remove('active');
        }
    });
}

function showToast(message, isError = false) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = 'toast show ' + (isError ? 'error' : 'success');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function openAddAppModal() {
    document.getElementById('newPkgInput').value = '';
    document.getElementById('addAppModal').classList.add('active');
    selectAddMode('performance');
}

function closeAddAppModal() {
    document.getElementById('addAppModal').classList.remove('active');
}

function saveNewApp() {
    const input = document.getElementById('newPkgInput');
    const pkg = input.value.trim();
    if (!pkg) return;
    
    const path = '/data/data/com.xandroid.booster/files/applist';
    
    const suffixMap = { 'gaming': '_g', 'gaming2': '_g2', 'performance': '_p' };
    const suffix = suffixMap[addAppMode] || '_p';

    try {
        const check = ksu.exec(`grep -q "^${pkg}_" '${path}' && echo "EXISTS" || echo "NOT_FOUND"`);
        if (check && check.trim() === "EXISTS") {
            showToast("App already exists!", true);
            return;
        }

        // Save
        ksu.exec(`echo "" >> '${path}'; echo "${pkg}${suffix}" >> '${path}'; sed -i '/^$/d' '${path}'`);
        closeAddAppModal();
        loadAppsFromConfig();
        showToast(`Added ${pkg} successfully!`, false);
    } catch(e) {
        showToast("Error adding app: " + e, true);
    }
}

function removeCurrentApp() {
    // Validate
    const pkg = currentModalPkg;
    if (!pkg) {
        showToast("Error: No package selected", true);
        closeAppModal();
        return;
    }
    
    // Close UI
    closeAppModal();

    const path = '/data/data/com.xandroid.booster/files/applist';
    
    // Background remove
    setTimeout(() => {
        try {
            // Remove logic
            
            const cmd = `grep -v "^${pkg}_" '${path}' | grep -v "^${pkg}$" > '${path}.tmp' && mv '${path}.tmp' '${path}'`;
            
            ksu.exec(cmd);
            showToast(`Removed ${pkg}`, false);
            
            // Refresh
            setTimeout(loadAppsFromConfig, 200);
            
        } catch(e) {
            showToast("Delete failed: " + e, true);
        }
    }, 100);
}