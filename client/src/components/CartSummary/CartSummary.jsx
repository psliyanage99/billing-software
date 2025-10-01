import './CartSummary.css';
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import ReceiptPopup from "../ReceiptPopup/ReceiptPopup.jsx";
import { createOrder, deleteOrder } from "../../Service/OrderService.js";
import toast from "react-hot-toast";
import { createRazorpayOrder, verifyPayment } from "../../Service/PaymentService.js";
import { AppConstants } from "../../utill/constants.js";

const CartSummary = ({ customerName, mobileNumber, setMobileNumber, setCustomerName }) => {
    const { cartItems, clearCart } = useContext(AppContext);

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    // ✅ NEW STATES
    const [cashInputVisible, setCashInputVisible] = useState(false);
    const [cashReceived, setCashReceived] = useState("");
    const [balance, setBalance] = useState(0);

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = totalAmount * 0.01;
    const grandTotal = totalAmount + tax;

    const clearAll = () => {
        setCustomerName("");
        setMobileNumber("");
        clearCart();
        setCashReceived("");
        setBalance(0);
    };

    const placeOrder = () => {
        setShowPopup(true);
        // clearAll();
    };

    const handlePrintReceipt = () => window.print();

    

    const deleteOrderOnFailure = async (orderId) => {
        try {
            await deleteOrder(orderId);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    // 🟢 When user clicks CASH button → show cash input field
    const handleCashClick = () => {
        if (!customerName || !mobileNumber) {
            toast.error("Please enter customer details");
            return;
        }
        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }
        setCashInputVisible(true);
    };

    // 🟢 Capture cash input and calculate balance
    const handleCashChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setCashReceived(value);
        setBalance(value - grandTotal);
    };


    // 🟢 Confirm payment after entering cash
    const confirmCashPayment = async () => {
        if (cashReceived < grandTotal) {
            toast.error("Cash is less than total amount");
            return;
        }

        const orderData = {
            customerName,
            phoneNumber: mobileNumber,
            cartItems,
            subtotal: totalAmount,
            tax,
            grandTotal,
            paymentMethod: "CASH",
            cashReceived,
            balance
        };

        setIsProcessing(true);
        try {
            const response = await createOrder(orderData);
            if (response.status === 201) {
                toast.success("Cash payment recorded");
                setOrderDetails(response.data);
                toast.success("Now click 'Place Order' to generate receipt");
                setCashInputVisible(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Cash payment failed");
        } finally {
            setIsProcessing(false);
        }
    };

    

    return (
        <div className="mt-2">
            <div className="cart-summary-details">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Items:</span>
                    <span className="text-light">Rs.{totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Tax (0%):</span>
                    <span className="text-light">Rs.{tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                    <span className="text-light">Total:</span>
                    <span className="text-light">Rs.{grandTotal.toFixed(2)}</span>
                </div>

                {/* 🟢 Show Cash & Balance after input */}
                {/* {cashReceived > 0 && (
                    <>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-light">Cash:</span>
                            <span className="text-light">Rs.{cashReceived.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-light">Balance:</span>
                            <span className="text-light">Rs.{balance.toFixed(2)}</span>
                        </div>
                    </>
                )} */}
            </div>

            {/* 🟢 Cash Input Field */}
            {cashInputVisible && (
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter cash received"
                        value={cashReceived}
                        onChange={handleCashChange}
                        onKeyDown={(e) => e.key === "Enter" && confirmCashPayment()}
                    />
                    <button
                        className="btn btn-success mt-2 w-100"
                        onClick={confirmCashPayment}
                        disabled={isProcessing}
                    >
                        Confirm Cash Payment
                    </button>
                </div>
            )}

            <div className="d-flex gap-3">
                <button
                    className="btn btn-success flex-grow-1"
                    onClick={handleCashClick}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "Cash"}
                </button>
                <button
                    className="btn btn-primary flex-grow-1"
                    onClick={() => toast.error("Use Razorpay for UPI")}
                    disabled={isProcessing}
                >
                    UPI
                </button>
            </div>

            <div className="d-flex gap-3 mt-3">
                <button
                    className="btn btn-warning flex-grow-1"
                    onClick={placeOrder}
                    disabled={isProcessing || !orderDetails}
                >
                    Place Order
                </button>
            </div>

            {showPopup && (
                <ReceiptPopup
                    orderDetails={{
                        ...orderDetails,
                        cashReceived: cashReceived,
                        balance: balance
            }}
                    onClose={() => setShowPopup(false)}
                    onPrint={handlePrintReceipt}
                />
            )}

            
        </div>
    );
};

export default CartSummary;
