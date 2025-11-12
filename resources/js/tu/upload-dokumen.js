document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk menghilangkan alert sukses setelah 5 detik
    setTimeout(() => {
        const successAlert = document.querySelector('.bg-green-100');
        if (successAlert) successAlert.remove();
    }, 5000);

    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const hakAksesDropdown = document.getElementById('hakAksesDropdown');
    const hakAksesMenu = document.getElementById('hakAksesMenu');
    const selectAllUsers = document.getElementById('selectAllUsers');
    const searchUser = document.getElementById('searchUser');
    const uploadForm = document.getElementById('uploadForm');

    // 1. Inisialisasi Flatpickr untuk Tanggal Terbit
    flatpickr("#tanggalTerbit", {
        dateFormat: "d/m/Y",
        allowInput: true,
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                longhand: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
            },
            months: {
                shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
                longhand: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
            },
        },
        onReady: function(dateObj, dateStr, instance) {
            // Styling kustom Flatpickr sudah ditangani di CSS, tapi biarkan ini sebagai fallback/tambahan
            instance.calendarContainer.style.borderRadius = '1rem';
            instance.calendarContainer.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        }
    });

    // 2. Fungsi untuk memperbarui label file input
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileSize = (file.size / 1024 / 1024).toFixed(2);
            fileLabel.innerHTML = `<span class="font-medium text-gray-900">${file.name}</span><br><span class="text-xs text-gray-500">${fileSize} MB</span>`;
            fileUploadArea.classList.add('file-selected');
        } else {
            fileLabel.innerHTML = 'Klik untuk pilih file';
            fileUploadArea.classList.remove('file-selected');
        }
    });
    
    // Klik area upload akan memicu klik input file
    fileUploadArea.addEventListener('click', function(e) {
        // Mencegah event saat tombol "Pilih File" diklik, karena sudah ada onclick di tombol itu
        if (e.target.tagName !== 'BUTTON') {
            fileInput.click();
        }
    });

    // 3. Fungsi untuk mengelola dropdown Hak Akses (dipindahkan dari fungsi global)
    function toggleHakAksesDropdown() {
        hakAksesMenu.classList.toggle('hidden');
    }

    hakAksesDropdown.addEventListener('click', toggleHakAksesDropdown);

    // Tutup dropdown jika klik di luar elemen
    document.addEventListener('click', function(event) {
        if (!hakAksesDropdown.contains(event.target) && !hakAksesMenu.contains(event.target)) {
            hakAksesMenu.classList.add('hidden');
        }
    });

    // 4. Fungsi untuk memperbarui label Hak Akses dan status 'Pilih Semua'
    window.updateHakAksesLabel = function() {
        const checkboxes = document.querySelectorAll('.hak-akses-checkbox:checked');
        const label = document.getElementById('hakAksesLabel');
        const validation = document.getElementById('hakAksesValidation');
        const totalVisibleCheckboxes = document.querySelectorAll('.user-checkbox').length; // Cek semua, tersembunyi atau tidak

        if (checkboxes.length === 0) {
            label.textContent = 'Pilih pengguna yang dapat mengakses';
            label.classList.add('text-gray-500');
            label.classList.remove('text-gray-900', 'font-medium');
            validation.value = '';
            selectAllUsers.checked = false;
        } else if (checkboxes.length === totalVisibleCheckboxes) {
            label.textContent = `✓ Semua pengguna dipilih (${checkboxes.length})`;
            label.classList.remove('text-gray-500');
            label.classList.add('text-gray-900', 'font-medium');
            validation.value = 'valid';
            selectAllUsers.checked = true;
        } else {
            label.textContent = `✓ ${checkboxes.length} pengguna dipilih`;
            label.classList.remove('text-gray-500');
            label.classList.add('text-gray-900', 'font-medium');
            validation.value = 'valid';
            selectAllUsers.checked = false;
        }
    }

    // Panggil updateHakAksesLabel saat ada perubahan pada checkbox individual
    document.querySelectorAll('.hak-akses-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', window.updateHakAksesLabel);
    });

    // 5. Fungsi untuk mengelola 'Pilih Semua Pengguna'
    selectAllUsers.addEventListener('change', function() {
        const isChecked = selectAllUsers.checked;
        const userItems = document.querySelectorAll('.user-checkbox');
        
        userItems.forEach(item => {
            const checkbox = item.querySelector('.hak-akses-checkbox');
            // Hanya mengontrol checkbox yang saat ini tidak tersembunyi oleh filter
            if (!item.style.display || item.style.display !== 'none') {
                 checkbox.checked = isChecked;
            }
        });
        window.updateHakAksesLabel();
    });

    // 6. Fungsi untuk memfilter pengguna
    searchUser.addEventListener('keyup', function() {
        const searchValue = searchUser.value.toLowerCase();
        const userItems = document.querySelectorAll('.user-checkbox');
        
        userItems.forEach(item => {
            const username = item.getAttribute('data-username');
            const useremail = item.getAttribute('data-useremail');
            
            if (username.includes(searchValue) || useremail.includes(searchValue)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Periksa status 'Pilih Semua' setelah filter
        updateSelectAllStatus();
    });
    
    // Fungsi pembantu untuk memperbarui status 'Pilih Semua' setelah filtering/check
    function updateSelectAllStatus() {
        const allCheckboxes = document.querySelectorAll('.hak-akses-checkbox');
        const checkedCheckboxes = document.querySelectorAll('.hak-akses-checkbox:checked');
        
        if (checkedCheckboxes.length === allCheckboxes.length && allCheckboxes.length > 0) {
            selectAllUsers.checked = true;
        } else {
            selectAllUsers.checked = false;
        }
    }


    // 7. Validasi minimal 1 hak akses saat submit
    uploadForm.addEventListener('submit', function(e) {
        const checkboxes = document.querySelectorAll('.hak-akses-checkbox:checked');
        
        if (checkboxes.length === 0) {
            e.preventDefault();
            alert('⚠️ Pilih minimal 1 pengguna untuk hak akses!');
            hakAksesDropdown.focus();
            hakAksesDropdown.classList.add('border-red-500', 'ring-2', 'ring-red-200');
            
            setTimeout(() => {
                hakAksesDropdown.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
            }, 2000);
            
            // Tampilkan menu agar pengguna tahu harus memilih di mana
            hakAksesMenu.classList.remove('hidden');
        }
    });
    
    // Panggil updateHakAksesLabel saat DOM siap untuk mengatur status awal
    window.updateHakAksesLabel();
});

// Catatan: Fungsi openModal, closeModal, dan updateFileName dari file upload-dokumen.js
// yang lama tidak relevan dengan file blade ini, jadi saya mengabaikannya.