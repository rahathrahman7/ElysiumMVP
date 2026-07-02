import { Suspense } from "react";
import CheckoutCancelContent from "./CheckoutCancelContent";

export default function CheckoutCancel() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="font-heading text-3xl md:text-4xl mb-4">Checkout cancelled</h1>
      </div>
    }>
      <CheckoutCancelContent />
    </Suspense>
  );
}
