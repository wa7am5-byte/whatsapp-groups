const ADMIN_PASS = "admin123";

// القروبات المعتمدة المبدئية
const initialActiveGroups = [
    { id: 1, title: "سوق الخدمـات الشامل", category: "services", link: "https://chat.whatsapp.com/demo1", desc: "نشر العروض والخدمات وتصميم المواقع والتطبيقات." },
    { id: 2, title: "حراج السيارات وقطع الغيار", category: "trade", link: "https://chat.whatsapp.com/demo2", desc: "قروب مخصص لبيع وشراء المركبات والمعدات." },
    { id: 3, title: "مجتمع البرمجة والتقنية", category: "tech", link: "https://chat.whatsapp.com/demo3", desc: "مناقشات برمجة الكود وحل المشكلات التكنولوجية." }
];

const defaultAdConfig = {
    text: "مساحة إعلانية مخصصة لأصحاب المحلات، الخدمات، والمتاجر المتميزة!",
    link: "https://wa.me/00000000000"
};

// إدارة التخزين المحلي
let activeGroups = JSON.parse(localStorage.getItem('real_wa_active')) || initialActiveGroups;
let pendingGroups = JSON.parse(localStorage.getItem('real_wa_pending')) || [];
let adConfig = JSON.parse(localStorage.getItem('real_wa_ad')) || defaultAdConfig;

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderMainGrid();
    renderAd();
});

// عرض الإعلان العلوي
function renderAd() {
    document.getElementById('adText').innerText = adConfig.text;
    document.getElementById('adBtnLink').href = adConfig.link;
}

