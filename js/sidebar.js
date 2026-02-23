
// // // export function initSidebar() {
// // //     // 1. Get Current Page Name
// // //     const currentPage = window.location.pathname.split("/").pop() || "index.html";

// // //     // 2. GET USER ROLE
// // //     // Change this to 'cashier' or 'clerk' to test the different views!
// // //     // In the real app, this value comes from the Login page.
// // //     const userRole = localStorage.getItem('userRole') || 'admin'; 

// // //     console.log("Current User Role:", userRole);

// // //     // 3. Define Menu Items & Permissions
// // //     const menuItems = [
// // //         { 
// // //             name: "Dashboard", 
// // //             link: "dashboard.html", 
// // //             icon: "fa-home", 
// // //             roles: ['admin', 'cashier'] 
// // //         },
// // //         { 
// // //             name: "POS", 
// // //             link: "pos.html", 
// // //             icon: "fa-cash-register", 
// // //             roles: ['admin', 'cashier'] 
// // //         },
// // //         { 
// // //             name: "Transactions", 
// // //             link: "transactions.html", 
// // //             icon: "fa-receipt", 
// // //             roles: ['admin', 'cashier'] 
// // //         },
// // //         { 
// // //             name: "Sales", 
// // //             link: "sales.html", 
// // //             icon: "fa-chart-line", 
// // //             roles: ['admin', 'cashier'] 
// // //         },
// // //         { 
// // //             name: "Products", 
// // //             link: "products.html", 
// // //             icon: "fa-box", 
// // //             roles: ['admin', 'clerk'] 
// // //         },
// // //         { 
// // //             name: "Inventory", 
// // //             link: "inventory.html", 
// // //             icon: "fa-boxes", 
// // //             roles: ['admin', 'clerk'] 
// // //         },
// // //         { 
// // //             name: "Settings", 
// // //             link: "settings.html", 
// // //             icon: "fa-cog", 
// // //             roles: ['admin'] 
// // //         }
// // //     ];

// // //     // 4. Filter Items based on Role
// // //     const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

// // //     // 5. Generate Menu HTML
// // //     let navLinksHTML = "";
// // //     visibleItems.forEach(item => {
// // //         const isActive = currentPage === item.link ? "active" : "";
// // //         navLinksHTML += `
// // //             <li>
// // //                 <a href="${item.link}" class="${isActive}">
// // //                     <i class="fas ${item.icon}"></i> 
// // //                     <span>${item.name}</span>
// // //                 </a>
// // //             </li>
// // //         `;
// // //     });

// // //     // 6. Build the Sidebar Structure
// // //     const sidebarHTML = `
// // //         <div class="sidebar-header">
// // //             <i class="fas fa-piggy-bank brand-icon"></i>
// // //             <div class="brand-text">
// // //                 <h2>Gene's Lechon</h2>
// // //                 <span style="text-transform: capitalize; color: #aaa; font-size: 12px;">${userRole} Panel</span>
// // //             </div>
// // //         </div>

// // //         <div class="menu-label">MENU</div>
// // //         <ul class="nav-links">
// // //             ${navLinksHTML}
// // //         </ul>

// // //         <div class="sidebar-footer">
// // //             <button class="btn-logout-sidebar" onclick="window.openLogoutModal()">
// // //                 <i class="fas fa-sign-out-alt"></i> <span>Logout</span>
// // //             </button>
// // //         </div>
// // //     `;

// // //     // 7. Inject into Placeholder
// // //     const sidebarElement = document.getElementById('sidebar-placeholder');
// // //     if (sidebarElement) {
// // //         sidebarElement.className = "sidebar"; // Apply CSS class
// // //         sidebarElement.innerHTML = sidebarHTML;
// // //     }

// // //     injectLogoutModal();
// // // }

// // // function injectLogoutModal() {
// // //     // Check if modal already exists to avoid duplicates
// // //     if (document.getElementById('logoutModal')) return;

