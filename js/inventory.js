
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    where
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { db } from './firebase.js';

const auth = getAuth();
const COLLECTION_NAME = "inventory";
const CATEGORY_COLLECTION = "categories";

// Global Variables
let inventoryData = [];
let categoryData = [];
let currentStatusFilter = "all";

// Toggle States
let currentArchiveTab = 'items'; // Default to items in Archive Modal
let showArchivedCats = false;    // Default to hiding archived in Category Manager

document.addEventListener("DOMContentLoaded", () => {
    // Set Date
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("currentDate").innerText = new Date().toLocaleDateString('en-US', dateOpts);

    loadCategories();
    loadInventory();
    setupListeners();
});

// ================= LOGOUT LOGIC =================
window.handleLogout = function() {
    Swal.fire({
        title: 'Logout?',
        text: "Are you sure you want to sign out?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Yes, Logout'
    }).then((result) => {
        if (result.isConfirmed) {
            signOut(auth).then(() => {
                window.location.href = "index.html";
            }).catch((error) => {
                Swal.fire('Error', error.message, 'error');
            });
        }
    });
};

// ================= EXPORT FUNCTION (INJECTED) =================
window.exportToCSV = function() {
    if (inventoryData.length === 0) {
        Swal.fire("Info", "No data to export.", "info");
        return;
    }

    // Define CSV Headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Category,Stock,Unit,Cost,Total Value,Status,Expiry Date\n";

    // Loop through data and format for CSV
    inventoryData.forEach(item => {
        if (item.status === 'archived') return; // Skip archived items if desired

        const stock = item.currentStock || 0;
        const cost = item.unitCost || 0;
        const total = stock * cost;
        
        // Format Expiry Date
        let expiry = "";
        if (item.expiryDate) {
            const d = new Date(item.expiryDate.seconds ? item.expiryDate.seconds * 1000 : item.expiryDate);
            expiry = d.toLocaleDateString();
        }

        // Escape commas in names/descriptions to prevent CSV breaking
        const name = `"${item.name.replace(/"/g, '""')}"`; 
        const category = `"${(item.categoryName || "").replace(/"/g, '""')}"`;

        const row = [
            name,
            category,
            stock,
            item.unit || "",
            cost.toFixed(2),
            total.toFixed(2),
            item.status,
            expiry
        ].join(",");

        csvContent += row + "\r\n";
    });

    // Create Download Link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// ================= LOAD DATA (INVENTORY FIXED) =================
function loadInventory() {
    const q = query(collection(db, COLLECTION_NAME));
    onSnapshot(q, (snapshot) => {
        inventoryData = [];
        snapshot.forEach(docSnap => {
            // FIX: We put docSnap.data() FIRST.
            // This ensures the Real Firestore ID (docSnap.id) overwrites any fake 'id' inside the data.
            inventoryData.push({ ...docSnap.data(), id: docSnap.id });
        });
        updateDashboardStats();
        filterAndRender(); // Updates Main Table
        
        // If the archive modal is open, refresh it too
        if(document.getElementById("archiveModal").style.display === "flex"){
            renderArchiveTable();
        }
    });
}


// ================= LOAD CATEGORIES (FIXED) =================
function loadCategories() {
    const q = query(collection(db, CATEGORY_COLLECTION), orderBy("name"));
    
    onSnapshot(q, (snapshot) => {
        categoryData = [];
        const filter = document.getElementById("categoryFilter");
        const select = document.getElementById("itemCategory");
        
        // Default Options
        let filterHTML = `<option value="all">All Categories</option>`;
        let selectHTML = `<option value="">Select Category</option>`;

        snapshot.forEach(docSnap => {
            // FIX: Put docSnap.data() FIRST, and id: docSnap.id LAST.
            // This ensures the real Firestore ID overwrites any fake 'id' inside the data.
            const cat = { ...docSnap.data(), id: docSnap.id }; 
            
            categoryData.push(cat); 

            // Only populate Dropdowns with ACTIVE categories
            if (cat.status !== 'archived') {
                filterHTML += `<option value="${cat.name}">${cat.name}</option>`;
                selectHTML += `<option value="${cat.id}">${cat.name}</option>`;
            }
        });

        if (filter) filter.innerHTML = filterHTML;
        if (select) select.innerHTML = selectHTML;

        // Render the "Manage Categories" list
        renderCategoryList();
    });
}
// ================= DASHBOARD & STATS =================
function updateDashboardStats() {
    const activeItems = inventoryData.filter(i => i.status !== 'archived');
    const total = activeItems.length;
    
    const low = activeItems.filter(i => {
        const stock = parseFloat(i.currentStock) || 0;
        const min = parseFloat(i.minimumStock) || 0;
        return stock <= min && stock > 0;
    }).length;

    const today = new Date();
    const next7 = new Date();
    next7.setDate(today.getDate() + 7);

    const expiring = activeItems.filter(i => {
        if (!i.expiryDate) return false;
        const d = new Date(i.expiryDate.seconds ? i.expiryDate.seconds * 1000 : i.expiryDate);
        return d <= next7 && d >= today;
    }).length;

    document.getElementById("stat-total-items").innerText = total;
    document.getElementById("stat-low-stock").innerText = low;
    document.getElementById("stat-expiring").innerText = expiring;
}

// ================= MAIN TABLE RENDERER =================
window.filterStatus = function(type) {
    currentStatusFilter = type;
    filterAndRender();
};

function filterAndRender() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const cat = document.getElementById("categoryFilter").value;
    
    // Default: Show only items that are NOT archived
    let filtered = inventoryData.filter(item => item.status !== 'archived');

    filtered = filtered.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search);
        const matchCat = cat === "all" || item.categoryName === cat;
        
        let matchStatus = true;
        const stock = Number(item.currentStock) || 0;
        const min = Number(item.minimumStock) || 0;

        if (currentStatusFilter === "low") {
            matchStatus = stock <= min && stock > 0;
        } else if (currentStatusFilter === "expiring") {
             if (!item.expiryDate) return false;
             const d = new Date(item.expiryDate.seconds ? item.expiryDate.seconds * 1000 : item.expiryDate);
             const today = new Date();
             const next7 = new Date();
             next7.setDate(today.getDate() + 7);
             matchStatus = d <= next7 && d >= today;
        }
        
        return matchSearch && matchCat && matchStatus;
    });

    // Calculate Total Value based on current view
    const currentViewValue = filtered.reduce((sum, i) => {
        const stock = parseFloat(i.currentStock) || 0;
        const cost = parseFloat(i.unitCost) || 0;
        return sum + (stock * cost);
    }, 0);

    document.getElementById("stat-total-value").innerText = "₱" + currentViewValue.toLocaleString('en-US', {
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
    });

    renderTable(filtered);
}

