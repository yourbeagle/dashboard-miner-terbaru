# Mine Miner Dashboard

Dashboard website untuk memantau banyak miner Mine dari daftar address pada file `miners.txt`.

Metrik yang ditampilkan:
- address miner
- total earned
- total task yang sudah dikerjakan
- jumlah task pada epoch saat ini
- akurasi pada epoch saat ini
- rata-rata akurasi
- status online/offline

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Tambah miner baru

Edit file `miners.txt`, satu address per baris:

```txt
0x8eD50cDb2048f788cc3bD034c38aCB0732B6cf23
0xYourOtherMinerAddressHere
```

Baris kosong dan baris yang diawali `#` akan diabaikan.

## Deploy ke Vercel

Project ini sudah cocok untuk Vercel:
1. Push folder ini ke repo Git
2. Import project ke Vercel
3. Gunakan root directory `mine-miner-dashboard`
4. Deploy

## Catatan

Data diambil dari endpoint publik Mine:
`https://minework.net/api/miners/{address}`

Fetch dilakukan server-side dan di-cache selama 60 detik.
# dashboard-miner-terbaru
