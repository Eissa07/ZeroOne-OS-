// ==================== ZeroOne OS - ملف الإضافات (نسخة اللمس) ====================
// هذا الملف جاهز للعمل على أجهزة الموبايل (Android/iOS) التي تعمل باللمس.

(function() {
    const waitForOS = setInterval(() => {
        if (window.ZeroOneOS && window.ZeroOneOS.scene) {
            clearInterval(waitForOS);
            initExtensions();
        }
    }, 100);

    // دالة مساعدة لجعل أي عنصر قابل للسحب باللمس والفأرة
    function makeDraggable(element, objectToDrag) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let startPos = { x: 0, y: 0 };

        function onDragStart(e) {
            e.preventDefault();
            isDragging = true;
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            startX = clientX;
            startY = clientY;
            startPos.x = objectToDrag.position.x;
            startPos.y = objectToDrag.position.y;
            
            element.style.cursor = 'grabbing';
        }

        function onDragMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const dx = (clientX - startX) * 0.01;
            const dy = (clientY - startY) * 0.01;
            
            objectToDrag.position.x = startPos.x + dx;
            objectToDrag.position.y = startPos.y - dy;
        }

        function onDragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = 'grab';
        }

        // أحداث الفأرة
        element.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);
        
        // أحداث اللمس
        element.addEventListener('touchstart', onDragStart, { passive: false });
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('touchend', onDragEnd);
    }

    function initExtensions() {
        console.log('🧩 جاري تحميل الإضافات من extensions.js (نسخة اللمس)...');
        
        const { showMessage, addControlButton, scene, cssRenderer, camera, renderer } = window.ZeroOneOS;

        // ===== مثال 1: إضافة زر جديد إلى شريط التحكم السفلي =====
        addControlButton('👋 تحية', () => {
            showMessage('مرحباً بك في نظام ZeroOne OS!');
        }, 'اضغط للترحيب');

        // ===== مثال 2: إضافة نافذة جديدة "عن المطور" =====
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
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; cursor:grab; border-bottom:1px solid #3a5a7a; padding-bottom:10px;" id="aboutWinHeader">
                    <span style="font-weight:bold; font-size:1.3rem; color:#00ffcc;">ℹ️ عن المطور</span>
                    <span style="cursor:pointer; color:#ffaa00; font-size:1.5rem;" id="closeAboutWin">✕</span>
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
            
            // جعل النافذة قابلة للسحب باللمس
            const header = div.querySelector('#aboutWinHeader');
            makeDraggable(header, label);
            
            // زر الإغلاق
            div.querySelector('#closeAboutWin').addEventListener('click', () => {
                scene.remove(label);
            });
            
            // دعم اللمس على زر الإغلاق
            div.querySelector('#closeAboutWin').addEventListener('touchstart', (e) => {
                e.preventDefault();
                scene.remove(label);
            });
            
            showMessage('ℹ️ نافذة "عن المطور" مفتوحة');
        }

        // ===== إصلاح سحب النوافذ الأساسية للمس =====
        function fixCoreWindows() {
            // نافذة SYSTEM INFO
            const sysWin = Array.from(scene.children).find(c => c.isCSS2DObject && c.element?.querySelector?.('#closeSysWin'));
            if (sysWin) {
                const header = sysWin.element.querySelector('div');
                if (header) makeDraggable(header, sysWin);
            }
            
            // نافذة AI TERMINAL (إذا كانت موجودة)
            const aiWin = Array.from(scene.children).find(c => c.isCSS2DObject && c.element?.querySelector?.('#closeAIWin'));
            if (aiWin) {
                const header = aiWin.element.querySelector('div');
                if (header) makeDraggable(header, aiWin);
            }
            
            // نافذة VAULT EXPLORER (إذا كانت موجودة)
            const vaultWin = Array.from(scene.children).find(c => c.isCSS2DObject && c.element?.querySelector?.('#closeVaultWin'));
            if (vaultWin) {
                const header = vaultWin.element.querySelector('div');
                if (header) makeDraggable(header, vaultWin);
            }
        }

        // محاولة إصلاح النوافذ الأساسية بعد تحميلها
        setTimeout(fixCoreWindows, 2000);
        
        window.ZeroOneOS.showMessage('🧩 الإضافات جاهزة (تدعم اللمس)!');
    }
})();
