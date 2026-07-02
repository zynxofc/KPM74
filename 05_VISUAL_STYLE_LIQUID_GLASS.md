# Visual Direction — Liquid Glass Style

Website harus terasa modern, premium, ringan, dan elegan.

Inspirasi:

- Apple Liquid Glass (sebagai inspirasi, bukan ditiru 100%)
- Vercel
- Framer
- Linear
- Notion

## Prinsip

- Fokus pada keterbacaan.
- Efek visual hanya untuk meningkatkan pengalaman pengguna.
- Hindari animasi berlebihan.

## Navbar

- Floating.
- Blur 18–24px.
- Border putih transparan.
- Radius 9999px.
- Shadow lembut.
- Muncul transparan di atas hero.
- Menjadi lebih solid saat pengguna scroll.

## Tombol (CTA)

Idle:

- Glass transparan.
- Border 1px putih transparan.
- Blur.
- Shadow lembut.

Hover:

- Sedikit membesar.
- Pantulan cahaya bergerak.
- Border lebih terang.

Pressed:

- Scale turun sedikit.
- Shadow mengecil.
- Efek terasa seperti tombol fisik.

Jangan gunakan efek berlebihan yang mengganggu performa.

## Cards

- Glass ringan.
- Background semi transparan.
- Radius besar.
- Hover lift.
- Shadow halus.

## Hero

Background dapat diganti admin.

Tambahkan:

- Gradient overlay.
- Parallax ringan.
- Blur layer tipis.
- Reveal animation saat halaman dibuka.

## Animasi

Gunakan Framer Motion.

Durasi:

120–250 ms.

Jenis:

- Fade
- Slide
- Scale
- Stagger

Hindari bounce berlebihan.

## Ikon

Gunakan Lucide Icons.

## Responsive

Mobile adalah prioritas utama.

## Accessibility

Kontras teks minimal WCAG AA.

Jangan memakai glass jika membuat teks sulit dibaca.

## AI IMPLEMENTATION RULES

AI wajib:

- Mengutamakan performa.
- Tidak membuat efek WebGL kecuali diminta.
- Tidak memakai library animasi selain Framer Motion tanpa alasan.
- Memastikan seluruh efek berjalan 60 FPS pada perangkat kelas menengah.

Target Lighthouse:

- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95
