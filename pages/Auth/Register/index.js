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
  // Original state variables
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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Anti-scraping state variables
  const [formTouched, setFormTouched] = useState(false);
  const [mouseMovements, setMouseMovements] = useState(0);
  const [typingPattern, setTypingPattern] = useState([]);
  const [lastTypingTime, setLastTypingTime] = useState(null);
  const [formStartTime, setFormStartTime] = useState(Date.now());
  const [honeypotField, setHoneypotField] = useState('');
  const [formToken, setFormToken] = useState('');
  
  const router = useRouter();

  // Generate a form token on component mount
  useEffect(() => {
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    setFormToken(token);
    setFormStartTime(Date.now());
    
    // Track mouse movements
    const handleMouseMove = () => {
      setMouseMovements(prev => prev + 1);
      setFormTouched(true);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  // Track typing patterns
  const recordTypingPattern = () => {
    const now = Date.now();
    if (lastTypingTime) {
      const timeBetweenKeystrokes = now - lastTypingTime;
      setTypingPattern(prev => [...prev, timeBetweenKeystrokes].slice(-10));
    }
    setLastTypingTime(now);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!fullName.trim()) errors.fullName = "Nama lengkap wajib diisi";
    if (!studentId.trim()) errors.studentId = "Nomor BP wajib diisi";
    if (!gender) errors.gender = "Jenis kelamin wajib dipilih";
    if (!email.trim()) errors.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Format email tidak valid";
    if (!address.trim()) errors.address = "Alamat wajib diisi";
    if (!kampus) errors.kampus = "Kampus wajib dipilih";
    if (!jurusan) errors.jurusan = "Jurusan wajib dipilih";
    if (!password.trim()) errors.password = "Password wajib diisi";
    else if (password.length < 6) errors.password = "Password minimal 6 karakter";
    
    return errors;
  };

  // Check for bot behavior
  const isBotBehavior = () => {
    // Check if honeypot field is filled (bots often fill all fields)
    if (honeypotField) return true;
    
    // Check if form was completed too quickly (less than 10 seconds)
    const timeSpent = Date.now() - formStartTime;
    if (timeSpent < 10000) return true;
    
    // Check for lack of mouse movements
    if (mouseMovements < 5) return true;
    
    // Check for consistent typing patterns (bots often type at regular intervals)
    if (typingPattern.length > 5) {
      const avgTime = typingPattern.reduce((a, b) => a + b, 0) / typingPattern.length;
      const allSimilar = typingPattern.every(time => Math.abs(time - avgTime) < 100);
      if (allSimilar) return true;
    }
    
    // Check if form was never "touched" by user interactions
    if (!formTouched) return true;
    
    return false;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Check for bot behavior
    if (isBotBehavior()) {
      // Silently fail for bots - don't show error but don't proceed
      console.log('Bot behavior detected');
      setTimeout(() => {
        setIsSubmitting(false);
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }, 2000);
      return;
    }
    
    // Validate form
    const errors = validateForm();
    setFormErrors(errors);
    
    // If there are errors, stop submission
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Include anti-scraping data in the payload
      const formData = {
        fullName,
        studentId,
        kampus: kampusData.find((k) => k.id.toString() === kampus)?.nama,
        jurusan,
        email,
        gender,
        address,
        password,
        // Anti-scraping data
        formToken,
        timeSpent: Date.now() - formStartTime,
        mouseMovements,
        typingPatternSample: typingPattern.slice(-3),
      };
      
      // Replace with actual API call to your backend
      console.log('Form Data:', formData);
      
      // Simulate successful registration
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (error) {
      setError('Terjadi kesalahan saat Register');
    } finally {
      setIsSubmitting(false);
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
            {/* Hidden honeypot field to catch bots */}
            <div className="opacity-0 absolute top-0 left-0 h-0 w-0 -z-10 overflow-hidden">
              <label>
                Leave this field empty
                <input
                  type="text"
                  name="website"
                  value={honeypotField}
                  onChange={(e) => setHoneypotField(e.target.value)}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </label>
            </div>
            
            {/* Hidden form token */}
            <input type="hidden" name="formToken" value={formToken} />
            
            <div className="rounded-md space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                  <Input
                    className={`w-full text-gray-700 bg-white ${formErrors.fullName ? 'border-red-500' : ''}`}
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      recordTypingPattern();
                      if (formErrors.fullName) {
                        setFormErrors({...formErrors, fullName: null});
                      }
                    }}
                    onFocus={() => setFormTouched(true)}
                    placeholder="Masukkan nama lengkap"
                    required
                    autoComplete="name"
                    data-lpignore="true"
                  />
                  {formErrors.fullName && <p className="mt-1 text-xs text-red-500">{formErrors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor BP <span className="text-red-500">*</span></label>
                  <Input
                    className={`w-full text-gray-700 bg-white ${formErrors.studentId ? 'border-red-500' : ''}`}
                    type="text"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      recordTypingPattern();
                      if (formErrors.studentId) {
                        setFormErrors({...formErrors, studentId: null});
                      }
                    }}
                    onFocus={() => setFormTouched(true)}
                    placeholder="Masukkan nomor BP"
                    required
                    autoComplete="off"
                    data-lpignore="true"
                  />
                  {formErrors.studentId && <p className="mt-1 text-xs text-red-500">{formErrors.studentId}</p>}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin <span className="text-red-500">*</span></label>
                  <Select 
                    value={gender} 
                    onValueChange={(value) => {
                      setGender(value);
                      setFormTouched(true);
                      if (formErrors.gender) {
                        setFormErrors({...formErrors, gender: null});
                      }
                    }} 
                    required
                  >
                    <SelectTrigger className={`w-full text-gray-700 bg-white ${formErrors.gender ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.gender && <p className="mt-1 text-xs text-red-500">{formErrors.gender}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <Input
                    className={`w-full text-gray-700 bg-white ${formErrors.email ? 'border-red-500' : ''}`}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      recordTypingPattern();
                      if (formErrors.email) {
                        setFormErrors({...formErrors, email: null});
                      }
                    }}
                    onFocus={() => setFormTouched(true)}
                    placeholder="Masukkan email"
                    required
                    autoComplete="email"
                    data-lpignore="true"
                  />
                  {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                </div>
              </div>

              {/* Full width fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat <span className="text-red-500">*</span></label>
                <Input
                  className={`w-full text-gray-700 bg-white ${formErrors.address ? 'border-red-500' : ''}`}
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    recordTypingPattern();
                    if (formErrors.address) {
                      setFormErrors({...formErrors, address: null});
                    }
                  }}
                  onFocus={() => setFormTouched(true)}
                  placeholder="Masukkan alamat lengkap"
                  required
                  autoComplete="street-address"
                  data-lpignore="true"
                />
                {formErrors.address && <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kampus <span className="text-red-500">*</span></label>
                <Select 
                  value={kampus} 
                  onValueChange={(value) => {
                    setKampus(value);
                    setFormTouched(true);
                    if (formErrors.kampus) {
                      setFormErrors({...formErrors, kampus: null});
                    }
                  }} 
                  required
                >
                  <SelectTrigger className={`w-full text-gray-700 bg-white ${formErrors.kampus ? 'border-red-500' : ''}`}>
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
                      <SelectItem value="no_kampus" disabled>
                        Tidak ada kampus tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formErrors.kampus && <p className="mt-1 text-xs text-red-500">{formErrors.kampus}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan <span className="text-red-500">*</span></label>
                <Select 
                  value={jurusan} 
                  onValueChange={(value) => {
                    setJurusan(value);
                    setFormTouched(true);
                    if (formErrors.jurusan) {
                      setFormErrors({...formErrors, jurusan: null});
                    }
                  }} 
                  required 
                  disabled={!kampus}
                >
                  <SelectTrigger className={`w-full text-gray-700 bg-white ${formErrors.jurusan ? 'border-red-500' : ''}`}>
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
                {formErrors.jurusan && <p className="mt-1 text-xs text-red-500">{formErrors.jurusan}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <Input
                  className={`w-full text-gray-700 bg-white ${formErrors.password ? 'border-red-500' : ''}`}
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    recordTypingPattern();
                    if (formErrors.password) {
                      setFormErrors({...formErrors, password: null});
                    }
                  }}
                  onFocus={() => setFormTouched(true)}
                  placeholder="Buat password"
                  required
                  autoComplete="new-password"
                  data-lpignore="true"
                />
                {formErrors.password && <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>}
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">{error}</div>
            )}

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Daftar Sekarang'}
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
  )
}