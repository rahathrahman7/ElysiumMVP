import { Suspense } from "react";
import CheckoutSuccessContent from "./CheckoutSuccessContent";

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="font-heading text-3xl md:text-4xl mb-4">Thank you</h1>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
