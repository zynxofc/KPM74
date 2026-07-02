<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Agent Workflow — LinTree KPM

Sebelum mengerjakan apa pun, lakukan langkah berikut secara berurutan **tanpa pengecualian**.

---

### Step 1 — Read Documentation First

Baca dokumen-dokumen berikut secara berurutan:

```text
docs/05_PROJECT_STATUS.md    ← status project & fitur selesai
docs/06_NEXT_TASK.md         ← task yang akan dikerjakan
docs/07_CHANGELOG.md         ← history perubahan
docs/08_DECISIONS.md         ← keputusan teknis yang berlaku
docs/09_BUGS.md              ← bug aktif & selesai
docs/10_ARCHITECTURE.md      ← arsitektur sistem & konvensi
docs/PRODUCTION_CHECKLIST.md ← checklist production
```

Juga baca file memori sesi:

```text
.ai/PROJECT_CONTEXT.md
.ai/SESSION.md
.ai/TODO.md
.ai/DECISIONS.md
```

---

### Step 2 — Analyze Source Code

Analisis seluruh source code yang relevan dengan task sebelum mengubah kode.

**Jangan membuat asumsi** apabila informasi sudah tersedia pada dokumen di atas.

Periksa:

- Apakah file yang akan diubah sudah ada?
- Apakah ada pattern yang sama di codebase yang harus diikuti?
- Apakah perubahan berdampak pada file lain?

---

### Step 3 — Project Sync

Sebelum mengimplementasikan, pastikan:

1. `docs/05_PROJECT_STATUS.md` sesuai dengan kondisi kode aktual.
2. Task yang dikerjakan terdaftar di `docs/06_NEXT_TASK.md`.
3. Tidak ada bug aktif di `docs/09_BUGS.md` yang terkait.
4. Keputusan teknis di `docs/08_DECISIONS.md` tidak dilanggar.

Jika ditemukan inkonsistensi antara dokumentasi dan kode aktual — **perbarui dokumentasi dulu, baru lanjutkan**.

---

### Step 4 — Implement

Implementasikan sesuai rencana. Patuhi:

- `03_DEVELOPMENT_RULES.md`
- `docs/08_DECISIONS.md`
- `docs/10_ARCHITECTURE.md`

**Jangan mengganti arsitektur tanpa alasan yang kuat.**

**Jangan menghapus fitur lama.**

**Selalu pertahankan backward compatibility apabila memungkinkan.**

---

### Step 5 — Definition of Done

Sebuah task dinyatakan **selesai** hanya jika seluruh item berikut terpenuhi:

- [ ] `npm run lint` → **0 errors**
- [ ] `npm run build` → **0 errors**
- [ ] TypeScript strict → **0 errors**
- [ ] Semua halaman yang berubah responsive (mobile/tablet/desktop)
- [ ] Tidak ada placeholder atau TODO permanen
- [ ] Data berasal dari database (tidak hardcode)
- [ ] Dokumentasi diperbarui (langkah 6)

---

### Step 6 — Update Documentation

**WAJIB** diperbarui setelah setiap task selesai:

| File | Kapan diperbarui |
| --- | --- |
| `docs/07_CHANGELOG.md` | Selalu — catat semua perubahan |
| `docs/05_PROJECT_STATUS.md` | Jika status fitur berubah |
| `docs/06_NEXT_TASK.md` | Pindahkan task selesai, tambah task baru |
| `docs/09_BUGS.md` | Jika bug ditemukan atau diselesaikan |
| `docs/08_DECISIONS.md` | Jika ada keputusan teknis baru |
| `docs/10_ARCHITECTURE.md` | Jika ada perubahan arsitektur |
| `.ai/SESSION.md` | Selalu — ringkasan sesi |
| `.ai/TODO.md` | Selalu — update status task |
| `.ai/CHANGELOG.md` | Selalu — sama dengan docs/07 |
| `.ai/DECISIONS.md` | Jika keputusan teknis baru |
| `.ai/PROJECT_CONTEXT.md` | Jika tujuan/arsitektur berubah |

**Jangan pernah menghapus history.**

**Tambahkan informasi baru di bagian paling bawah (untuk .ai/) atau paling atas (untuk docs/).**

---

### Setiap Task Selesai

1. Commit perubahan secara logis (jika menggunakan Git).
2. Perbarui semua file dokumentasi (Step 6).
3. Jangan mengakhiri sesi sebelum seluruh file dokumentasi diperbarui.
