/**
 * Format string "YYYY-MM-DD" menjadi "DD Month YYYY" (Bahasa Indonesia).
 * Contoh: "2005-08-17" -> "17 Agustus 2005"
 * Digunakan untuk menampilkan Tanggal Lahir, Tanggal Masuk, dll.
 */
export const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '-';

    // Pastikan input adalah string YYYY-MM-DD atau ISO
    // Kita hanya ambil bagian tanggalnya saja agar tidak kena timezone shift
    const cleanDate = dateString.split('T')[0];
    const [year, month, day] = cleanDate.split('-');

    if (!year || !month || !day) return dateString; // Fallback jika format salah

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
};

/**
 * Format ISO String (UTC) menjadi Waktu Lokal (WIB/Browser Time).
 * Contoh: "2024-02-05T08:30:00Z" -> "5 Feb 2024, 15:30"
 * Digunakan untuk created_at, updated_at, timestamp log.
 */
export const formatTimestamp = (isoString?: string | null): string => {
    if (!isoString) return '-';

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

/**
 * Menghitung Usia berdasarkan Tanggal Lahir.
 * Contoh: "2010-01-01" -> 14 (jika tahun ini 2024)
 */
export const calculateAge = (dateString?: string | null): number | null => {
    if (!dateString) return null;

    const today = new Date();
    const birthDate = new Date(dateString);

    if (isNaN(birthDate.getTime())) return null;

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // Jika belum ulang tahun di tahun ini, kurangi 1
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};