// // //     const modalHTML = `
// // //     <div class="modal" id="logoutModal">
// // //         <div class="modal-content center-content" style="max-width: 350px;">
// // //             <div style="width: 60px; height: 60px; background: #ffebee; color: #f44336; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px;">
// // //                 <i class="fas fa-sign-out-alt"></i>
// // //             </div>
// // //             <h3>Sign Out?</h3>
// // //             <p style="color:#666; margin-bottom: 20px;">Are you sure you want to end your session?</p>
// // //             <div class="modal-footer center-footer" style="display: flex; justify-content: center; gap: 10px;">
// // //                 <button type="button" class="btn-outline" onclick="document.getElementById('logoutModal').style.display='none'" style="padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer;">Cancel</button>
// // //                 <button type="button" class="btn-danger" onclick="window.location.href='index.html'" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer;">Logout</button>
// // //             </div>
// // //         </div>
// // //     </div>
// // //     `;
// // //     document.body.insertAdjacentHTML('beforeend', modalHTML);
    
// // //     // Make global function to open it
// // //     window.openLogoutModal = function() {
// // //         document.getElementById('logoutModal').style.display = 'flex';
// // //     }
// // // }


// // export function initSidebar() {
// //     // 1. Get Current Page Name
// //     const currentPage = window.location.pathname.split("/").pop() || "index.html";

// //     // 2. GET USER ROLE
// //     const userRole = localStorage.getItem('userRole') || 'admin'; 

// //     // 3. Define Menu Items
// //     const menuItems = [
// //         { 
// //             name: "Dashboard", 
// //             link: "dashboard.html", 
// //             icon: "fa-th-large", 
// //             roles: ['admin', 'cashier'] 
// //         },
// //         { 
// //             name: "POS System", 
// //             link: "pos.html", 
// //             icon: "fa-cash-register", 
// //             roles: ['admin', 'cashier'] 
// //         },
// //         { 
// //             name: "Sales", 
// //             link: "sales.html", 
// //             icon: "fa-chart-line", 
// //             roles: ['admin', 'cashier'] 
// //         },
// //         { 
// //             name: "Transactions", 
// //             link: "transactions.html", 
// //             icon: "fa-history", 
// //             roles: ['admin', 'cashier'] 
// //         },
// //         { 
// //             name: "Inventory", 
// //             link: "inventory.html", 
// //             icon: "fa-boxes", 
// //             roles: ['admin', 'clerk'] 
// //         },
// //         { 
// //             name: "Products", 
// //             link: "products.html", 
// //             icon: "fa-tag", 
// //             roles: ['admin', 'clerk'] 
// //         },

// //     ];

// //     // 4. Filter Items based on Role
// //     const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

// //     // 5. Generate Menu HTML
// //     let navLinksHTML = "";
    
// //     // Helper to check active state
// //     const isActive = (link) => currentPage === link ? "active" : "";

// //     visibleItems.forEach(item => {
// //         navLinksHTML += `
// //             <li>
// //                 <a href="${item.link}" class="${isActive(item.link)}">
// //                     <i class="fas ${item.icon}"></i> 
// //                     <span>${item.name}</span>
// //                 </a>
// //             </li>
// //         `;
// //     });

// //     // 6. Build the Sidebar Structure
// //     const sidebarHTML = `
// //         <div class="sidebar-header">
// //             <i class="fas fa-piggy-bank brand-icon"></i>
// //             <div class="brand-text">
// //                 <h2>Gene's Lechon</h2>
// //                 <span style="text-transform: capitalize; color: #aaa; font-size: 12px;">${userRole} Panel</span>
// //             </div>
// //         </div>

// //         <div class="menu-label">MENU</div>
// //         <ul class="nav-links">
// //             ${navLinksHTML}
// //         </ul>

// //         <div class="sidebar-footer">
// //             <a href="#" class="btn-logout-sidebar" onclick="window.openLogoutModal()">
// //                 <i class="fas fa-sign-out-alt"></i> <span>Sign Out</span>
// //             </a>
// //         </div>
// //     `;

// //     // 7. Inject into Placeholder
// //     const sidebarElement = document.getElementById('sidebar-placeholder');
// //     if (sidebarElement) {
// //         sidebarElement.className = "sidebar"; // Ensure CSS class is applied
// //         sidebarElement.innerHTML = sidebarHTML;
// //     }

