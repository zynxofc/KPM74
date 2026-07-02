export interface NavLink {
  label: string;
  href: string;
}

export const navigationConfig = {
  navLinks: [
    { label: "Beranda", href: "/" },
    { label: "Profil", href: "/profil" },
    { label: "Program Kerja", href: "/program-kerja" },
    { label: "Galeri", href: "/galeri" },
    { label: "Berita", href: "/berita" },
    { label: "Peta Lokasi", href: "/peta-lokasi" },
    { label: "FAQ", href: "/faq" },
  ] as NavLink[],
  
  socialLinks: {
    instagram: "https://instagram.com",
    whatsapp: "https://wa.me",
    maps: "https://maps.google.com",
  },
};
