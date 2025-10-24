"use client";

import { WaitlistIncentive } from "./components/WaitlistIncentive";
import { WaitlistForm } from "./components/WaitlistForm";

export default function WaitlistPage() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <WaitlistIncentive />
      <WaitlistForm />
    </div>
  );
}
