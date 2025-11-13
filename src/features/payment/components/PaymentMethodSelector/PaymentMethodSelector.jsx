import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import "./PaymentMethodSelector.css";

const methods = [
  { id: "VIETQR", name: "VietQR", img: "/vietqr.png" },
  { id: "VNPAY", name: "VNPAY", img: "/vnpay.png" },
  { id: "VIETTEL_PAY", name: "Viettel Money", img: "/viettelmoney.png" },
  { id: "PAYPAL", name: "Payoo", img: "/payoo.png" },
];

export default function PaymentMethodSelector({ selected, onSelect }) {
  return (
    <div className="payment-methods">
      {methods.map((m) => (
        <label
          key={m.id}
          className={`payment-method ${selected === m.id ? "selected" : ""}`}
          onClick={() => onSelect(m.id)}
        >
          <span className="custom-radio">
            {selected === m.id && (
              <span className="checkmark">
                <IoMdCheckmark />
              </span>
            )}
          </span>
          <img src={m.img} alt={m.name} />
          <span>{m.name}</span>
        </label>
      ))}
    </div>
  );
}

