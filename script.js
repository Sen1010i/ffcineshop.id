// ===== RIPPLE EFFECT =====
document.addEventListener('click', function(e) {
  if (e.target.closest('.ripple-btn')) {
    const button = e.target.closest('.ripple-btn');
    const circle = document.createElement('span');
    circle.classList.add('ripple-circle');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }
});

// ===== INDEX PAGE FUNCTIONALITY =====
if (document.querySelector('.product-list')) {
  // Pencarian
  const inputSearch = document.getElementById('searchInput');
  const produkList = document.querySelectorAll('.product');

  if (inputSearch) {
    inputSearch.addEventListener('input', () => {
      const query = inputSearch.value.toLowerCase();
      produkList.forEach(produk => {
        const nama = produk.getAttribute('data-nama').toLowerCase();
        produk.style.display = nama.includes(query) ? 'flex' : 'none';
      });
    });
  }

  // Filter kategori
  const tombolKategori = document.querySelectorAll('.kategori-filter button');
  if (tombolKategori.length > 0) {
    tombolKategori.forEach(button => {
      button.addEventListener('click', () => {
        const kategoriDipilih = button.getAttribute('data-filter');
        produkList.forEach(produk => {
          const kategoriProduk = produk.getAttribute('data-kategori').toLowerCase();
          produk.style.display = kategoriDipilih === 'semua' || kategoriProduk.includes(kategoriDipilih) ? 'flex' : 'none';
        });

        // Highlight tombol aktif
        tombolKategori.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }
}

// ===== FORM PAGE FUNCTIONALITY =====
if (document.getElementById('formPemesanan')) {
  document.addEventListener('DOMContentLoaded', function() {
    // Set selected design from URL
    const params = new URLSearchParams(window.location.search);
    const desainDipilih = params.get('desain');
    if (desainDipilih) {
      const selectElement = document.getElementById('desain');
      const optionExists = Array.from(selectElement.options).some(
        opt => opt.value === desainDipilih
      );
      
      if (optionExists) {
        selectElement.value = desainDipilih;
      }
    }

    // Setup date inputs
    const inputTanggal = document.getElementById('tanggal');
    const inputWaktu = document.getElementById('waktu');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    
    inputTanggal.min = todayStr;

    inputTanggal.addEventListener('change', function() {
      if (this.value === todayStr) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        inputWaktu.min = `${hours}:${minutes}`;
      } else {
        inputWaktu.min = '00:00';
      }
    });

    // Form submission
    const form = document.getElementById('formPemesanan');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        nama: document.getElementById('nama').value.trim(),
        nomor: document.getElementById('nomor').value.trim(),
        desain: document.getElementById('desain').value,
        catatan: document.getElementById('catatan').value.trim(),
        tanggal: document.getElementById('tanggal').value,
        waktu: document.getElementById('waktu').value
      };

      // Validate
      if (!validateForm(formData)) {
        return;
      }

      // Show loading
      if (btnText)    btnText.hidden = true;
      if (btnLoading) btnLoading.hidden = false;
      submitBtn.disabled = true;

      // Simulate processing
      setTimeout(() => {
        sendToWhatsApp(formData);
        // Reset loading state
        submitBtn.disabled = false;
        if (btnText)    btnText.hidden = false;
        if (btnLoading) btnLoading.hidden = true;
      }, 500);
    });

    function validateForm(formData) {
      // Validate phone number
      if (!/^08\d{9,13}$/.test(formData.nomor)) {
        alert('Nomor WhatsApp harus dimulai dengan 08 dan panjang 10-14 digit');
        return false;
      }

      // Validate date
      const selectedDate = new Date(formData.tanggal);
      const today = new Date();
      today.setHours(0,0,0,0);

      if (selectedDate < today) {
        alert('Tanggal booking tidak boleh hari kemarin');
        return false;
      }

      return true;
    }

    function sendToWhatsApp(formData) {
      // Nomor harus format internasional: 628xx (bukan 088)
        const nomorToko = '6281268556553';
        const pesan = `*Halooo! Ada pesanan nail art* :
*Nama* : ${escapeInput(formData.nama)}
*Nomor Whatsapp* : ${escapeInput(formData.nomor)}
*Desain* : ${escapeInput(formData.desain)}
*Tanggal Booking* : ${escapeInput(formData.tanggal)}
*Waktu Booking* : ${escapeInput(formData.waktu)}
*Catatan* : ${formData.catatan ? escapeInput(formData.catatan) : "-"}

Terima kasih!! 💕 Sudah melakukan order! Ditunggu ya, admin akan segera membalas pesan anda!

*NOTE:*
Jika admin belum membalas pesan anda, mungkin sedang melayani customer, atau sedang bobok manis. 
Tapi tenang, pesanmu tetap kami utamakan!🥇🤩

Thank you!!!`;

        const encodedPesan = encodeURIComponent(pesan);
        const urlWA = `https://wa.me/${nomorToko}?text=${encodedPesan}`;
        window.open(urlWA, '_blank');
    }


    function escapeInput(str) {
      return str.replace(/[*_~`]/g, '\\$&');
    }
  });
}