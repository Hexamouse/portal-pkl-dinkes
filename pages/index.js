'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navigation-menu";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";

export default function Beranda() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
}