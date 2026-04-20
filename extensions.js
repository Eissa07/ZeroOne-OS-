// ==================== ZeroOne OS - ملف الإضافات (نسخة متطورة) ====================
// يدعم: اللمس، تغيير حجم النوافذ، وتحسينات الموبايل.

(function() {
    const waitForOS = setInterval(() => {
        if (window.ZeroOneOS && window.ZeroOneOS.scene) {
            clearInterval(waitForOS);
            initExtensions();
        }
    }, 100);

    // دالة سحب محسنة (للأندرويد)
    function makeDraggable(element, objectToDrag) {
        let isDragging = false, startX = 0, startY = 0, startPos = { x: 0, y: 0 };
        function onDragStart(e) {
            e.preventDefault();
            isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            startX = clientX; startY = clientY;
            startPos.x = objectToDrag.position.x;
            startPos.y = objectToDrag.position.y;
            element.style.cursor = 'grabbing';
        }
        function onDragMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            objectToDrag.position.x = startPos.x + (clientX - startX) * 0.01;
            objectToDrag.position.y = startPos.y - (clientY - startY) * 0.01;
        }
        function onDragEnd(e) { isDragging = false; element.style.cursor = 'grab'; }
        element.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);
        element.addEventListener('touchstart', onDragStart, { passive: false });
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('touchend', onDragEnd);
    }

    // دالة إضافة أزرار التحكم بالحجم لأي نافذة
    function addResizeControls(headerElement, labelObject, baseScale = 1.0) {
        const scaleStep = 0.2;
        
        const btnPlus = document.createElement('span');
        btnPlus.textContent = '➕';
        btnPlus.style.cssText = 'margin-left:10px; cursor:pointer; font-size:1.2rem;';
        btnPlus.addEventListener('click', (e) => {
            e.stopPropagation();
            labelObject.scale.set(labelObject.scale.x + scaleStep, labelObject.scale.y + scaleStep, 1);
        });
        btnPlus.addEventListener('touchstart', (e) => e.stopPropagation());
        
        const btnMinus = document.createElement('span');
        btnMinus.textContent = '➖';
        btnMinus.style.cssText = 'margin-left:5px; cursor:pointer; font-size:1.2rem;';
        btnMinus.addEventListener('click', (e) => {
            e.stopPropagation();
            const newScale = Math.max(0.4, labelObject.scale.x - scaleStep);
            labelObject.scale.set(newScale, newScale, 1);
        });
        btnMinus.addEventListener('touchstart', (e) => e.stopPropagation());
        
        headerElement.appendChild(btnPlus);
        headerElement.appendChild(btnMinus);
    }

    function initExtensions() {
        console.log('🧩 تحميل الإضافات المتطورة...');
        const { showMessage, addControlButton, scene } = window.ZeroOneOS;

        // ===== تحسين لوحة التحكم للموبايل =====
        const panel = document.getElementById('controls-panel');
        if (panel && window.innerWidth < 768) {
            panel.style.padding = '16px 12px';
            panel.style.gap = '12px';
            document.querySelectorAll('.ctrl-btn').forEach(btn => {
                btn.style.padding = '14px 20px';
                btn.style.fontSize = '22px';
            });
        }

        // ===== زر تحية =====
        addControlButton('👋 تحية', () => {
            showMessage('مرحباً بك في نظام ZeroOne OS!');
        }, 'اضغط للترحيب');

        // ===== نافذة "عن المطور" (مع أزرار حجم) =====
        addControlButton('ℹ️ عني', () => {
            createAboutWindow();
        }, 'معلومات عن المطور');

        function createAboutWindow() {
            const div = document.createElement('div');
            div.style.cssText = `
                background: rgba(10,20,30,0.95); color: #ffaa00; font-family: 'Cairo', sans-serif;
                padding: 20px; border-radius: 16px; border: 1px solid #ffaa00;
                backdrop-filter: blur(12px); width: 300px; box-shadow: 0 0 40px #ffaa0033;
            `;
            div.innerHTML = `
                <div id="aboutWinHeader" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; cursor:grab; border-bottom:1px solid #3a5a7a; padding-bottom:10px;">
                    <span style="font-weight:bold; font-size:1.3rem; color:#00ffcc;">ℹ️ عن المطور</span>
                    <div style="display:flex; align-items:center;">
                        <span style="cursor:pointer; color:#ffaa00; font-size:1.5rem;" id="closeAboutWin">✕</span>
                    </div>
                </div>
                <div style="text-align:center;">
                    <p style="color:#fff;">🥷 المهندس: <strong style="color:#ffaa00;">عيسى علي مصطفى</strong></p>
                    <p style="color:#ddd; font-size:0.9rem;">هذا النظام هو اللبنة الأولى في ثورة كلمات المرور والتشفير. تم البناء بالتعاون مع DeepSeek AI.</p>
                    <p style="color:#00ffcc; margin-top:20px;">✨ "هكذا تبدأ الأساطير" ✨</p>
                </div>
            `;
            
            const label = new THREE.CSS2DObject(div);
            label.position.set(0, 2.5, 3.5);
            scene.add(label);
            
            const header = div.querySelector('#aboutWinHeader');
            makeDraggable(header, label);
            addResizeControls(header, label);
            
            div.querySelector('#closeAboutWin').addEventListener('click', () => scene.remove(label));
            div.querySelector('#closeAboutWin').addEventListener('touchstart', (e) => {
                e.preventDefault();
                scene.remove(label);
            });
            
            showMessage('ℹ️ نافذة "عن المطور" مفتوحة');
        }

        // ===== إصلاح النوافذ الأساسية =====
        function fixCoreWindows() {
            // SYSTEM INFO
            const sysWin = Array.from(scene.children).find(c => c.isCSS2DObject && c.element?.querySelector?.('#closeSysWin'));
            if (sysWin) {
                const header = sysWin.element.querySelector('div');
                if (header) {
                    makeDraggable(header, sysWin);
                    addResizeControls(header, sysWin);
                }
            }
            
            // AI TERMINAL
            const aiWin = Array.from(scene.children).find(c => c.isCSS2DObject && c.element?.querySelector?.('#closeAIWin'));
            if (aiWin) {
                const header = aiWin.element.querySelector('div');
                if (header) {
                    makeDraggable(header, aiWin);
                    addResizeControls(header, aiWin);
                }
            }
            
            // VAULT EXPLORER (عند إنشائه)
            setTimeout(() => {
                const vaultWin = Array.from(scene.children).find(c => c.isCSS2DObject && c.element?.querySelector?.('#closeVaultWin'));
                if (vaultWin) {
                    const header = vaultWin.element.querySelector('div');
                    if (header) {
                        makeDraggable(header, vaultWin);
                        addResizeControls(header, vaultWin);
                    }
                }
            }, 1500);
        }

        setTimeout(fixCoreWindows, 2000);
        window.ZeroOneOS.showMessage('🧩 الإضافات المتطورة جاهزة');
    }
})();
