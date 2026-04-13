/**
 * Shared navigation component
 * Auberge de Grandeur | Group 5 BSCS 2A
 */

const NAV_ICONS = {
  dashboard:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  rooms:       '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  reservation: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  billing:     '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  services:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 19.07l1.41-1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>',
  profile:     '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
};

function renderSidebar(activePage) {
  const nav = [
    { id: 'dashboard',   label: 'Dashboard',  href: 'dashboard.html'   },
    { id: 'rooms',       label: 'Rooms',       href: 'rooms.html'       },
    { id: 'reservation', label: 'Reservation', href: 'reservation.html' },
    { id: 'billing',     label: 'Billing',     href: 'billing.html'     },
    { id: 'services',    label: 'Services',    href: 'services.html'    },
    { id: 'profile',     label: 'My Profile',  href: 'profile.html'     },
  ];

  const navHtml = nav.map(item => `
    <a class="nav-item ${activePage === item.id ? 'active' : ''}" href="${item.href}">
      <span class="nav-icon">${NAV_ICONS[item.id]}</span>
      ${item.label}
    </a>
  `).join('');

  return `
    <div class="sidebar">
      <div class="sidebar-logo">
        <div style="width:48px;height:48px;background:linear-gradient(135deg,var(--gold),var(--brown-light));
             border-radius:50%;display:flex;align-items:center;justify-content:center;
             font-family:var(--font-display);font-size:1.4rem;color:var(--brown-dark);font-weight:600;flex-shrink:0;">A</div>
        <div class="sidebar-logo-text">Auberge<br><em>de Grandeur</em></div>
      </div>
      <nav class="sidebar-nav">${navHtml}</nav>
      <div class="sidebar-footer">
        <button class="btn btn-ghost btn-sm btn-full" onclick="handleLogout()" style="display:flex;align-items:center;gap:8px;justify-content:center;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
        <div style="margin-top:12px;font-size:0.65rem;color:rgba(245,230,200,0.25);text-align:center;letter-spacing:0.06em;">
          Group 5 &bull; BSCS 2A &bull; 2025–2026
        </div>
      </div>
    </div>
  `;
}

function renderTopbar(title, user) {
  return `
    <div class="topbar">
      <div class="topbar-title">${title}</div>
      <div class="topbar-user">
        <div style="text-align:right;">
          <div style="font-size:0.85rem;font-weight:600;color:var(--brown-dark);">${user.firstName} ${user.lastName}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);">Guest</div>
        </div>
        <div class="avatar" id="topbar-avatar" onclick="window.location.href='profile.html'" style="cursor:pointer;" title="View Profile"></div>
      </div>
    </div>
  `;
}

function initPage(activePage, title) {
  const user = Auth.requireAuth();
  if (!user) return null;
  document.querySelector('#sidebar-slot').innerHTML = renderSidebar(activePage);
  document.querySelector('#topbar-slot').innerHTML  = renderTopbar(title, user);
  const avatarEl = document.getElementById('topbar-avatar');
  if (avatarEl) UI.renderAvatar(user, avatarEl);
  return user;
}

function handleLogout() {
  if (!confirm('Sign out of your account?')) return;
  Store.logout();
  UI.showToast('Signed out successfully.', 'info');
  // Works from any page depth since pages are in frontend/pages/
  setTimeout(() => { window.location.href = '../../index.html'; }, 600);
}
