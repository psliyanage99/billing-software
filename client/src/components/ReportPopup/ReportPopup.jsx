import React from "react";
import "./ReportPopup.css";

const ReportPopup = ({ orders, fromDate, toDate, onClose }) => {
    // ✅ Calculate total sales
    const totalSales = orders.reduce((sum, order) => sum + order.grandTotal, 0);

    // ✅ Format items
    const formatItems = (items = []) =>
        items.map(item => `${item.name} x ${item.quantity}`).join(", ");

    // ✅ Format date
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    // ✅ Print / Save as PDF
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="report-popup-overlay">
            <div className="report-popup">
                {/* Header */}
                <div className="report-popup-header">
                    <h2>Order Report</h2>
                    <button className="btn btn-danger" onClick={onClose}>&times;</button>
                </div>

                {/* Date Range */}
                <p>
                    <strong>From:</strong> {fromDate || "N/A"} <br />
                    <strong>To:</strong> {toDate || "N/A"}
                </p>

                {/* Orders Table */}
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>
                                        {order.customerName} <br />
                                        <small className="text-muted">{order.phoneNumber}</small>
                                    </td>
                                    <td>{formatItems(order.items)}</td>
                                    <td>Rs.{order.grandTotal}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{order.paymentDetails?.status || "PENDING"}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total Sales */}
                <div className="total-sales">
                    <strong>Total Sales:</strong> Rs.{totalSales.toFixed(2)}
                </div>

                {/* Actions */}
                <div className="popup-actions">
                    <button className='btn btn-warning' onClick={handlePrint}>Print Report</button>
                    <button className='btn btn-danger' onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ReportPopup;