// //     injectLogoutModal();
// // }

// // function injectLogoutModal() {
// //     // Check if modal already exists
// //     if (document.getElementById('logoutModal')) return;

// //     // THIS IS YOUR ORIGINAL DESIGN STYLE
// //     const modalHTML = `
// //     <div class="modal" id="logoutModal">
// //         <div class="modal-content small-modal" style="text-align: center; max-width: 350px;">
// //             <div class="logout-icon-container" style="margin-bottom: 20px;">
// //                 <div style="background: #fee; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
// //                     <i class="fas fa-sign-out-alt" style="font-size: 28px; color: #f44336; margin-left: 5px;"></i>
// //                 </div>
// //             </div>
// //             <h3 style="color: var(--navy); margin-bottom: 10px; font-size: 20px;">Sign Out?</h3>
// //             <p style="color: var(--text-grey); font-size: 14px; margin-bottom: 30px;">
// //                 Are you sure you want to end your session?
// //             </p>
// //             <div class="modal-footer" style="justify-content: space-between; background: transparent; padding: 0;">
// //                 <button class="btn-cancel" onclick="document.getElementById('logoutModal').style.display='none'">Cancel</button>
// //                 <button class="btn-pay" style="background: #f44336; border:none; box-shadow: 0 4px 10px rgba(244, 67, 54, 0.3);" onclick="window.location.href='index.html'">Yes, Sign Out</button>
// //             </div>
// //         </div>
// //     </div>
// //     `;
    
// //     document.body.insertAdjacentHTML('beforeend', modalHTML);
    
// //     // Global function to open it
// //     window.openLogoutModal = function() {
// //         document.getElementById('logoutModal').style.display = 'flex';
// //     }
// // }









// // 1. IMPORT FIREBASE TOOLS DIRECTLY
// import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
// import { auth } from './firebase.js'; 

// export function initSidebar() {
//     // 1. Get Current Page & Role
//     const currentPage = window.location.pathname.split("/").pop() || "index.html";
//     const userRole = localStorage.getItem('userRole') || 'admin'; 

//     // 2. Define Menu Items
//     const menuItems = [
//         { name: "Dashboard", link: "dashboard.html", icon: "fa-th-large", roles: ['admin', 'cashier'] },
//         { name: "POS System", link: "pos.html", icon: "fa-cash-register", roles: ['admin', 'cashier'] },
//         { name: "Sales", link: "sales.html", icon: "fa-chart-line", roles: ['admin', 'cashier'] },
//         { name: "Transactions", link: "transactions.html", icon: "fa-history", roles: ['admin', 'cashier'] },
//         { name: "Inventory", link: "inventory.html", icon: "fa-boxes", roles: ['admin', 'clerk'] },
//         { name: "Products", link: "products.html", icon: "fa-tag", roles: ['admin', 'clerk'] },
//         { name: "Manage Users", link: "users.html", icon: "fa-users", roles: ['admin'] },
//     ];

//     // 3. Build Menu HTML
//     let navLinksHTML = "";
//     const visibleItems = menuItems.filter(item => item.roles.includes(userRole));
    
//     visibleItems.forEach(item => {
//         const activeClass = (currentPage === item.link) ? "active" : "";
//         navLinksHTML += `
//             <li>
//                 <a href="${item.link}" class="${activeClass}">
//                     <i class="fas ${item.icon}"></i> 
//                     <span>${item.name}</span>
//                 </a>
//             </li>
//         `;
//     });

//     // 4. Build Sidebar HTML
//     const sidebarHTML = `
//         <div class="sidebar-header">
//             <i class="fas fa-piggy-bank brand-icon"></i>
//             <div class="brand-text">
//                 <h2>Gene's Lechon</h2>
//                 <span style="text-transform: capitalize; color: #aaa; font-size: 12px;">${userRole} Panel</span>
//             </div>
//         </div>

//         <div class="menu-label">MENU</div>
//         <ul class="nav-links">
//             ${navLinksHTML}
//         </ul>

