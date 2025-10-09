import { useEffect } from 'react';
import './ReceiptPopup.css';
import './Print.css';

const ReceiptPopup = ({orderDetails, onClose, onPrint}) => {
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                onPrint();       
                setTimeout(() => {
                    onClose();   
                    window.location.reload();
                }, 500);          
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        // cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [onPrint, onClose]);
    return (
        <div className='receipt-popup-overlay text-dark'>
            <div className="receipt-popup">

                <h4 className="text-center mb-0">NEW CITY RESTAURANT</h4>
                <p className="text-center mb-0">Tangalle</p>
                <p className="text-center mb-2">Tel: 071-8899048</p>

                <hr className="my-2" />

                <div className="d-flex justify-content-between">
                    <span>{new Date(orderDetails.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span>{new Date(orderDetails.createdAt || Date.now()).toLocaleTimeString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span>Cashier: {orderDetails.cashier || "Praneeth"}</span>
                    <span>Order No: {orderDetails.orderId}</span>
                </div>

                <hr className="my-2" />

                <p className="mb-1"><strong>Customer Name:</strong> {orderDetails.customerName}</p>
                <p className="mb-2"><strong>Customer Phone:</strong> {orderDetails.phoneNumber}</p>

                <hr className="my-2" />

                <div className="mb-2 fw-bold d-flex justify-content-between">
                    <span>NO  ITEM</span>
                    <span>QTY  PRICE</span>
                </div>

                {orderDetails.items.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between mb-1">
                        <span>{index + 1}. {item.name}</span>
                        <span>{item.quantity} x {item.price.toFixed(2)}</span>
                    </div>
                ))}

                <hr className="my-2" />

                <div className="d-flex justify-content-between mb-1">
                    <span>Sub Total</span>
                    <span>Rs.{orderDetails.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-1">
                    <span>Tax (0%)</span>
                    <span>Rs.{orderDetails.tax.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between fw-bold mb-1">
                    <span>Net Total</span>
                    <span>Rs.{orderDetails.grandTotal.toFixed(2)}</span>
                </div>


                {orderDetails.paymentMethod === "CASH" && (
                <>
                    <div className="d-flex justify-content-between mb-1">
                        <span>CASH</span>
                        <span>Rs.{orderDetails.cashReceived?.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                        <span>Balance</span>
                        <span>Rs.{orderDetails.balance?.toFixed(2)}</span>
                    </div>
                </>
                )}

                {orderDetails.paymentMethod === "Card" && (
                    <>
                        <p className="mb-1"><strong>Your payment is done by card.</strong> </p>
                    </>
                )}
                
                <hr className="my-2" />

                <p>
                    <strong>Payment Method:</strong> {orderDetails.paymentMethod}
                </p>

                <p className="text-center small">Thank you for shopping with us!</p>

                <div className="d-flex justify-content-end gap-3 mt-3">
                    <button className="btn btn-warning" onClick={onPrint}>Print Receipt</button>
                    <button 
                        className="btn btn-danger" 
                        onClick={() => {
                            onClose();                 
                            window.location.reload();  
                        }}
                    >
                        Close
                    </button>
                </div>
                
                
            </div>
        </div>
    )
}

export default ReceiptPopup;