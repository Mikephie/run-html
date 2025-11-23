// ========== 主题切换功能 ==========
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const html = document.documentElement;

// 从本地存储加载主题
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

// 主题切换事件
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // 添加切换动画
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

// 更新主题图标
function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ========== 移动端菜单切换 ==========
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');

mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// 点击外部关闭菜单
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    }
});

// ========== 导航激活状态 ==========
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');

// 页面加载时检查 URL hash
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        updateActiveNav(hash);
    }
});

// 点击导航链接
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        updateActiveNav(targetId);
        
        // 移动端点击后关闭菜单
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
});

// 滚动监听更新激活状态
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveNavOnScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// 根据滚动位置更新激活导航
function updateActiveNavOnScroll() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });

    if (currentSection) {
        updateActiveNav(currentSection);
    }
}

// 更新激活的导航项
function updateActiveNav(targetId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// ========== 卡片入场动画 ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 为所有卡片添加初始样式和观察
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// ========== 搜索功能（可选） ==========
// 如果需要添加搜索功能，取消注释以下代码
/*
function addSearchFeature() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="searchInput" placeholder="搜索资源..." class="search-input">
    `;
    
    const pageHeader = document.querySelector('.page-header');
    pageHeader.appendChild(searchContainer);
    
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const desc = card.querySelector('.card-desc').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
*/

// ========== 响应式处理 ==========
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // 桌面端时关闭移动菜单
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    }, 250);
});

// ========== 快捷键支持 ==========
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 打开搜索（如果有搜索功能）
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // ESC 关闭移动菜单
    if (e.key === 'Escape') {
        sidebar.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// ========== 性能优化：预加载链接 ==========
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const link = card.getAttribute('href');
        if (link && !document.querySelector(`link[rel="prefetch"][href="${link}"]`)) {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = link;
            document.head.appendChild(prefetchLink);
        }
    });
});

console.log('🚀 导航页面已加载完成！');