// عرض شبكة القروبات للزوار
function renderMainGrid(filterText = '') {
    const grid = document.getElementById('groupsGrid');
    grid.innerHTML = '';

    let list = activeGroups;

    // تصفية حسب التصنيف
    if (currentCategory !== 'all') {
        list = list.filter(g => g.category === currentCategory);
    }

    // تصفية حسب نص البحث
    if (filterText.trim() !== '') {
        list = list.filter(g => g.title.toLowerCase().includes(filterText.toLowerCase()) || g.desc.toLowerCase().includes(filterText.toLowerCase()));
    }

    if (list.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 30px; color:#a0aec0;">لم يتم العثور على قروبات مطابقة للبحث.</p>';
        return;
    }

    list.forEach(group => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <i class="fa-solid fa-circle-check card-verified" title="قروب موثوق"></i>
            <div>
                <div class="card-header">
                    <div class="card-icon"><i class="fa-brands fa-whatsapp"></i></div>
                    <div>
                        <div class="card-title">${group.title}</div>
                        <span class="card-tag">${getCatName(group.category)}</span>
                    </div>
                </div>
                <div class="card-desc">${group.desc || 'لا يوجد وصف محدد.'}</div>
            </div>
            <div class="card-actions">
                <a href="${group.link}" target="_blank" class="btn-join">
                    <i class="fa-solid fa-user-plus"></i> انضمام
                </a>
                <button class="btn-share" onclick="shareGroup('${group.title}', '${group.link}')" title="مشاركة">
                    <i class="fa-solid fa-share-nodes"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// دالة البحث المباشر
function handleSearch() {
    const text = document.getElementById('searchInput').value;
    renderMainGrid(text);
}

// دالة الفلترة
function filterGroups(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMainGrid(document.getElementById('searchInput').value);
}

// مشاركة القروب
function shareGroup(title, link) {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent('انضم لقناة/قروب: ' + title + '\n' + link)}`;
    window.open(shareUrl, '_blank');
}

// معالجة تقديم الزائر لقروب جديد
function handleUserSubmit(e) {
    e.preventDefault();
    const link = document.getElementById('userGroupLink').value;

    // التحقق من الرابط
    if (!link.includes('chat.whatsapp.com') && !link.includes('wa.me')) {
        alert('يرجى إدخال رابط قروب واتساب صحيح يبدأ بـ chat.whatsapp.com');
        return;
    }

    const newReq = {
        id: Date.now(),
        title: document.getElementById('userGroupTitle').value,
        category: document.getElementById('userGroupCategory').value,
        link: link,
        desc: document.getElementById('userGroupDesc').value
    };

    pendingGroups.push(newReq);
    localStorage.setItem('real_wa_pending', JSON.stringify(pendingGroups));
    
    closeUserModal();
    e.target.reset();
    alert('شُكراً لك! تم إرسال قروبك للمراجعة وسيطهر فور اعتماد المسؤول.');
}

// التحكم بنوافذ الـ Modal
function openUserModal() { document.getElementById('userModal').style.display = 'flex'; }
function closeUserModal() { document.getElementById('userModal').style.display = 'none'; }

// دخول الأدمن
function checkAdminAuth() {
    const pass = prompt('أدخل كلمة سر لوحة الإدارة:');
    if (pass === ADMIN_PASS) {
        document.getElementById('adminModal').style.display = 'flex';
        renderAdminLists();
    } else if (pass !== null) {
        alert('كلمة السر خاطئة!');
    }
}
function closeAdminModal() { document.getElementById('adminModal').style.display = 'none'; }

// تبويبات الأدمن
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// إدارة لوحة تحكم الأدمن
function renderAdminLists() {
    document.getElementById('pendingCount').innerText = pendingGroups.length;
    document.getElementById('activeCount').innerText = activeGroups.length;

    // المعلقة
    const pList = document.getElementById('pendingList');
    pList.innerHTML = pendingGroups.length === 0 ? '<p>لا توجد طلبات معلقة.</p>' : '';
    pendingGroups.forEach(g => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
            <div>
                <strong>${g.title}</strong>
                <div style="font-size:12px; color:#718096;">${g.link}</div>
            </div>
            <div>
                <button class="btn-approve" onclick="approveGroup(${g.id})">قبول</button>
                <button class="btn-reject" onclick="rejectGroup(${g.id})">رفض</button>
            </div>
        `;
        pList.appendChild(item);
    });

    // النشطة
    const aList = document.getElementById('activeList');
    aList.innerHTML = '';
    activeGroups.forEach(g => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
            <div>
                <strong>${g.title}</strong>
                <div style="font-size:12px; color:#718096;">${getCatName(g.category)}</div>
            </div>
            <button class="btn-reject" onclick="deleteActiveGroup(${g.id})">حذف</button>
        `;
        aList.appendChild(item);
    });

    // بيانات الإعلان
    document.getElementById('newAdText').value = adConfig.text;
    document.getElementById('newAdLink').value = adConfig.link;
}

function approveGroup(id) {
    const item = pendingGroups.find(g => g.id === id);
    if (item) {
        activeGroups.unshift(item);
        pendingGroups = pendingGroups.filter(g => g.id !== id);
        saveAll();
        renderAdminLists();
        renderMainGrid();
    }
}

function rejectGroup(id) {
    pendingGroups = pendingGroups.filter(g => g.id !== id);
    saveAll();
    renderAdminLists();
}

function deleteActiveGroup(id) {
    if (confirm('هل أنت تأكد من حذف هذا القروب؟')) {
        activeGroups = activeGroups.filter(g => g.id !== id);
        saveAll();
        renderAdminLists();
        renderMainGrid();
    }
}

function handleUpdateAd(e) {
    e.preventDefault();
    adConfig.text = document.getElementById('newAdText').value;
    adConfig.link = document.getElementById('newAdLink').value;
    localStorage.setItem('real_wa_ad', JSON.stringify(adConfig));
    renderAd();
    alert('تم تحديث الإعلان بنجاح!');
}

function saveAll() {
    localStorage.setItem('real_wa_active', JSON.stringify(activeGroups));
    localStorage.setItem('real_wa_pending', JSON.stringify(pendingGroups));
}

function getCatName(cat) {
    const map = { services: 'خدمات وأعمال', trade: 'بيع وتجارة', tech: 'تقنية وبرمجة', chat: 'دردشة وعام' };
    return map[cat] || cat;
}