//         <div class="sidebar-footer">
//             <button class="btn-logout-sidebar" onclick="window.openLogoutModal()">
//                 <i class="fas fa-sign-out-alt"></i> <span>Sign Out</span>
//             </button>
//         </div>
//     `;

//     // 5. Inject into Page
//     const sidebarElement = document.getElementById('sidebar-placeholder');
//     if (sidebarElement) {
//         sidebarElement.className = "sidebar";
//         sidebarElement.innerHTML = sidebarHTML;
//     }

//     // 6. Initialize the Modal
//     injectLogoutModal();
// }

// function injectLogoutModal() {
//     if (document.getElementById('logoutModal')) return;

//     const modalHTML = `
//     <div class="modal" id="logoutModal">
//         <div class="modal-content small-modal" style="text-align: center; max-width: 350px;">
//             <div class="logout-icon-container" style="margin-bottom: 20px;">
//                 <div style="background: #fee; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
//                     <i class="fas fa-sign-out-alt" style="font-size: 28px; color: #f44336; margin-left: 5px;"></i>
//                 </div>
//             </div>
//             <h3 style="color: var(--navy); margin-bottom: 10px; font-size: 20px;">Sign Out?</h3>
//             <p style="color: var(--text-grey); font-size: 14px; margin-bottom: 30px;">
//                 Are you sure you want to end your session?
//             </p>
//             <div class="modal-footer" style="justify-content: space-between; background: transparent; padding: 0;">
//                 <button class="btn-cancel" onclick="document.getElementById('logoutModal').style.display='none'">Cancel</button>
//                 <button class="btn-pay" style="background: #f44336; border:none; box-shadow: 0 4px 10px rgba(244, 67, 54, 0.3);" onclick="window.handleLogoutClick()">Yes, Sign Out</button>
//             </div>
//         </div>
//     </div>
//     `;
    
//     document.body.insertAdjacentHTML('beforeend', modalHTML);
// }

// // ==========================================
// // FORCE GLOBAL ACCESS
// // ==========================================

// // 1. Open Modal
// window.openLogoutModal = function() {
//     const modal = document.getElementById('logoutModal');
//     if (modal) modal.style.display = 'flex';
// };

// // 2. THE REAL LOGOUT (Fixed!)
// window.handleLogoutClick = async function() {
//     try {
//         // We now call Firebase DIRECTLY here.
//         // We do not rely on window.logout() from other files.
//         await signOut(auth);
        
//         // Clear all local data
//         localStorage.clear();
        
//         // Redirect to Login
//         window.location.href = 'index.html';
        
//     } catch (error) {
//         console.error("Logout Error:", error);
//         // Force redirect even if error
//         localStorage.clear();
//         window.location.href = 'index.html';
//     }
// };






// document.addEventListener('DOMContentLoaded', () => {
//     const mobileBtn = document.getElementById('mobile-menu-btn');
//     const body = document.body;
    
//     // Create dark overlay for mobile
//     const overlay = document.createElement('div');
//     overlay.className = 'sidebar-overlay';
//     body.appendChild(overlay);

//     // Open Sidebar
//     if(mobileBtn) {
//         mobileBtn.addEventListener('click', () => {
//             body.classList.add('show-sidebar');
//         });
//     }

//     // Close Sidebar (clicking overlay)
//     overlay.addEventListener('click', () => {
//         body.classList.remove('show-sidebar');
//     });
// });





// js/sidebar.js

// export function initSidebar() {
//     console.log("Initializing Sidebar...");

//     // 1. Define the Sidebar HTML
//     const sidebarHTML = `
//     <aside class="sidebar">
//         <div class="sidebar-header">
//             <div class="brand-icon">
//                 <i class="fas fa-piggy-bank" style="color: #ff5e14; font-size: 24px;"></i>
//             </div>
//             <div class="brand-text">
//                 <span class="brand-name">Gene's Lechon</span>
//                 <span class="brand-subtext">Admin Panel</span>
//             </div>
//         </div>

