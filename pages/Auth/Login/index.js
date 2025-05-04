'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (username === 'admin' && password === 'admin') {
        router.push('/dashboard');
      } else {
        setError('Username atau password salah');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login');
    }
  };

  return (
    <div className="min-h-screen flex">
      <Head>
        <title>Portal PKL - Dinas Kesehatan Kota Padang</title>
      </Head>
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-full relative">
        <Image
          src="/dinkes-image.jpg"
          alt="Dinas Kesehatan"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portal PKL</h1>
            <h2 className="text-xl text-gray-600">Dinas Kesehatan</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Username
              </label>
              <Input
                className='text-black'
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <Input
                className='text-black'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
              />
            </div>

            <div className="flex items-center">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                className="h-4 w-4"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                Ingat saya
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
            >
              Login
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Belum memiliki akun?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Daftar disini
              </a>
            </p>
          </div>

          <footer className="text-center mt-8 text-sm text-gray-500">
            © 2024 Dinas Kesehatan Kota Padang. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}