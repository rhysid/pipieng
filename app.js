const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Fungsi Algoritma Cutting Stock (First Fit Decreasing)
function hitungPemotongan(stokPanjang, daftarPotongan) {
  // Urutkan potongan dari yang terbesar ke terkecil
  const sorted = [...daftarPotongan].sort((a, b) => b - a);
  const hasilTali = [];

  for (const item of sorted) {
    if (item > stokPanjang) continue; // Abaikan jika potongan > panjang tali utuh

    let dimasukkan = false;
    for (const tali of hasilTali) {
      if (tali.sisa >= item) {
        tali.potongan.push(item);
        tali.sisa -= item;
        dimasukkan = true;
        break;
      }
    }

    if (!dimasukkan) {
      hasilTali.push({
        potongan: [item],
        sisa: stokPanjang - item
      });
    }
  }

  return hasilTali;
}

app.get('/', (req, res) => {
  res.render('index', { hasil: null, inputData: null });
});

app.post('/hitung', (req, res) => {
  const totalPanjang = parseFloat(req.body.totalPanjang) || 80;
  
  // Ambil array input dari form
  let potonganInput = req.body.potongan || [];
  let jumlahInput = req.body.jumlah || [];

  if (!Array.isArray(potonganInput)) potonganInput = [potonganInput];
  if (!Array.isArray(jumlahInput)) jumlahInput = [jumlahInput];

  // Susun daftar semua potongan berdasarkan jumlahnya
  const daftarPotongan = [];
  for (let i = 0; i < potonganInput.length; i++) {
    const panjang = parseFloat(potonganInput[i]);
    const qty = parseInt(jumlahInput[i]) || 1;
    
    if (!isNaN(panjang) && panjang > 0) {
      for (let j = 0; j < qty; j++) {
        daftarPotongan.push(panjang);
      }
    }
  }

  const hasil = hitungPemotongan(totalPanjang, daftarPotongan);

  res.render('index', { 
    hasil, 
    totalPanjang,
    daftarPotongan 
  });
});

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});