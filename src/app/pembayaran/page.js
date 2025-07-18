
export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import PembayaranClient from "./PembayaranClient";

export default function PembayaranPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PembayaranClient />
    </Suspense>
  );
}
