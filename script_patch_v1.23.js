<script>
(function() {
    // --- 1. LOGIQUE ET STYLE DU MASTER SWITCH ---
    var STORAGE_KEY_MASTER = 'snap_patch_master_active';
    var isPatchActive = localStorage.getItem(STORAGE_KEY_MASTER) !== 'false';

    var globalStyle = document.createElement('style');
    globalStyle.innerHTML = `
        /* Style du Switch */
        .snap-switch { position: relative; display: inline-block; width: 40px; height: 22px; vertical-align: middle; }
        .snap-switch input { opacity: 0; width: 0; height: 0; }
        .snap-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
        .snap-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        input:checked + .snap-slider { background-color: #4CAF50; }
        input:checked + .snap-slider:before { transform: translateX(18px); }
        
        /* Style du Conteneur "Bulle" */
        #snap-master-container {
            position: fixed; top: 10px; right: 10px; z-index: 9999999;
            background: white; padding: 6px 15px; border-radius: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            font-family: 'Segoe UI', sans-serif; font-size: 13px; font-weight: bold; color: #444;
            display: flex; align-items: center; gap: 10px;
            border: 2px solid ${isPatchActive ? '#4CAF50' : '#9E9E9E'}; 
            transition: all 0.3s ease;
        }
        #snap-master-container:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,0.2); }
    `;
    document.head.appendChild(globalStyle);

    var masterBtn = document.createElement('div');
    masterBtn.id = 'snap-master-container';
    masterBtn.innerHTML = `
        <span id="master-label">Patch v1.23</span>
        <label class="snap-switch">
            <input type="checkbox" id="chk-master" ${isPatchActive ? 'checked' : ''}>
            <span class="snap-slider"></span>
        </label>
    `;
    document.body.appendChild(masterBtn);

    // --- ACTION AU CLIC ---
    document.getElementById('chk-master').addEventListener('change', function(e) {
        var isChecked = e.target.checked;
        localStorage.setItem(STORAGE_KEY_MASTER, isChecked);
        
        var label = document.getElementById('master-label');
        label.innerText = "Chargement...";
        label.style.color = "#666";
        masterBtn.style.borderColor = "#ccc";
        masterBtn.style.background = "#f9f9f9";

        setTimeout(function(){ window.location.reload(); }, 500); 
    });

    if (!isPatchActive) {
        console.log("💤 Patch v1.23 inactif.");
        return; 
    }

    // --- DÉBUT DU CŒUR DU PATCH (v1.23) ---
    console.log("🚀 Chargement du Patch v1.23...");

    // --- MASQUAGE DU BOUTON D'ORIGINE ---
    var hideStyle = document.createElement('style');
    hideStyle.innerHTML = `
        /* Cache la div contenant le vieux bouton buggé */
        .download-all-container, #download-all-container { 
            display: none !important; 
        }
    `;
    document.head.appendChild(hideStyle);

    function applyVisualStamp() {
        var style = document.createElement('style');
        style.innerHTML = `
            .ghost-wrapper { position: relative; display: table; margin: 0 auto; }
            .patch-label {
                position: absolute; bottom: 0px; right: -10px;
                transform: rotate(-15deg);
                border: 3px solid #d00000; color: #d00000;
                background-color: rgba(255, 255, 255, 0.95);
                padding: 4px 8px; border-radius: 4px;
                font-family: 'Courier New', Courier, monospace;
                font-weight: 900; text-transform: uppercase;
                text-align: center; line-height: 1.1;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                pointer-events: none; z-index: 100;
                white-space: nowrap; font-size: 14px;
            }
            .patch-version { display: block; font-size: 0.6em; color: #000; margin-top: 1px; }
        `;
        document.head.appendChild(style);

        var ghostImg = document.querySelector('img.ghost');
        if (ghostImg && !ghostImg.parentElement.classList.contains('ghost-wrapper')) {
            var wrapper = document.createElement('div');
            wrapper.className = 'ghost-wrapper';
            ghostImg.parentNode.insertBefore(wrapper, ghostImg);
            wrapper.appendChild(ghostImg);
            
            var label = document.createElement('div');
            label.className = 'patch-label';
            label.innerHTML = 'PATCHED<span class="patch-version">v1.23</span>';
            wrapper.appendChild(label);
            ghostImg.style.margin = '0';
        }
    }

    window.SnapPatcher = {
        config: { delay: 1000, autoScroll: true },
        stats: { success: 0, fail: 0 },
        state: { isPaused: false, isRunning: false, queue: [], currentIndex: 0, downloadedUrls: [], totalOnPage: 0 },

        loadMemory: function() {
            var s = localStorage.getItem('snap_v15_stats'); if (s) this.stats = JSON.parse(s);
            var u = localStorage.getItem('snap_v15_urls'); if (u) this.state.downloadedUrls = JSON.parse(u);
            this.restoreVisuals(); this.initQueue(false); 
        },
        saveMemory: function() {
            localStorage.setItem('snap_v15_stats', JSON.stringify(this.stats));
            localStorage.setItem('snap_v15_urls', JSON.stringify(this.state.downloadedUrls));
        },
        restoreVisuals: function() {
            var self = this;
            document.querySelectorAll('a').forEach(function(l) {
                var c = l.getAttribute('onclick');
                if (c && c.includes('downloadMemories')) {
                    var m = c.match(/'(https:\/\/[^']+)'/);
                    if (m && self.state.downloadedUrls.includes(m[1])) {
                        l.innerText = "Déjà fait ✓"; l.style.color = "#4CAF50"; l.style.pointerEvents = "none"; l.style.opacity = "0.6";
                    }
                }
            });
        },

        initQueue: function(resetIndex = true) {
            var links = document.querySelectorAll('a'); this.state.queue = []; this.state.totalOnPage = 0; var self = this;
            links.forEach(function(l) {
                var c = l.getAttribute('onclick');
                if (c && c.includes('downloadMemories')) {
                    var m = c.match(/'(https:\/\/[^']+)'/);
                    if (m) {
                        self.state.totalOnPage++; 
                        var alreadyDone = self.state.downloadedUrls.includes(m[1]) || l.innerText.includes("Déjà") || l.innerText.includes("OK");
                        if (!alreadyDone) { self.state.queue.push({ element: l, url: m[1] }); }
                    }
                }
            });
            if(resetIndex) this.state.currentIndex = 0;
            this.updateUI(); 
        },

        processNext: function() {
            if (this.state.isPaused || !this.state.isRunning) return;
            this.updateUI();
            if (this.state.currentIndex >= this.state.queue.length) {
                alert("✅ Terminé !"); this.state.isRunning = false; this.updateButton("Terminé", "#9E9E9E"); return;
            }
            var item = this.state.queue[this.state.currentIndex];
            if (this.state.downloadedUrls.includes(item.url)) { this.state.currentIndex++; this.processNext(); return; }
            var self = this;
            window.downloadMemoriesSequential(item.url, item.element, true, function() { self.onItemComplete(); });
        },
        onItemComplete: function() {
            this.state.currentIndex++; this.updateUI(); 
            if (!this.state.isPaused && this.state.isRunning) {
                var self = this; setTimeout(function() { self.processNext(); }, this.config.delay);
            }
        },

        toggleStartPause: function() {
            if (!this.state.isRunning && !this.state.isPaused) {
                this.initQueue(true); 
                if (this.state.queue.length === 0) { alert("✅ Terminé !"); return; }
                this.state.isRunning = true; this.updateButton("⏸️ Pause", "#FF9800"); this.processNext();
            } else if (!this.state.isPaused) {
                this.state.isPaused = true; this.updateButton("▶️ Reprendre", "#2196F3");
            } else {
                this.state.isPaused = false; this.updateButton("⏸️ Pause", "#FF9800"); this.processNext();
            }
        },
        hardReset: function() {
            if (!confirm("⚠️ Effacer l'état de la progression et recharger la page ?")) return;
            localStorage.removeItem('snap_v15_stats'); localStorage.removeItem('snap_v15_urls'); localStorage.removeItem('memories_downloaded_files');
            window.location.reload();
        },
        updateButton: function(t, c) { var b = document.getElementById('btn-action-main'); if(b) { b.innerText = t; b.style.backgroundColor = c; } },
        setSpeed: function(v) { this.config.delay = parseInt(v); },
        toggleScroll: function(c) { this.config.autoScroll = c; },
        
        updateUI: function() {
            var s = document.getElementById('p-succ'), f = document.getElementById('p-fail');
            if(s) s.innerText = this.stats.success; 
            if(f) {
                f.innerText = this.stats.fail;
                var lblFail = document.getElementById('label-fail');
                if (lblFail) {
                    lblFail.innerText = (this.stats.fail >= 2) ? "ERREURS" : "ERREUR";
                }
            }
            var total = this.state.totalOnPage;
            var alreadyDoneBeforeSession = total - this.state.queue.length;
            var currentTotalDone = alreadyDoneBeforeSession + this.state.currentIndex;
            if (currentTotalDone > total) currentTotalDone = total; if (total === 0) total = 1; 
            var pct = (currentTotalDone / total) * 100;
            var barFill = document.getElementById('prog-fill');
            var barText = document.getElementById('prog-text');
            if (barFill) barFill.style.width = pct + "%";
            if (barText) barText.innerText = currentTotalDone + " / " + total + " (" + Math.round(pct) + "%)";
        }
    };

    function createDashboard() {
        if (document.getElementById('snap-patch-dash')) return;
        var d = document.createElement('div');
        d.id = 'snap-patch-dash';
        d.style.cssText = "position:fixed; bottom:20px; left:20px; width:280px; background:rgba(20,20,20,0.95); color:white; border-radius:12px; padding:15px; z-index:999998; font-family:'Segoe UI', sans-serif; box-shadow:0 10px 40px rgba(0,0,0,0.6); border:1px solid #444; cursor:grab; backdrop-filter: blur(5px);";
        
        var style = `
            <style>
                .snap-switch { position: relative; display: inline-block; width: 40px; height: 22px; margin-left: 10px; vertical-align: middle; }
                .snap-switch input { opacity: 0; width: 0; height: 0; }
                .snap-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555; transition: .4s; border-radius: 34px; }
                .snap-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .snap-slider { background-color: #2196F3; }
                input:checked + .snap-slider:before { transform: translateX(18px); }
                .dash-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                .prog-container { background: #333; height: 12px; border-radius: 6px; overflow: hidden; margin-bottom: 15px; position: relative; border: 1px solid #444; }
                .prog-fill { height: 100%; background: linear-gradient(90deg, #4CAF50, #2196F3); width: 0%; transition: width 0.3s ease; }
                .prog-label { display: flex; justify-content: space-between; font-size: 11px; color: #bbb; margin-bottom: 4px; font-weight: 600; }
            </style>
        `;

        d.innerHTML = style + `
            <div style="font-weight:700; border-bottom:1px solid #444; padding-bottom:10px; margin-bottom:15px; color:#FFFC00; letter-spacing:1px; cursor:grab;" id="dash-header">
                👻 Snapchat Memories Downloader
            </div>
            
            <div class="dash-row" style="text-align:center;">
                <div style="flex:1;"><div id="p-succ" style="font-size:24px; color:#4CAF50; font-weight:bold;">0</div><div style="font-size:10px; opacity:0.6;">SUCCÈS</div></div>
                <div style="flex:1; border-left:1px solid #444;"><div id="p-fail" style="font-size:24px; color:#FF5252; font-weight:bold;">0</div><div id="label-fail" style="font-size:10px; opacity:0.6;">ERREUR</div></div>
            </div>

            <div>
                <div class="prog-label">
                    <span>Progression</span>
                    <span id="prog-text" style="color:white;">0 / 0 (0%)</span>
                </div>
                <div class="prog-container">
                    <div id="prog-fill" class="prog-fill"></div>
                </div>
            </div>
            
            <div style="display:flex; gap:8px; margin-bottom:15px;">
                <button id="btn-action-main" onclick="window.SnapPatcher.toggleStartPause()" style="flex:2; padding:12px; cursor:pointer; background-color:#4CAF50; color:white; border:none; border-radius:6px; font-weight:bold; font-size:14px; transition:0.2s;">▶️ Démarrer</button>
                <button onclick="window.SnapPatcher.hardReset()" style="flex:1; padding:12px; cursor:pointer; background-color:#37474F; color:white; border:none; border-radius:6px; font-weight:bold;">🔄 Reset</button>
            </div>
            
            <div style="background:#2b2b2b; padding:10px; border-radius:6px; margin-bottom:15px;">
                <label style="font-size:11px; display:block; margin-bottom:6px; color:#aaa; font-weight:600;">VITESSE</label>
                <select onchange="window.SnapPatcher.setSpeed(this.value)" style="width:100%; padding:6px; background:#1a1a1a; color:white; border:1px solid #444; border-radius:4px; outline:none;">
                    <option value="1000" selected>🚀 Rapide (1s)</option>
                    <option value="3000">🐢 Lent (3s)</option>
                    <option value="5000">🐌 Très lent (5s)</option>
                </select>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; background:#2b2b2b; padding:10px; border-radius:6px;">
                <span style="font-size:12px; color:#ddd;">🎯 Auto-Scroll</span>
                <label class="snap-switch">
                    <input type="checkbox" checked onchange="window.SnapPatcher.toggleScroll(this.checked)">
                    <span class="snap-slider"></span>
                </label>
            </div>
        `;
        document.body.appendChild(d);

        d.onmousedown = function(e) { 
            if(['BUTTON','SELECT','INPUT','LABEL','SPAN'].includes(e.target.tagName)) return;
            e.preventDefault(); var offX = e.clientX - d.offsetLeft; var offY = e.clientY - d.offsetTop; d.style.cursor = 'grabbing';
            document.onmousemove = function(ev) {
                ev.preventDefault();
                var newLeft = ev.clientX - offX; var newTop = ev.clientY - offY;
                var maxLeft = window.innerWidth - d.offsetWidth; var maxTop = window.innerHeight - d.offsetHeight;
                if (newLeft < 0) newLeft = 0; if (newTop < 0) newTop = 0; if (newLeft > maxLeft) newLeft = maxLeft; if (newTop > maxTop) newTop = maxTop;
                d.style.left = newLeft + 'px'; d.style.top = newTop + 'px'; d.style.bottom = 'auto'; d.style.right = 'auto';
            };
            document.onmouseup = function() { document.onmousemove = null; document.onmouseup = null; d.style.cursor = 'grab'; };
        };
        window.addEventListener('resize', function() {
            var rect = d.getBoundingClientRect();
            var maxLeft = window.innerWidth - d.offsetWidth; var maxTop = window.innerHeight - d.offsetHeight;
            if (rect.left > maxLeft) d.style.left = Math.max(0, maxLeft) + 'px';
            if (rect.top > maxTop) d.style.top = Math.max(0, maxTop) + 'px';
        });
    }

    window.downloadMemoriesSequential = function(url, linkElement, isGetRequest, callback) {
        var P = window.SnapPatcher; P.updateUI();
        linkElement.innerText = "⏳..."; linkElement.style.pointerEvents = "none";
        if (P.config.autoScroll) try { linkElement.scrollIntoView({behavior: "smooth", block: "center"}); } catch(e){}

        function ok(blob) {
            var u = window.URL.createObjectURL(blob), a = document.createElement("a");
            a.href = u; a.download = ""; a.style.display="none"; document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(u);
            linkElement.style.color="#4CAF50"; linkElement.innerText="OK ✓";
            P.stats.success++; P.state.downloadedUrls.push(url); P.saveMemory(); P.updateUI();
            if (callback) callback();
        }
        function fail(code) {
            var m = "HTTP " + code; if (typeof code === 'string' && !code.startsWith("HTTP")) m = (code==="Net")?"Erreur réseau":code;
            linkElement.innerText = "⚠️ " + m; linkElement.style.color = "#FFC107";
            P.stats.fail++; P.saveMemory(); P.updateUI();
            if (callback) callback();
        }

        fetch(url).then(r => { if(!r.ok) throw new Error(r.status); return r.blob(); }).then(b => ok(b))
        .catch(e => {
            try {
                var x = new XMLHttpRequest(); x.open("GET", url, true); x.setRequestHeader("X-Snap-Route-Tag", "mem-dmd"); x.responseType = 'blob';
                x.onload = function() { if(x.status===200) ok(x.response); else fail(x.status); };
                x.onerror = () => fail("Net"); x.send();
            } catch(z) { fail("Script"); }
        });
    };

    // --- LANCEMENT ---
    applyVisualStamp(); 
    createDashboard(); 
    window.SnapPatcher.loadMemory();
})();
</script>