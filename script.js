// بيانات أولية تجريبية للقروبات
const initialGroups = [
    {
        title: "قروب خدمات وتصميم الجرافيك",
        category: "services",
        link: "https://chat.whatsapp.com/example1",
        desc: "نشر أعمال التصميم والخدمات البرمجية والاستشارات."
    },
    {
        title: "سوق السيارات والمعدات",
        category: "trade",
        link: "https://chat.whatsapp.com/example2",
        desc: "قروب مخصص لبيع وشراء السيارات والقطع المستعملة والجديدة."
    },
    {
        title: "تعلّم البرمجة وتطوير المواقع",
        category: "tech",
        link: "https://chat.whatsapp.com/example3",
        desc: "تبادل الدروس والكورسات والاستفسارات البرمجية للمبتدئين."
    }
];

// تحميل القروبات من التخزين المحلي أو استخدام البيانات الأولية
let groups = JSON.parse(localStorage.getItem('my_wa_groups')) || initialGroups;

// عرض القروبات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    renderGroups(groups);
});

// دالة عرض البطاقات
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
                <div class="card-desc">${group.desc || 'لا يوجد وصف متاح.'}</div>
            </div>
            <a href="${group.link}" target="_blank" class="btn-join">
                <i class="fa-solid fa-user-plus"></i> انضمام للقروب
            </a>
        `;
        grid.appendChild(card);
    });
}

// دالة الفلترة حسب التصنيف
function filterGroups(category) {
    // تغيير شكل الأزرار
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        renderGroups(groups);
    } else {
        const filtered = groups.filter(g => g.category === category);
        renderGroups(filtered);
    }
}

// التحكم بالنافذة المنبثقة (Modal)
function openModal() {
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

// إضافة قروب جديد
function handleAddGroup(e) {
    e.preventDefault();

    const title = document.getElementById('groupTitle').value;
    const category = document.getElementById('groupCategory').value;
    const link = document.getElementById('groupLink').value;
    const desc = document.getElementById('groupDesc').value;

    const newGroup = { title, category, link, desc };

    // الإضافة للأنشطة والحفظ
    groups.unshift(newGroup);
    localStorage.setItem('my_wa_groups', JSON.stringify(groups));

    // إعادة العرض وإغلاق النافذة
    renderGroups(groups);
    closeModal();
    document.getElementById('addGroupForm').reset();

    alert('تم إضافة قروبك بنجاح!');
}