//         <div class="sidebar-menu">
//             <p class="menu-label">MENU</p>
//             <nav class="sidebar-nav">
//                 <a href="inventory.html" class="nav-link" data-page="inventory.html">
//                     <i class="fas fa-boxes-stacked"></i>
//                     <span>Inventory</span>
//                 </a>
//                 <a href="products.html" class="nav-link" data-page="products.html">
//                     <i class="fas fa-tag"></i>
//                     <span>Products</span>
//                 </a>
                
//             </nav>
//         </div>

//         <div class="sidebar-footer">
//             <a href="index.html" class="btn-signout">
//                 <i class="fas fa-sign-out-alt"></i>
//                 <span>Sign Out</span>
//             </a>
//         </div>
//     </aside>
    
//     <div id="sidebarOverlay" class="sidebar-overlay"></div>
//     `;

//     // 2. Inject Sidebar into the DOM (prepend to body or app-container)
//     const container = document.querySelector('.app-container');
//     if (container) {
//         // Create a temporary container to hold the HTML
//         const tempDiv = document.createElement('div');
//         tempDiv.innerHTML = sidebarHTML;
        
//         // Insert the sidebar at the start of app-container
//         const aside = tempDiv.querySelector('aside');
//         const overlay = tempDiv.querySelector('#sidebarOverlay');
        
//         container.insertBefore(aside, container.firstChild);
//         document.body.appendChild(overlay); // Overlay goes to body
//     } else {
//         console.error("Error: .app-container not found.");
//         return;
//     }

//     // 3. Inject Hamburger Button into Header
//     const header = document.querySelector('header');
//     if (header) {
//         const toggleBtn = document.createElement('button');
//         toggleBtn.id = 'sidebarToggle';
//         toggleBtn.className = 'sidebar-toggle';
//         toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
//         // Insert before the title
//         header.insertBefore(toggleBtn, header.firstChild);
//     }

//     // 4. Auto-Highlight Active Link
//     const currentPage = window.location.pathname.split("/").pop() || 'index.html';
//     const navLinks = document.querySelectorAll('.nav-link');
    
//     navLinks.forEach(link => {
//         if (link.getAttribute('data-page') === currentPage) {
//             link.classList.add('active');
//         }
//     });

//     // 5. Initialize Mobile Toggle Logic
//     setupMobileMenu();
// }

// function setupMobileMenu() {
//     const toggleBtn = document.getElementById('sidebarToggle');
//     const sidebar = document.querySelector('.sidebar');
//     const overlay = document.getElementById('sidebarOverlay');

//     if (toggleBtn && sidebar && overlay) {
//         // Toggle Open
//         toggleBtn.addEventListener('click', (e) => {
//             e.stopPropagation();
//             sidebar.classList.add('mobile-open');
//             overlay.classList.add('active');
//         });

//         // Close on Overlay Click
//         overlay.addEventListener('click', () => {
//             sidebar.classList.remove('mobile-open');
//             overlay.classList.remove('active');
//         });

//         // Close on Link Click (optional)
//         sidebar.querySelectorAll('a').forEach(link => {
//             link.addEventListener('click', () => {
//                 sidebar.classList.remove('mobile-open');
//                 overlay.classList.remove('active');
//             });
//         });
//     }
// }



import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

