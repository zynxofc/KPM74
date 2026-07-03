"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { settings, members, programs, mapLocations, gallery, posts, faqs } from "@/db/schema";
import { getSession } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/log";
import { settingsSchema, memberSchema, programSchema, mapLocationSchema, gallerySchema, postSchema, faqSchema } from "@/lib/validations";
import { storageService } from "@/lib/storage";
import { isPreviewMode } from "@/lib/preview";

export interface SettingsState {
  error?: string;
  success?: boolean;
}

export interface ActionState {
  error?: string;
  success?: boolean;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings Server Action
// ─────────────────────────────────────────────────────────────────────────────
export async function updateSettings(
  _prevState: SettingsState | null,
  formData: FormData
): Promise<SettingsState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    siteName: formData.get("siteName"),
    description: formData.get("description"),
    socialInstagram: formData.get("socialInstagram"),
    socialTiktok: formData.get("socialTiktok"),
    socialWhatsapp: formData.get("socialWhatsapp"),
    socialMaps: formData.get("socialMaps"),
    heroTitle: formData.get("heroTitle"),
    heroSubtitle: formData.get("heroSubtitle"),
    heroBgImage: formData.get("heroBgImage") || "",
    allowPublicRegistrations: formData.get("allowPublicRegistrations") === "true",
    maintenanceMode: formData.get("maintenanceMode") === "true",
  };

  const parsed = settingsSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;
  const bgFile = formData.get("heroBgImageFile");
  let finalBgImage = validatedData.heroBgImage;

  if (bgFile && bgFile instanceof File && bgFile.size > 0) {
    if (bgFile.size > 2 * 1024 * 1024) {
      return { error: "Ukuran gambar background tidak boleh melebihi 2MB." };
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(bgFile.type)) {
      return { error: "Format file harus JPEG, PNG, atau WebP." };
    }

    try {
      const [currentSettings] = await db
        .select()
        .from(settings)
        .where(eq(settings.id, 1))
        .limit(1);

      const arrayBuffer = await bgFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadedUrl = await storageService.uploadFile(buffer, bgFile.name, "hero");

      if (currentSettings?.heroBgImage && currentSettings.heroBgImage !== uploadedUrl) {
        try {
          await storageService.deleteFile(currentSettings.heroBgImage);
        } catch (delError) {
          console.error("Gagal menghapus file lama:", delError);
        }
      }
      finalBgImage = uploadedUrl;
    } catch (uploadErr) {
      console.error("Gagal upload file:", uploadErr);
      return { error: "Terjadi kesalahan saat mengunggah file background." };
    }
  }

  try {
    await db
      .update(settings)
      .set({
        siteName: validatedData.siteName,
        description: validatedData.description,
        socialInstagram: validatedData.socialInstagram,
        socialTiktok: validatedData.socialTiktok,
        socialWhatsapp: validatedData.socialWhatsapp,
        socialMaps: validatedData.socialMaps,
        heroTitle: validatedData.heroTitle,
        heroSubtitle: validatedData.heroSubtitle,
        heroBgImage: finalBgImage,
        allowPublicRegistrations: validatedData.allowPublicRegistrations,
        maintenanceMode: validatedData.maintenanceMode,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(settings.id, 1));

    await logActivity({
      action: "UPDATE",
      entity: "Settings",
      entityId: "1",
      description: "Memperbarui pengaturan umum & hero section",
      ipAddress: ip,
    });

    revalidatePath("/admin/pengaturan");
    revalidatePath("/");
    return { success: true };
  } catch (dbErr) {
    console.error("Gagal simpan ke DB:", dbErr);
    return { error: "Terjadi kesalahan database saat memperbarui pengaturan." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Members Server Actions
// ─────────────────────────────────────────────────────────────────────────────

export async function createMember(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    name: formData.get("name"),
    nimNip: formData.get("nimNip"),
    role: formData.get("role"),
    photoUrl: formData.get("photoUrl") || "",
  };

  const parsed = memberSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;
  const photoFile = formData.get("photoFile");
  let finalPhotoUrl = validatedData.photoUrl;

  if (photoFile && photoFile instanceof File && photoFile.size > 0) {
    if (photoFile.size > 2 * 1024 * 1024) {
      return { error: "Ukuran foto tidak boleh melebihi 2MB." };
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(photoFile.type)) {
      return { error: "Format file harus JPEG, PNG, atau WebP." };
    }

    try {
      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      finalPhotoUrl = await storageService.uploadFile(buffer, photoFile.name, "members");
    } catch (uploadErr) {
      console.error("Gagal upload foto:", uploadErr);
      return { error: "Terjadi kesalahan saat mengunggah foto anggota." };
    }
  }

  try {
    const [inserted] = await db
      .insert(members)
      .values({
        name: validatedData.name,
        nimNip: validatedData.nimNip,
        role: validatedData.role,
        photoUrl: finalPhotoUrl,
      })
      .returning({ id: members.id });

    await logActivity({
      action: "CREATE",
      entity: "Member",
      entityId: String(inserted.id),
      description: `Menambahkan anggota baru: ${validatedData.name} (${validatedData.role})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/anggota");
    revalidatePath("/profil");
    return { success: true };
  } catch (dbErr) {
    console.error("Gagal simpan anggota:", dbErr);
    return { error: "Terjadi kesalahan database saat menyimpan anggota." };
  }
}

export async function updateMember(
  memberId: number,
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    name: formData.get("name"),
    nimNip: formData.get("nimNip"),
    role: formData.get("role"),
    photoUrl: formData.get("photoUrl") || "",
  };

  const parsed = memberSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;
  const photoFile = formData.get("photoFile");
  let finalPhotoUrl = validatedData.photoUrl;

  try {
    const [currentMember] = await db
      .select()
      .from(members)
      .where(eq(members.id, memberId))
      .limit(1);

    if (!currentMember) {
      return { error: "Data anggota tidak ditemukan." };
    }

    if (photoFile && photoFile instanceof File && photoFile.size > 0) {
      if (photoFile.size > 2 * 1024 * 1024) {
        return { error: "Ukuran foto tidak boleh melebihi 2MB." };
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(photoFile.type)) {
        return { error: "Format file harus JPEG, PNG, atau WebP." };
      }

      const arrayBuffer = await photoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadedUrl = await storageService.uploadFile(buffer, photoFile.name, "members");

      if (currentMember.photoUrl && currentMember.photoUrl !== uploadedUrl) {
        try {
          await storageService.deleteFile(currentMember.photoUrl);
        } catch (delError) {
          console.error("Gagal menghapus foto lama:", delError);
        }
      }
      finalPhotoUrl = uploadedUrl;
    } else if (validatedData.photoUrl === "") {
      if (currentMember.photoUrl) {
        try {
          await storageService.deleteFile(currentMember.photoUrl);
        } catch (delError) {
          console.error("Gagal menghapus foto lama:", delError);
        }
      }
      finalPhotoUrl = "";
    }

    await db
      .update(members)
      .set({
        name: validatedData.name,
        nimNip: validatedData.nimNip,
        role: validatedData.role,
        photoUrl: finalPhotoUrl,
      })
      .where(eq(members.id, memberId));

    await logActivity({
      action: "UPDATE",
      entity: "Member",
      entityId: String(memberId),
      description: `Mengubah data anggota: ${validatedData.name} (${validatedData.role})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/anggota");
    revalidatePath("/profil");
    return { success: true };
  } catch (err) {
    console.error("Gagal ubah anggota:", err);
    return { error: "Terjadi kesalahan saat memperbarui data anggota." };
  }
}

export async function deleteMember(memberId: number): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  try {
    const [currentMember] = await db
      .select()
      .from(members)
      .where(eq(members.id, memberId))
      .limit(1);

    if (!currentMember) {
      return { error: "Data anggota tidak ditemukan." };
    }

    if (currentMember.photoUrl) {
      try {
        await storageService.deleteFile(currentMember.photoUrl);
      } catch (delError) {
        console.error("Gagal menghapus foto anggota dari storage:", delError);
      }
    }

    await db.delete(members).where(eq(members.id, memberId));

    await logActivity({
      action: "DELETE",
      entity: "Member",
      entityId: String(memberId),
      description: `Menghapus anggota: ${currentMember.name} (${currentMember.role})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/anggota");
    revalidatePath("/profil");
    return { success: true };
  } catch (err) {
    console.error("Gagal hapus anggota:", err);
    return { error: "Terjadi kesalahan saat menghapus anggota." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Programs (Work Programs) Server Actions
// ─────────────────────────────────────────────────────────────────────────────

export async function createProgram(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    status: formData.get("status"),
    documentationUrl: formData.get("documentationUrl") || "",
  };

  const parsed = programSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;
  const docFile = formData.get("docFile");
  let finalDocUrl = validatedData.documentationUrl;

  if (docFile && docFile instanceof File && docFile.size > 0) {
    if (docFile.size > 2 * 1024 * 1024) {
      return { error: "Ukuran gambar dokumentasi tidak boleh melebihi 2MB." };
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(docFile.type)) {
      return { error: "Format file harus JPEG, PNG, atau WebP." };
    }

    try {
      const arrayBuffer = await docFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      finalDocUrl = await storageService.uploadFile(buffer, docFile.name, "programs");
    } catch (uploadErr) {
      console.error("Gagal upload dokumentasi:", uploadErr);
      return { error: "Terjadi kesalahan saat mengunggah dokumentasi." };
    }
  }

  try {
    const [inserted] = await db
      .insert(programs)
      .values({
        name: validatedData.name,
        description: validatedData.description,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        status: validatedData.status,
        documentationUrl: finalDocUrl,
      })
      .returning({ id: programs.id });

    await logActivity({
      action: "CREATE",
      entity: "Program",
      entityId: String(inserted.id),
      description: `Menambahkan program kerja baru: ${validatedData.name} (${validatedData.status})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/program-kerja");
    revalidatePath("/program-kerja");
    return { success: true };
  } catch (dbErr) {
    console.error("Gagal simpan program:", dbErr);
    return { error: "Terjadi kesalahan database saat menyimpan program kerja." };
  }
}

export async function updateProgram(
  programId: number,
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    status: formData.get("status"),
    documentationUrl: formData.get("documentationUrl") || "",
  };

  const parsed = programSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;
  const docFile = formData.get("docFile");
  let finalDocUrl = validatedData.documentationUrl;

  try {
    const [currentProgram] = await db
      .select()
      .from(programs)
      .where(eq(programs.id, programId))
      .limit(1);

    if (!currentProgram) {
      return { error: "Data program kerja tidak ditemukan." };
    }

    if (docFile && docFile instanceof File && docFile.size > 0) {
      if (docFile.size > 2 * 1024 * 1024) {
        return { error: "Ukuran gambar dokumentasi tidak boleh melebihi 2MB." };
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(docFile.type)) {
        return { error: "Format file harus JPEG, PNG, atau WebP." };
      }

      const arrayBuffer = await docFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadedUrl = await storageService.uploadFile(buffer, docFile.name, "programs");

      if (currentProgram.documentationUrl && currentProgram.documentationUrl !== uploadedUrl) {
        try {
          await storageService.deleteFile(currentProgram.documentationUrl);
        } catch (delError) {
          console.error("Gagal menghapus dokumentasi lama:", delError);
        }
      }
      finalDocUrl = uploadedUrl;
    } else if (validatedData.documentationUrl === "") {
      if (currentProgram.documentationUrl) {
        try {
          await storageService.deleteFile(currentProgram.documentationUrl);
        } catch (delError) {
          console.error("Gagal menghapus dokumentasi lama:", delError);
        }
      }
      finalDocUrl = "";
    }

    await db
      .update(programs)
      .set({
        name: validatedData.name,
        description: validatedData.description,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        status: validatedData.status,
        documentationUrl: finalDocUrl,
      })
      .where(eq(programs.id, programId));

    await logActivity({
      action: "UPDATE",
      entity: "Program",
      entityId: String(programId),
      description: `Mengubah data program kerja: ${validatedData.name} (${validatedData.status})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/program-kerja");
    revalidatePath("/program-kerja");
    return { success: true };
  } catch (err) {
    console.error("Gagal ubah program:", err);
    return { error: "Terjadi kesalahan saat memperbarui data program kerja." };
  }
}

export async function deleteProgram(programId: number): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  try {
    const [currentProgram] = await db
      .select()
      .from(programs)
      .where(eq(programs.id, programId))
      .limit(1);

    if (!currentProgram) {
      return { error: "Data program kerja tidak ditemukan." };
    }

    if (currentProgram.documentationUrl) {
      try {
        await storageService.deleteFile(currentProgram.documentationUrl);
      } catch (delError) {
        console.error("Gagal menghapus dokumentasi program dari storage:", delError);
      }
    }

    await db.delete(programs).where(eq(programs.id, programId));

    await logActivity({
      action: "DELETE",
      entity: "Program",
      entityId: String(programId),
      description: `Menghapus program kerja: ${currentProgram.name} (${currentProgram.status})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/program-kerja");
    revalidatePath("/program-kerja");
    return { success: true };
  } catch (err) {
    console.error("Gagal hapus program:", err);
    return { error: "Terjadi kesalahan saat menghapus program kerja." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Map Locations Server Actions
// ─────────────────────────────────────────────────────────────────────────────

export async function createMapLocation(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    name: formData.get("name"),
    category: formData.get("category"),
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
    description: formData.get("description"),
    googleMapsUrl: formData.get("googleMapsUrl") || "",
  };

  const parsed = mapLocationSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;

  try {
    const [inserted] = await db
      .insert(mapLocations)
      .values({
        name: validatedData.name,
        category: validatedData.category,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        description: validatedData.description || null,
        googleMapsUrl: validatedData.googleMapsUrl || null,
      })
      .returning({ id: mapLocations.id });

    await logActivity({
      action: "CREATE",
      entity: "MapLocation",
      entityId: String(inserted.id),
      description: `Menambahkan lokasi peta baru: ${validatedData.name} (${validatedData.category})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/peta-lokasi");
    revalidatePath("/peta-lokasi");
    return { success: true };
  } catch (dbErr) {
    console.error("Gagal simpan lokasi peta:", dbErr);
    return { error: "Terjadi kesalahan database saat menyimpan lokasi peta." };
  }
}

export async function updateMapLocation(
  locationId: number,
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    name: formData.get("name"),
    category: formData.get("category"),
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
    description: formData.get("description"),
    googleMapsUrl: formData.get("googleMapsUrl") || "",
  };

  const parsed = mapLocationSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;

  try {
    const [currentLocation] = await db
      .select()
      .from(mapLocations)
      .where(eq(mapLocations.id, locationId))
      .limit(1);

    if (!currentLocation) {
      return { error: "Data lokasi peta tidak ditemukan." };
    }

    await db
      .update(mapLocations)
      .set({
        name: validatedData.name,
        category: validatedData.category,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        description: validatedData.description || null,
        googleMapsUrl: validatedData.googleMapsUrl || null,
      })
      .where(eq(mapLocations.id, locationId));

    await logActivity({
      action: "UPDATE",
      entity: "MapLocation",
      entityId: String(locationId),
      description: `Mengubah data lokasi peta: ${validatedData.name} (${validatedData.category})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/peta-lokasi");
    revalidatePath("/peta-lokasi");
    return { success: true };
  } catch (err) {
    console.error("Gagal ubah lokasi peta:", err);
    return { error: "Terjadi kesalahan database saat memperbarui lokasi peta." };
  }
}

export async function deleteMapLocation(locationId: number): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  try {
    const [currentLocation] = await db
      .select()
      .from(mapLocations)
      .where(eq(mapLocations.id, locationId))
      .limit(1);

    if (!currentLocation) {
      return { error: "Data lokasi peta tidak ditemukan." };
    }

    await db.delete(mapLocations).where(eq(mapLocations.id, locationId));

    await logActivity({
      action: "DELETE",
      entity: "MapLocation",
      entityId: String(locationId),
      description: `Menghapus lokasi peta: ${currentLocation.name} (${currentLocation.category})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/peta-lokasi");
    revalidatePath("/peta-lokasi");
    return { success: true };
  } catch (err) {
    console.error("Gagal hapus lokasi peta:", err);
    return { error: "Terjadi kesalahan saat menghapus lokasi peta." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery Server Actions
// ─────────────────────────────────────────────────────────────────────────────

export async function createGalleryItem(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    title: formData.get("title"),
    type: formData.get("type"),
    fileUrl: formData.get("fileUrl") || "",
    caption: formData.get("caption"),
  };

  const parsed = gallerySchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;
  const mediaFile = formData.get("mediaFile");
  let finalFileUrl = validatedData.fileUrl;

  if (mediaFile && mediaFile instanceof File && mediaFile.size > 0) {
    if (mediaFile.size > 2 * 1024 * 1024) {
      return { error: "Ukuran file tidak boleh melebihi 2MB." };
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(mediaFile.type)) {
      return { error: "Format file harus JPEG, PNG, atau WebP." };
    }

    try {
      const arrayBuffer = await mediaFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      finalFileUrl = await storageService.uploadFile(buffer, mediaFile.name, "gallery");
    } catch (uploadErr) {
      console.error("Gagal upload file galeri:", uploadErr);
      return { error: "Terjadi kesalahan saat mengunggah file media." };
    }
  }

  try {
    const [inserted] = await db
      .insert(gallery)
      .values({
        title: validatedData.title,
        type: validatedData.type,
        fileUrl: finalFileUrl,
        caption: validatedData.caption || null,
      })
      .returning({ id: gallery.id });

    await logActivity({
      action: "CREATE",
      entity: "Gallery",
      entityId: String(inserted.id),
      description: `Menambahkan item galeri baru: ${validatedData.title} (${validatedData.type})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    return { success: true };
  } catch (dbErr) {
    console.error("Gagal simpan media galeri:", dbErr);
    return { error: "Terjadi kesalahan database saat menyimpan media galeri." };
  }
}

export async function updateGalleryItem(
  itemId: number,
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    title: formData.get("title"),
    type: formData.get("type"),
    fileUrl: formData.get("fileUrl") || "",
    caption: formData.get("caption"),
  };

  const parsed = gallerySchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;
  const mediaFile = formData.get("mediaFile");
  let finalFileUrl = validatedData.fileUrl;

  try {
    const [currentItem] = await db
      .select()
      .from(gallery)
      .where(eq(gallery.id, itemId))
      .limit(1);

    if (!currentItem) {
      return { error: "Item galeri tidak ditemukan." };
    }

    if (mediaFile && mediaFile instanceof File && mediaFile.size > 0) {
      if (mediaFile.size > 2 * 1024 * 1024) {
        return { error: "Ukuran file tidak boleh melebihi 2MB." };
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(mediaFile.type)) {
        return { error: "Format file harus JPEG, PNG, atau WebP." };
      }

      const arrayBuffer = await mediaFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadedUrl = await storageService.uploadFile(buffer, mediaFile.name, "gallery");

      if (currentItem.fileUrl && currentItem.fileUrl !== uploadedUrl) {
        try {
          await storageService.deleteFile(currentItem.fileUrl);
        } catch (delError) {
          console.error("Gagal menghapus file lama galeri:", delError);
        }
      }
      finalFileUrl = uploadedUrl;
    } else if (validatedData.fileUrl === "") {
      if (currentItem.fileUrl) {
        try {
          await storageService.deleteFile(currentItem.fileUrl);
        } catch (delError) {
          console.error("Gagal menghapus file lama galeri:", delError);
        }
      }
      finalFileUrl = "";
    }

    await db
      .update(gallery)
      .set({
        title: validatedData.title,
        type: validatedData.type,
        fileUrl: finalFileUrl,
        caption: validatedData.caption || null,
      })
      .where(eq(gallery.id, itemId));

    await logActivity({
      action: "UPDATE",
      entity: "Gallery",
      entityId: String(itemId),
      description: `Mengubah item galeri: ${validatedData.title} (${validatedData.type})`,
      ipAddress: ip,
    });

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    return { success: true };
  } catch (err) {
    console.error("Gagal ubah media galeri:", err);
    return { error: "Terjadi kesalahan database saat memperbarui media galeri." };
  }
}

export async function deleteGalleryItem(itemId: number): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  try {
    const [currentItem] = await db
      .select()
      .from(gallery)
      .where(eq(gallery.id, itemId))
      .limit(1);

    if (!currentItem) {
      return { error: "Item galeri tidak ditemukan." };
    }

    if (currentItem.fileUrl) {
      try {
        await storageService.deleteFile(currentItem.fileUrl);
      } catch (delError) {
        console.error("Gagal menghapus file dari storage:", delError);
      }
    }

    await db.delete(gallery).where(eq(gallery.id, itemId));

    await logActivity({
      action: "DELETE",
      entity: "Gallery",
      entityId: String(itemId),
      description: `Menghapus item galeri: ${currentItem.title}`,
      ipAddress: ip,
    });

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    return { success: true };
  } catch (err) {
    console.error("Gagal hapus item galeri:", err);
    return { error: "Terjadi kesalahan saat menghapus item galeri." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// News Posts Server Actions
// ─────────────────────────────────────────────────────────────────────────────

export async function createPost(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
    thumbnailUrl: formData.get("thumbnailUrl") || "",
  };

  const parsed = postSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;
  const thumbFile = formData.get("thumbFile");
  let finalThumbUrl = validatedData.thumbnailUrl;

  if (thumbFile && thumbFile instanceof File && thumbFile.size > 0) {
    if (thumbFile.size > 2 * 1024 * 1024) {
      return { error: "Ukuran gambar thumbnail tidak boleh melebihi 2MB." };
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(thumbFile.type)) {
      return { error: "Format file harus JPEG, PNG, atau WebP." };
    }

    try {
      const arrayBuffer = await thumbFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      finalThumbUrl = await storageService.uploadFile(buffer, thumbFile.name, "news");
    } catch (uploadErr) {
      console.error("Gagal upload thumbnail berita:", uploadErr);
      return { error: "Terjadi kesalahan saat mengunggah thumbnail berita." };
    }
  }

  try {
    // Generate unique slug
    let slug = generateSlug(validatedData.title);
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);
    if (existing.length > 0) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const [inserted] = await db
      .insert(posts)
      .values({
        title: validatedData.title,
        slug,
        content: validatedData.content,
        category: validatedData.category,
        thumbnailUrl: finalThumbUrl,
      })
      .returning({ id: posts.id });

    await logActivity({
      action: "CREATE",
      entity: "Post",
      entityId: String(inserted.id),
      description: `Menulis berita baru: ${validatedData.title}`,
      ipAddress: ip,
    });

    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath(`/berita/${slug}`);
    return { success: true };
  } catch (dbErr) {
    console.error("Gagal simpan berita:", dbErr);
    return { error: "Terjadi kesalahan database saat menyimpan berita." };
  }
}

export async function updatePost(
  postId: number,
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
    thumbnailUrl: formData.get("thumbnailUrl") || "",
  };

  const parsed = postSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;
  const thumbFile = formData.get("thumbFile");
  let finalThumbUrl = validatedData.thumbnailUrl;

  try {
    const [currentPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!currentPost) {
      return { error: "Data berita tidak ditemukan." };
    }

    if (thumbFile && thumbFile instanceof File && thumbFile.size > 0) {
      if (thumbFile.size > 2 * 1024 * 1024) {
        return { error: "Ukuran gambar thumbnail tidak boleh melebihi 2MB." };
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(thumbFile.type)) {
        return { error: "Format file harus JPEG, PNG, atau WebP." };
      }

      const arrayBuffer = await thumbFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadedUrl = await storageService.uploadFile(buffer, thumbFile.name, "news");

      if (currentPost.thumbnailUrl && currentPost.thumbnailUrl !== uploadedUrl) {
        try {
          await storageService.deleteFile(currentPost.thumbnailUrl);
        } catch (delError) {
          console.error("Gagal menghapus thumbnail berita lama:", delError);
        }
      }
      finalThumbUrl = uploadedUrl;
    } else if (validatedData.thumbnailUrl === "") {
      if (currentPost.thumbnailUrl) {
        try {
          await storageService.deleteFile(currentPost.thumbnailUrl);
        } catch (delError) {
          console.error("Gagal menghapus thumbnail berita lama:", delError);
        }
      }
      finalThumbUrl = "";
    }

    // Slug is preserved or updated if title changes, let's regenerate unique slug if title has changed
    let slug = currentPost.slug;
    if (currentPost.title !== validatedData.title) {
      slug = generateSlug(validatedData.title);
      const existing = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);
      if (existing.length > 0 && existing[0].id !== postId) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
      }
    }

    await db
      .update(posts)
      .set({
        title: validatedData.title,
        slug,
        content: validatedData.content,
        category: validatedData.category,
        thumbnailUrl: finalThumbUrl,
      })
      .where(eq(posts.id, postId));

    await logActivity({
      action: "UPDATE",
      entity: "Post",
      entityId: String(postId),
      description: `Mengubah berita: ${validatedData.title}`,
      ipAddress: ip,
    });

    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath(`/berita/${slug}`);
    revalidatePath(`/berita/${currentPost.slug}`); // clean up old slug cache if changed
    return { success: true };
  } catch (err) {
    console.error("Gagal ubah berita:", err);
    return { error: "Terjadi kesalahan database saat memperbarui berita." };
  }
}

export async function deletePost(postId: number): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  try {
    const [currentPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!currentPost) {
      return { error: "Data berita tidak ditemukan." };
    }

    if (currentPost.thumbnailUrl) {
      try {
        await storageService.deleteFile(currentPost.thumbnailUrl);
      } catch (delError) {
        console.error("Gagal menghapus thumbnail dari storage:", delError);
      }
    }

    await db.delete(posts).where(eq(posts.id, postId));

    await logActivity({
      action: "DELETE",
      entity: "Post",
      entityId: String(postId),
      description: `Menghapus berita: ${currentPost.title}`,
      ipAddress: ip,
    });

    revalidatePath("/admin/berita");
    revalidatePath("/berita");
    revalidatePath(`/berita/${currentPost.slug}`);
    return { success: true };
  } catch (err) {
    console.error("Gagal hapus berita:", err);
    return { error: "Terjadi kesalahan saat menghapus berita." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ Server Actions
// ─────────────────────────────────────────────────────────────────────────────

export async function createFaq(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    question: formData.get("question"),
    answer: formData.get("answer"),
  };

  const parsed = faqSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;

  try {
    const [inserted] = await db
      .insert(faqs)
      .values({
        question: validatedData.question,
        answer: validatedData.answer,
      })
      .returning({ id: faqs.id });

    await logActivity({
      action: "CREATE",
      entity: "Faq",
      entityId: String(inserted.id),
      description: `Menambahkan FAQ baru: ${validatedData.question.substring(0, 50)}...`,
      ipAddress: ip,
    });

    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true };
  } catch (dbErr) {
    console.error("Gagal simpan FAQ:", dbErr);
    return { error: "Terjadi kesalahan database saat menyimpan FAQ." };
  }
}

export async function updateFaq(
  faqId: number,
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Silakan login kembali." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rawData = {
    question: formData.get("question"),
    answer: formData.get("answer"),
  };

  const parsed = faqSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { error: `Validasi gagal: ${errorMsg}` };
  }

  const validatedData = parsed.data;

  try {
    const [currentFaq] = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, faqId))
      .limit(1);

    if (!currentFaq) {
      return { error: "Data FAQ tidak ditemukan." };
    }

    await db
      .update(faqs)
      .set({
        question: validatedData.question,
        answer: validatedData.answer,
      })
      .where(eq(faqs.id, faqId));

    await logActivity({
      action: "UPDATE",
      entity: "Faq",
      entityId: String(faqId),
      description: `Mengubah FAQ: ${validatedData.question.substring(0, 50)}...`,
      ipAddress: ip,
    });

    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true };
  } catch (err) {
    console.error("Gagal ubah FAQ:", err);
    return { error: "Terjadi kesalahan database saat memperbarui FAQ." };
  }
}

export async function deleteFaq(faqId: number): Promise<ActionState> {
  if (isPreviewMode()) {
    return { error: "Fitur dinonaktifkan pada Preview Deployment." };
  }
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  try {
    const [currentFaq] = await db
      .select()
      .from(faqs)
      .where(eq(faqs.id, faqId))
      .limit(1);

    if (!currentFaq) {
      return { error: "Data FAQ tidak ditemukan." };
    }

    await db.delete(faqs).where(eq(faqs.id, faqId));

    await logActivity({
      action: "DELETE",
      entity: "Faq",
      entityId: String(faqId),
      description: `Menghapus FAQ: ${currentFaq.question.substring(0, 50)}...`,
      ipAddress: ip,
    });

    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true };
  } catch (err) {
    console.error("Gagal hapus FAQ:", err);
    return { error: "Terjadi kesalahan saat menghapus FAQ." };
  }
}
