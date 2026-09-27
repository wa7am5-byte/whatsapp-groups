// كلمة السر الخاصة بالمبرمج/الأدمن
const ADMIN_PASSWORD = "admin123";

// البيانات الأساسية الأولية
const defaultGroups = [
    { id: 1, title: "قروب خدمات وتصميم", category: "services", link: "https://chat.whatsapp.com/demo1", desc: "نشر تصميمات وخدمات استشارية." },
    { id: 2, title: "سوق السيارات والعقارات", category: "trade", link: "https://chat.whatsapp.com/demo2", desc: "عروض بيع وشراء يومية." }
];

const defaultAd = {
    text: "مساحة إعلانية مميزة: أعلن عن خدمتك أو متجرك هنا ليصل لألف الزوار!",
    link: "https://wa.me/00000000000"
};

// تحميل البيانات من الـ LocalStorage
let groups = JSON.parse(localStorage.getItem('wa_groups_data')) || defaultGroups;
let adConfig = JSON.parse(localStorage.getItem('wa_ad_data')) || defaultAd;

document.addEventListener('DOMContentLoaded', () => {
    renderGroups(groups);
    renderAd();
});

// عرض الإعلان
function renderAd() {
    document.getElementById('adText').innerText = adConfig.text;
    document.getElementById('adBtnLink').href = adConfig.link;
}

// عرض القروبات للزائر
function renderGroups(groupsToDisplay) {
    const grid = document.getElementById('groupsGrid');
    grid.innerHTML = '';

    if (groupsToDisplay.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">لا توجد قروبات في هذا التصنيف حالياً.</p>';
        return;
    }

    groupsToDisplay.forEach(group => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div>
                <div class="card-header">
                    <div class="card-icon"><i class="fa-brands fa-whatsapp"></i></div>
                    <div class="card-title">${group.title}</div>
                </div>
                <div class="card-desc">${group.desc || 'لا يوجد وصف.'}</div>
            </div>
            <a href="${group.link}" target="_blank" class="btn-join">
                <i class="fa-solid fa-user-plus"></i> انضمام للقروب
            </a>
        `;
        grid.appendChild(card);
    });
}

// التصفية والفلترة
function filterGroups(category, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (category === 'all') {
        renderGroups(groups);
    } else {
        renderGroups(groups.filter(g => g.category === category));
    }
}

// التحقق من كلمة سر الأدمن
function checkAdminAuth() {
    const pass = prompt("أدخل كلمة سر لوحة التحكم:");
    if (pass === ADMIN_PASSWORD) {
        openAdminModal();
    } else if (pass !== null) {
        alert("كلمة السر غير صحيحة!");
    }
}

function openAdminModal() {
    document.getElementById('adminModal').style.display = 'flex';
    renderAdminGroupsList();
    // تعبئة حقول الإعلان الحالية
    document.getElementById('newAdText').value = adConfig.text;
    document.getElementById('newAdLink').value = adConfig.link;
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

// التنقل بين تبويبات لوحة التحكم
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// إضافة قروب جديد عبر الأدمن
function handleAddGroup(e) {
    e.preventDefault();
    const newGroup = {
        id: Date.now(),
        title: document.getElementById('groupTitle').value,
        category: document.getElementById('groupCategory').value,
        link: document.getElementById('groupLink').value,
        desc: document.getElementById('groupDesc').value
    };

    groups.unshift(newGroup);
    saveAndRefresh();
    alert('تم إضافة القروب بنجاح!');
    e.target.reset();
}

// عرض قائمة القروبات داخل الأدمن مع زر الحذف
function renderAdminGroupsList() {
    const list = document.getElementById('adminGroupsList');
    document.getElementById('groupsCount').innerText = groups.length;
    list.innerHTML = '';

    groups.forEach(group => {
        const item = document.createElement('div');
        item.className = 'admin-group-item';
        item.innerHTML = `
            <div>
                <strong>${group.title}</strong>
                <small style="display:block; color:#666;">${group.category}</small>
            </div>
            <button class="btn-delete" onclick="deleteGroup(${group.id})"><i class="fa-solid fa-trash"></i> حذف</button>
        `;
        list.appendChild(item);
    });
}

// حذف قروب
function deleteGroup(id) {
    if (confirm("هل أنت تأكد من حذف هذا القروب؟")) {
        groups = groups.filter(g => g.id !== id);
        saveAndRefresh();
        renderAdminGroupsList();
    }
}

// تحديث الإعلان
function handleUpdateAd(e) {
    e.preventDefault();
    adConfig.text = document.getElementById('newAdText').value;
    adConfig.link = document.getElementById('newAdLink').value;

    localStorage.setItem('wa_ad_data', JSON.stringify(adConfig));
    renderAd();
    alert('تم تحديث الإعلان بنجاح!');
}

// حفظ البيانات في التخزين المحلي وإعادة العرض
function saveAndRefresh() {
    localStorage.setItem('wa_groups_data', JSON.stringify(groups));
    renderGroups(groups);
}