export function initSidebar({ name = 'User', role = 'cashier' } = {}) {
    console.log("Initializing Sidebar...");

    // 1. Build nav links (admin and clerk see the same pages)
    const sharedLinks = `
                <a href="inventory.html" class="nav-link" data-page="inventory.html">
                    <i class="fas fa-boxes-stacked"></i>
                    <span>Inventory</span>
                </a>
                <a href="products.html" class="nav-link" data-page="products.html">
                    <i class="fas fa-tag"></i>
                    <span>Products</span>
                </a>
    `;

    const navLinks = sharedLinks;

    // 2. Define the Sidebar HTML
    const roleLabel = role === 'admin' ? 'Admin Panel' : role === 'clerk' ? 'Clerk Panel' : 'Cashier Panel';

    const sidebarHTML = `
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="brand-icon">
                <i class="fas fa-piggy-bank" style="color: #ff5e14; font-size: 24px;"></i>
            </div>
            <div class="brand-text">
                <span class="brand-name">Gene's Lechon</span>
                <span class="brand-subtext">${roleLabel}</span>
            </div>
        </div>

        <div class="sidebar-menu">
            <p class="menu-label">MENU</p>
            <nav class="sidebar-nav">
                ${navLinks}
            </nav>
        </div>

        <div class="sidebar-footer">
            <button class="btn-signout" id="signOutBtn">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sign Out</span>
            </button>
        </div>
    </aside>
    
    <div id="sidebarOverlay" class="sidebar-overlay"></div>

    <!-- Logout Confirmation Modal -->
    <div id="logoutModal" style="
        display:none; position:fixed; inset:0; z-index:9999;
        background:rgba(0,0,0,0.5); align-items:center; justify-content:center;">
        <div style="
            background:#fff; border-radius:12px; padding:32px 28px;
            max-width:360px; width:90%; text-align:center;
            box-shadow:0 8px 32px rgba(0,0,0,0.18);">
            <div style="margin-bottom:12px;">
                <i class="fas fa-sign-out-alt" style="font-size:36px; color:#ff5e14;"></i>
            </div>
            <h3 style="margin:0 0 8px; font-size:18px; color:#1a1a2e;">Sign Out</h3>
            <p style="margin:0 0 24px; color:#666; font-size:14px;">Are you sure you want to sign out?</p>
            <div style="display:flex; gap:12px; justify-content:center;">
                <button id="logoutCancelBtn" style="
                    flex:1; padding:10px; border-radius:8px;
                    border:1px solid #ddd; background:#f5f5f5;
                    cursor:pointer; font-size:14px; color:#444;">
                    Cancel
                </button>
                <button id="logoutConfirmBtn" style="
                    flex:1; padding:10px; border-radius:8px;
                    border:none; background:#ff5e14;
                    cursor:pointer; font-size:14px; color:#fff; font-weight:600;">
                    Sign Out
                </button>
            </div>
        </div>
    </div>
    `;

    // 3. Inject Sidebar into the DOM (prepend to body or app-container)
    const container = document.querySelector('.app-container');
    if (container) {
        // Create a temporary container to hold the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sidebarHTML;
        
        // Insert the sidebar at the start of app-container
        const aside = tempDiv.querySelector('aside');
        const overlay = tempDiv.querySelector('#sidebarOverlay');
        const logoutModal = tempDiv.querySelector('#logoutModal');
        
        container.insertBefore(aside, container.firstChild);
        document.body.appendChild(overlay);
        document.body.appendChild(logoutModal);

        // 4. Attach Sign Out button → show modal
        const signOutBtn = aside.querySelector('#signOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => {
                logoutModal.style.display = 'flex';
            });
        }

        // Cancel button → hide modal
        logoutModal.querySelector('#logoutCancelBtn').addEventListener('click', () => {
            logoutModal.style.display = 'none';
        });

        // Confirm button → sign out
        logoutModal.querySelector('#logoutConfirmBtn').addEventListener('click', async () => {
            logoutModal.querySelector('#logoutConfirmBtn').textContent = 'Signing out...';
            try {
                const auth = getAuth();
                await signOut(auth);
                window.location.href = 'index.html';
            } catch (err) {
                console.error("Sign out failed:", err);
            }
        });

        // Click outside modal to cancel
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) logoutModal.style.display = 'none';
        });

    } else {
        console.error("Error: .app-container not found.");
        return;
    }

    // 5. Inject Hamburger Button into Header
    const header = document.querySelector('header');
    if (header) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'sidebarToggle';
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insert before the title
        header.insertBefore(toggleBtn, header.firstChild);
    }

    // 5. Auto-Highlight Active Link
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    const navLinkEls = document.querySelectorAll('.nav-link');
    
    navLinkEls.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });

    // 6. Initialize Mobile Toggle Logic
    setupMobileMenu();
}

function setupMobileMenu() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (toggleBtn && sidebar && overlay) {
        // Toggle Open
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
        });

        // Close on Overlay Click
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        });

        // Close on nav link click only (excludes sign out button)
        sidebar.querySelectorAll('a.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
            });
        });
    }
}