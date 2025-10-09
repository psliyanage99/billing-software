import './CartSummary.css';
import { useContext, useState, useRef, useEffect } from "react";
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


    const [cashInputVisible, setCashInputVisible] = useState(false);
    const cashInputRef = useRef(null);
    const [cashReceived, setCashReceived] = useState("");
    const [balance, setBalance] = useState(0);

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = totalAmount * 0;
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

   
    const handleCashChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setCashReceived(value);
        setBalance(value - grandTotal);
    };


    
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

    useEffect(() => {
    if (cashInputVisible && cashInputRef.current) {
        cashInputRef.current.focus();
    }
}, [cashInputVisible]);

useEffect(() => {
    const handleEnterKey = (e) => {
        if (e.key === "Enter" && !isProcessing && orderDetails) {
            placeOrder();
        }
    };

    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
}, [isProcessing, orderDetails]);

    

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
            </div>

            
            {cashInputVisible && (
                <div className="mb-3">
                    <input
                        ref={cashInputRef}
                        type="number"
                        className="form-control"
                        placeholder="Enter cash received"
                        value={cashReceived}
                        onChange={handleCashChange}
                        onKeyDown={(e) => e.key === "Enter" && confirmCashPayment()}
                    />
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
                    {isProcessing ? "Processing..." : "Card"}
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
