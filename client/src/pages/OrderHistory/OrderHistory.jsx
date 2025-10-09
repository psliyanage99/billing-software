import { useEffect, useState } from 'react';
import './OrderHistory.css';
import { latestOrders } from '../../Service/OrderService';
import ReportPopup from '../../components/ReportPopup/ReportPopup';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showReport, setShowReport] = useState(false);

    // Filter orders by keyword and date
    const filteredOrders = orders.filter(order => {
        const keyword = searchTerm.toLowerCase();
        const orderDate = new Date(order.createdAt);

        const matchesKeyword =
            order.customerName?.toLowerCase().includes(keyword) ||
            order.phoneNumber?.toLowerCase().includes(keyword) ||
            order.items?.some(item => item.name.toLowerCase().includes(keyword));

        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const matchesDate =
            (!from || orderDate >= from) &&
            (!to || orderDate <= to);

        return matchesKeyword && matchesDate;
    });

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await latestOrders();
                setOrders(response.data || []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Format items
    const formatItems = (items = []) =>
        items.map(item => `${item.name} x ${item.quantity}`).join(', ');

    // Format date
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return <div className="text-center py-4">Loading orders...</div>;
    }

    return (
        <div className="order-history-container">

            
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-2 text-light">Recent Orders</h2>

                <div className="input-group" style={{ maxWidth: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search by keyword"
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="input-group-text bg-warning">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </div>

            
            <div className="d-flex gap-2 mb-3 flex-wrap">
                <div>
                    <label className="form-label text-light">From:</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="form-label text-light">To:</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <button
                    className="btn btn-success align-self-end"
                    onClick={() => setShowReport(true)}
                >
                    Generate Report
                </button>
            </div>

            
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Order Id</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>
                                        {order.customerName} <br />
                                        <small className="text-muted">{order.phoneNumber}</small>
                                    </td>
                                    <td>{formatItems(order.items)}</td>
                                    <td>Rs.{order.grandTotal}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                order.paymentDetails?.status === 'COMPLETED'
                                                    ? 'bg-success'
                                                    : 'bg-warning text-dark'
                                            }`}
                                        >
                                            {order.paymentDetails?.status || 'PENDING'}
                                        </span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            
            {showReport && (
                <ReportPopup
                    orders={filteredOrders}
                    fromDate={fromDate}
                    toDate={toDate}
                    onClose={() => setShowReport(false)}
                />
            )}
        </div>
    );
};

export default OrderHistory;
