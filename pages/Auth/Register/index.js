'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import kampusData from '../../../data/kampus.json';

export default function Register() {
  const [jurusan, setJurusan] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [kampus, setKampus] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [filteredJurusan, setFilteredJurusan] = useState([]);
  const router = useRouter();

  // Filter jurusan based on selected kampus
  useEffect(() => {
    if (kampus) {
      const selectedKampus = kampusData.find((k) => k.id.toString() === kampus);
      setFilteredJurusan(selectedKampus?.jurusan || []);
      setJurusan(''); // Reset jurusan when kampus changes
    } else {
      setFilteredJurusan([]);
      setJurusan('');
    }
  }, [kampus]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Placeholder: Replace with actual API call
      if (password === 'admin') {
        // Example: Include kampus and jurusan in the payload
        const formData = {
          fullName,
          studentId,
          kampus: kampusData.find((k) => k.id.toString() === kampus)?.nama,
          jurusan,
          email,
          gender,
          address,
          password,
        };
        console.log('Form Data:', formData);
        router.push('/dashboard');
      } else {
        setError('Password salah');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat Register');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <Head>
        <title>Portal PKL - Dinas Kesehatan Kota Padang</title>
      </Head>

      {/* Left side - Image (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/dinkes-image.jpg"
          alt="Dinas Kesehatan"
          layout="fill"
          objectFit="cover"
          priority
          className="brightness-90"
        />
        <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
          <div className="text-center px-8 text-white">
            <h1 className="text-4xl font-bold mb-4">Portal PKL</h1>
            <p className="text-xl">Dinas Kesehatan Kota Padang</p>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="lg:hidden mb-6">
              <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Pendaftaran PKL</h2>
            <p className="mt-2 text-sm text-gray-600">Silakan isi formulir berikut untuk mendaftar</p>
          </div>

          <form onSubmit={handleRegister} className="mt-8 space-y-6">
            <div className="rounded-md space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <Input
                    className="w-full bg-white"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor BP</label>
                  <Input
                    className="w-full bg-white"
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Masukkan nomor BP"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                  <Select value={gender} onValueChange={setGender} required>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    className="w-full bg-white"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email"
                    required
                  />
                </div>
              </div>

              {/* Full width fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <Input
                  className="w-full bg-white"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kampus</label>
                <Select value={kampus} onValueChange={setKampus} required>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Pilih kampus" />
                  </SelectTrigger>
                  <SelectContent>
                    {kampusData.length > 0 ? (
                      kampusData.map((kampus) => (
                        <SelectItem key={kampus.id} value={kampus.id.toString()}>
                          {kampus.nama}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Tidak ada kampus tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                <Select value={jurusan} onValueChange={setJurusan} required disabled={!kampus}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder={kampus ? 'Pilih jurusan' : 'Pilih kampus terlebih dahulu'} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredJurusan.length > 0 ? (
                      filteredJurusan.map((j) => (
                        <SelectItem key={j.nama} value={j.nama}>
                          {j.nama}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no_jurusan" disabled>
                        Tidak ada jurusan tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input
                  className="w-full bg-white"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Buat password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">{error}</div>
            )}

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Daftar Sekarang
              </Button>
            </div>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Sudah memiliki akun?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Masuk disini
              </a>
            </p>
          </div>

          <footer className="text-center text-xs text-gray-500 mt-8">
            © {new Date().getFullYear()} Dinas Kesehatan Kota Padang. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}