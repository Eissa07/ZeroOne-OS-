
// ==================== ZeroOne OS - ملف الإضافات ====================
// هذا هو المكان الوحيد الذي تحتاج لتعديله لإضافة مميزاتك الخاصة!
// كل ما عليك هو استخدام كائن window.ZeroOneOS للوصول إلى جميع وظائف النظام.

(function() {
    // انتظر حتى يتم تحميل النظام الأساسي بالكامل
    const waitForOS = setInterval(() => {
        if (window.ZeroOneOS && window.ZeroOneOS.scene) {
            clearInterval(waitForOS);
            initExtensions();
        }
    }, 100);

    function initExtensions() {
        console.log('🧩 جاري تحميل الإضافات من extensions.js...');
        
        // يمكنك استخدام أي دالة من النظام الأساسي بهذه الطريقة:
        const { showMessage, addControlButton, scene, createVaultExplorer } = window.ZeroOneOS;

        // ===== مثال 1: إضافة زر جديد إلى شريط التحكم السفلي =====
        addControlButton('👋 تحية', () => {
            showMessage('مرحباً بك في نظام ZeroOne OS!');
        }, 'اضغط للترحيب');

        // ===== مثال 2: إضافة نافذة جديدة "عن المطور" =====
        addControlButton('ℹ️ عني', () => {
            createAboutWindow();
        }, 'معلومات عن المطور');

        function createAboutWindow() {
            // إنشاء عنصر HTML للنافذة
            const div = document.createElement('div');
            div.style.cssText = `
                background: rgba(10,20,30,0.95); color: #ffaa00; font-family: 'Cairo', sans-serif;
                padding: 20px; border-radius: 16px; border: 1px solid #ffaa00;
                backdrop-filter: blur(12px); width: 300px; box-shadow: 0 0 40px #ffaa0033;
            `;
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; cursor:grab; border-bottom:1px solid #3a5a7a; padding-bottom:10px;">
                    <span style="font-weight:bold; font-size:1.3rem; color:#00ffcc;">ℹ️ عن المطور</span>
                    <span style="cursor:pointer; color:#ffaa00; font-size:1.5rem;" id="closeAboutWin">✕</span>
                </div>
                <div style="text-align:center;">
                    <p style="color:#fff;">🥷 المهندس: <strong style="color:#ffaa00;">عيسى علي مصطفى</strong></p>
                    <p style="color:#ddd; font-size:0.9rem;">هذا النظام هو اللبنة الأولى في ثورة كلمات المرور والتشفير. تم البناء بالتعاون مع DeepSeek AI.</p>
                    <p style="color:#00ffcc; margin-top:20px;">✨ "هكذا تبدأ الأساطير" ✨</p>
                </div>
            `;
            
            // استخدام CSS2DRenderer من النظام الأساسي
            const cssRenderer = window.ZeroOneOS.cssRenderer;
            const scene = window.ZeroOneOS.scene;
            const label = new THREE.CSS2DObject(div);
            label.position.set(0, 2.5, 3.5);
            
            // إضافة النافذة للمشهد
            scene.add(label);
            
            // جعل النافذة قابلة للسحب
            let dragging = false, startMouse = new THREE.Vector2(), startPos = label.position.clone();
            div.querySelector('div').addEventListener('mousedown', (e) => {
                dragging = true; div.querySelector('div').style.cursor = 'grabbing';
                startMouse.set(e.clientX, e.clientY); startPos.copy(label.position);
                e.stopPropagation();
            });
            window.addEventListener('mousemove', (e) => {
                if (!dragging) return;
                label.position.x = startPos.x + (e.clientX - startMouse.x) * 0.01;
                label.position.y = startPos.y - (e.clientY - startMouse.y) * 0.01;
            });
            window.addEventListener('mouseup', () => { dragging = false; div.querySelector('div').style.cursor = 'grab'; });
            
            // زر الإغلاق
            div.querySelector('#closeAboutWin').addEventListener('click', () => {
                scene.remove(label);
            });
            
            window.ZeroOneOS.showMessage('ℹ️ نافذة "عن المطور" مفتوحة');
        }

        // يمكنك إضافة أي عدد من الأزرار والوظائف هنا...
        // addControlButton('🔒 خزنتي', () => { window.ZeroOneOS.createVaultExplorer(); }, 'فتح الخزنة');
        
        window.ZeroOneOS.showMessage('🧩 الإضافات جاهزة للعمل!');
    }
})();