function renderTable(data) {
    const tbody = document.getElementById("inventoryTableBody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">No active items found.</td></tr>`;
        return;
    }

    data.forEach(item => {
        const stock = Number(item.currentStock) || 0;
        const min = Number(item.minimumStock) || 0;
        const cost = Number(item.unitCost) || 0;
        const rowTotal = stock * cost;

        // Status Badge Logic
        let statusBadge = '';
        if (stock === 0) statusBadge = '<span class="badge badge-out">Out of Stock</span>';
        else if (stock <= min) statusBadge = '<span class="badge badge-low">Low Stock</span>';
        else statusBadge = '<span class="badge badge-good">Good</span>';

        if(item.expiryDate) {
             const d = new Date(item.expiryDate.seconds ? item.expiryDate.seconds * 1000 : item.expiryDate);
             const today = new Date();
             const next7 = new Date(); next7.setDate(today.getDate() + 7);
             if(d <= next7) statusBadge += ' <span class="badge badge-exp">Expiring</span>';
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>${item.categoryName || "-"}</td>
            <td>${stock} ${item.unit || ''}</td>
            <td>₱${cost.toLocaleString()}</td>
            <td style="font-weight: bold; color: #2c3e50;">₱${rowTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn-action edit" onclick="window.editItem('${item.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action archive" onclick="window.archiveItem('${item.id}')" title="Archive">
                    <i class="fas fa-box-archive"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ================= ITEM ACTIONS (Add/Edit/Archive) =================
window.saveItem = async function(e) {
    e.preventDefault();
    
    const id = document.getElementById("itemId").value;
    const name = document.getElementById("itemName").value.trim();
    const select = document.getElementById("itemCategory");
    
    // Duplicate check
    const duplicate = inventoryData.find(i => 
        i.name.toLowerCase() === name.toLowerCase() && i.id !== id && i.status !== 'archived'
    );

    if (duplicate) {
        return Swal.fire('Error', 'Item name already exists in active inventory.', 'error');
    }

    const data = {
        name,
        categoryId: select.value,
        categoryName: select.options[select.selectedIndex]?.text || "Uncategorized",
        currentStock: Number(document.getElementById("itemStock").value),
        minimumStock: Number(document.getElementById("itemMinStock").value),
        unitCost: Number(document.getElementById("itemPrice").value),
        unit: document.getElementById("itemUnit").value,
        description: document.getElementById("itemDesc").value,
        status: 'active',
        updatedAt: new Date()
    };

    const expiry = document.getElementById("itemExpiry").value;
    if (expiry) data.expiryDate = new Date(expiry);

    try {
        if (id) {
            await updateDoc(doc(db, COLLECTION_NAME, id), data);
            Swal.fire('Success', 'Item updated successfully', 'success');
        } else {
            data.createdAt = new Date();
            await addDoc(collection(db, COLLECTION_NAME), data);
            Swal.fire('Success', 'Item added successfully', 'success');
        }
        window.closeModal();
        document.getElementById("itemForm").reset();
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
};

window.editItem = function(id) {
    const item = inventoryData.find(i => i.id === id);
    if (!item) return;

    document.getElementById("modalTitle").innerText = "Edit Item";
    document.getElementById("itemId").value = item.id;
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemCategory").value = item.categoryId || "";
    document.getElementById("itemStock").value = item.currentStock;
    document.getElementById("itemMinStock").value = item.minimumStock;
    document.getElementById("itemPrice").value = item.unitCost;
    document.getElementById("itemUnit").value = item.unit;
    document.getElementById("itemDesc").value = item.description || "";

    if (item.expiryDate) {
        const d = new Date(item.expiryDate.seconds ? item.expiryDate.seconds * 1000 : item.expiryDate);
        document.getElementById("itemExpiry").value = d.toISOString().split("T")[0];
    } else {
        document.getElementById("itemExpiry").value = "";
    }

    document.getElementById("itemModal").style.display = "flex";
};

window.archiveItem = function(id) {
    Swal.fire({
        title: 'Archive Item?',
        text: "This will move the item to the inactive archive list.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f39c12',
        confirmButtonText: 'Yes, Archive it'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await updateDoc(doc(db, COLLECTION_NAME, id), { status: 'archived' });
            Swal.fire('Archived!', 'Item has been moved to archives.', 'success');
        }
    });
};

window.restoreItem = async function(id) {
    await updateDoc(doc(db, COLLECTION_NAME, id), { status: 'active' });
    Swal.fire('Restored!', 'Item is now active.', 'success');
    renderArchiveTable(); 
};

window.permanentDelete = function(id) {
    Swal.fire({
        title: 'Delete Permanently?',
        text: "You won't be able to revert this!",
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            Swal.fire('Deleted!', 'Item has been deleted.', 'success');
            renderArchiveTable();
        }
    });
};

// ================= CATEGORY MANAGEMENT =================

window.addCategory = async function() {
    const input = document.getElementById("newCategoryInput");
    const name = input.value.trim();

    if (!name) return Swal.fire('Error', 'Category name required', 'warning');

    const exists = categoryData.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        return Swal.fire('Error', 'This category already exists!', 'error');
    }

    try {
        await addDoc(collection(db, CATEGORY_COLLECTION), { 
            name: name,
            status: 'active',
            createdAt: new Date() 
        });
        
        input.value = "";
        Swal.fire({ icon: 'success', title: 'Category Added', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
};

window.archiveCategory = function(id) {
    Swal.fire({
        title: 'Archive Category?',
        text: "This will hide the category from the list.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f39c12',
        confirmButtonText: 'Yes, Archive it'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await updateDoc(doc(db, CATEGORY_COLLECTION, id), { 
                    status: 'archived',
                    updatedAt: new Date()
                });
                // Note: The list auto-refreshes because of onSnapshot
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            }
        }
    });
};

window.restoreCategory = async function(id) {
    try {
        await updateDoc(doc(db, CATEGORY_COLLECTION, id), { 
            status: 'active',
            updatedAt: new Date()
        });
        if(document.getElementById("archiveModal").style.display === 'flex') {
            renderArchiveTable(); // Refresh archive modal if open
        }
        Swal.fire({ icon: 'success', title: 'Category Restored', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (e) {
        Swal.fire('Error', e.message, 'error');
    }
}

window.permanentDeleteCategory = function(id) {
    Swal.fire({
        title: 'Delete Category?',
        text: "Gone forever!",
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteDoc(doc(db, CATEGORY_COLLECTION, id));
            if(document.getElementById("archiveModal").style.display === 'flex') {
                renderArchiveTable();
            }
        }
    });
}

// Renders the list inside "Manage Categories"
function renderCategoryList() {
    const list = document.getElementById("categoryList");
    if(!list) return;

    // 1. Inject Toggle Button if missing
    let toggleBtn = document.getElementById("toggleCatViewBtn");
    if (!toggleBtn) {
        const container = list.parentElement; 
        const btnContainer = document.createElement("div");
        const btnStyle = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 0 5px;";
        btnContainer.style.cssText = btnStyle;
        
        toggleBtn = document.createElement("button");
        toggleBtn.id = "toggleCatViewBtn";
        toggleBtn.className = "btn-secondary"; 
        toggleBtn.style.cssText = "background: none; border: none; color: #555; cursor: pointer; text-decoration: underline; font-size: 0.9em;";
        toggleBtn.onclick = toggleCategoryView;
        
        btnContainer.appendChild(toggleBtn);
        container.insertBefore(btnContainer, list);
    }

    // 2. Update Button Text
    toggleBtn.innerHTML = showArchivedCats 
        ? '<i class="fas fa-list"></i> Show Active Categories' 
        : '<i class="fas fa-archive"></i> Show Archived Categories';

    // 3. Filter List
    const visibleCats = categoryData.filter(c => 
        showArchivedCats ? c.status === 'archived' : c.status !== 'archived'
    );

    // 4. Generate HTML
    let listHTML = "";
    if (visibleCats.length === 0) {
        listHTML = `<li style="text-align:center; color:#888; padding:10px;">
            ${showArchivedCats ? "No archived categories." : "No categories found."}
        </li>`;
    } else {
        visibleCats.forEach(cat => {
            if (showArchivedCats) {
                // ARCHIVED VIEW
                listHTML += `
                    <li style="background: #fff3cd; border-color: #ffeeba;">
                        <span style="color: #856404;">${cat.name} (Archived)</span>
                        <div>
                            <button class="btn-icon-small" onclick="window.restoreCategory('${cat.id}')" title="Restore" style="color: #27ae60; margin-right: 5px;">
                                <i class="fas fa-undo"></i>
                            </button>
                             <button class="btn-icon-small" onclick="window.permanentDeleteCategory('${cat.id}')" title="Delete" style="color: #c0392b;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </li>
                `;
            } else {
                // ACTIVE VIEW
                listHTML += `
                    <li>
                        <span>${cat.name}</span>
                        <button class="btn-icon-small" onclick="window.archiveCategory('${cat.id}')" title="Archive">
                            <i class="fas fa-box-archive"></i>
                        </button>
                    </li>
                `;
            }
        });
    }
    list.innerHTML = listHTML;
}

window.toggleCategoryView = function() {
    showArchivedCats = !showArchivedCats;
    renderCategoryList();
}

// ================= ARCHIVE MODAL (TABS & TABLE) =================
// ================= ARCHIVE MODAL (FIXED) =================

window.openArchiveModal = () => {
    currentArchiveTab = 'items'; // Default to items
    document.getElementById("archiveModal").style.display = "flex";
    
    // Inject Tab Buttons if they don't exist
    const modalBody = document.querySelector("#archiveModal .modal-body");
    let tabContainer = document.getElementById("archiveTabs");
    
    if (!tabContainer && modalBody) {
        tabContainer = document.createElement("div");
        tabContainer.id = "archiveTabs";
        tabContainer.style.cssText = "display: flex; gap: 10px; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px;";
        
        // Note: Added 'window.' to onclick events to ensure they work in module mode
        tabContainer.innerHTML = `
            <button id="tabItems" onclick="window.switchArchiveTab('items')" style="background:none; border:none; font-weight:bold; cursor:pointer; padding: 5px 10px; border-bottom: 3px solid #e74c3c; color: #e74c3c;">Items</button>
            <button id="tabCats" onclick="window.switchArchiveTab('categories')" style="background:none; border:none; color: #7f8c8d; cursor:pointer; padding: 5px 10px;">Categories</button>
        `;
        
        const tableContainer = modalBody.querySelector(".table-responsive");
        if(tableContainer) modalBody.insertBefore(tabContainer, tableContainer);
    }
    renderArchiveTable();
};

window.switchArchiveTab = (tab) => {
    currentArchiveTab = tab;
    
    // Visual Feedback for Tabs
    const btnItems = document.getElementById("tabItems");
    const btnCats = document.getElementById("tabCats");

    if(btnItems) {
        btnItems.style.borderBottom = tab === 'items' ? "3px solid #e74c3c" : "none";
        btnItems.style.color = tab === 'items' ? "#e74c3c" : "#7f8c8d";
    }
    
    if(btnCats) {
        btnCats.style.borderBottom = tab === 'categories' ? "3px solid #e74c3c" : "none";
        btnCats.style.color = tab === 'categories' ? "#e74c3c" : "#7f8c8d";
    }
    
    renderArchiveTable();
};

function renderArchiveTable() {
    const tbody = document.getElementById("archiveTableBody");
    // Find the closest table, then the thead inside it
    const table = tbody.closest("table");
    const thead = table.querySelector("thead tr");
    
    tbody.innerHTML = "";

    // --- TAB: ITEMS ---
    if (currentArchiveTab === 'items') {
        if (thead) {
            thead.innerHTML = `<th>Item Name</th><th>Category</th><th>Last Stock</th><th>Actions</th>`;
        }

        const archivedItems = inventoryData.filter(i => i.status === 'archived');
        
        if (archivedItems.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px; color:#888;">No archived items found.</td></tr>`;
            return;
        }

        archivedItems.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${item.name}</strong></td>
                <td>${item.categoryName || "-"}</td>
                <td>${item.currentStock}</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="window.restoreItem('${item.id}')" style="background:#27ae60; padding: 5px 10px; border:none; color:white; border-radius:4px; cursor:pointer;">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                    <button class="btn-icon delete" onclick="window.permanentDelete('${item.id}')" title="Delete Permanently" style="margin-left:5px; color:#c0392b; background:none; border:none; cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    // --- TAB: CATEGORIES ---
    } else {
        if (thead) {
            thead.innerHTML = `<th>Category Name</th><th>Archived Date</th><th>Status</th><th>Actions</th>`;
        }

        const archivedCats = categoryData.filter(c => c.status === 'archived');
        
        if (archivedCats.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px; color:#888;">No archived categories found.</td></tr>`;
            return;
        }

        archivedCats.forEach(cat => {
            const dateStr = cat.updatedAt ? new Date(cat.updatedAt.seconds * 1000).toLocaleDateString() : "-";
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${cat.name}</strong></td>
                <td>${dateStr}</td>
                <td><span class="badge" style="background:#fff3cd; color:#856404; padding:2px 8px; border-radius:10px; font-size:0.8em;">Archived</span></td>
                <td>
                    <button class="btn-primary btn-sm" onclick="window.restoreCategory('${cat.id}')" style="background:#27ae60; padding: 5px 10px; border:none; color:white; border-radius:4px; cursor:pointer;">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                    <button class="btn-icon delete" onclick="window.permanentDeleteCategory('${cat.id}')" title="Delete Permanently" style="margin-left:5px; color:#c0392b; background:none; border:none; cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}



// ================= MODAL & LISTENER LOGIC =================

function setupListeners() {
    // 1. Search & Category Filters
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.addEventListener("keyup", filterAndRender);
    
    const catFilter = document.getElementById("categoryFilter");
    if (catFilter) catFilter.addEventListener("change", filterAndRender);

    // 2. Add New Item Button
    // We check for both a class '.btn-add' and an ID 'addItemBtn' to be safe
    const addItemBtn = document.querySelector(".btn-add") || document.getElementById("addItemBtn");
    if (addItemBtn) {
        addItemBtn.onclick = () => {
            document.getElementById("itemForm").reset();
            document.getElementById("itemId").value = "";
            document.getElementById("modalTitle").innerText = "Add New Item";
            document.getElementById("itemModal").style.display = "flex";
        };
    }

    // 3. Manage Categories Button (This was missing!)
    const manageCatBtn = document.querySelector(".btn-manage-cats") || document.getElementById("manageCatsBtn");
    if (manageCatBtn) {
        manageCatBtn.onclick = () => {
            document.getElementById("categoryModal").style.display = "flex";
            renderCategoryList(); // Refresh the list when opening
        };
    }

    // 4. Archive Button (If you have a separate button for it)
    const archiveBtn = document.getElementById("viewArchiveBtn");
    if (archiveBtn) {
        archiveBtn.onclick = () => window.openArchiveModal();
    }

    // 5. Attach Close Logic to all "X" buttons
    document.querySelectorAll(".close").forEach(btn => {
        btn.onclick = () => window.closeModal();
    });

    // 6. Form Submit Listener
    const itemForm = document.getElementById("itemForm");
    if (itemForm) itemForm.addEventListener("submit", window.saveItem);

    // 7. Export Button Listener (INJECTED)
    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
        exportBtn.onclick = window.exportToCSV;
    }
}

// Global Close Function
window.closeModal = function() {
    // Finds all elements with the class 'modal' and hides them
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        modal.style.display = "none";
    });
};

// Close Modal when clicking the dark background
window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
        window.closeModal();
    }
};


