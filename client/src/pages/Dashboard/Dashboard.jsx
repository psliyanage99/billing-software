import './Dashboard.css';
import { useEffect, useState } from "react";
import { fetchDashboardData } from "../../Service/Dashboard";
import toast from "react-hot-toast";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    Cell,
    PieChart,
    Pie
} from "recharts";

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load dashboard data
    const loadData = async () => {
        try {
            const response = await fetchDashboardData();
            setData(response.data);
            console.log("Dashboard Data:", response.data);
        } catch (error) {
            console.error(error);
            toast.error("Unable to view the data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(() => loadData(), 10000); // refresh every 10s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="loading">Loading dashboard...</div>;
    if (!data) return <div className="error">Failed to load the dashboard data...</div>;

    // === Weekly Sales Chart ===
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayIndex = new Date().getDay();

    const chartData = days.map((day, index) => {
        let sales = 0;

        if (Array.isArray(data.weeklySales)) {
            const dayData = data.weeklySales.find(d => d.day === day);
            if (dayData) {
                sales = Number(dayData.sales);
            } else {
                const dateData = data.weeklySales.find(d =>
                    new Date(d.date).getDay() === index
                );
                if (dateData) sales = Number(dateData.sales);
            }
        } else if (typeof data.weeklySales === "object" && data.weeklySales !== null) {
            sales = Number(data.weeklySales[day]) || 0;
        }

        return { day, sales, isToday: index === todayIndex };
    });

    // === Donut Pie Chart Data ===
    const itemSalesVolume = data.itemSalesVolume || []; 
    // expected format: [{ name: "Item A", volume: 120 }, { name: "Item B", volume: 90 }, ...]

    console.log("Item Sales Volume:", data.itemSalesVolume);
    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="bi">Rs.</i>
                        </div>
                        <div className="stat-content">
                            <h3>Today's Sales</h3>
                            <p>Rs.{data.todaySales.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <i className="bi bi-cart-check"></i>
                        </div>
                        <div className="stat-content">
                            <h3>Today's Orders</h3>
                            <p>{data.todayOrderCount}</p>
                        </div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="chart-card">
                        <h3 className="chart-title">
                            <i className="bi bi-bar-chart-line"></i> Weekly Sales
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" name="Sales (Rs.)">
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.isToday ? "#ff6b6b" : "#20c997"}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                
                    <div className="chart-card">
                        <h3 className="chart-title">
                            <i className="bi bi-pie-chart"></i> Sales Volume by Item
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={itemSalesVolume}
                                    dataKey="volume"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    paddingAngle={3}
                                    label
                                >
                                    {itemSalesVolume.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#a805a2ff", "#11D7FF", "#149512ff"][index % 8]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                {/* <Legend /> */}
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                
                <div className="main-content">
                    
                    <div className="recent-orders-card">
                        <h3 className="recent-orders-title">
                            <i className="bi bi-clock-history"></i> Recent Orders
                        </h3>
                        <div className="orders-table-container">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentOrders.map((order) => (
                                        <tr key={order.orderId}>
                                            <td>{order.orderId.substring(0, 8)}...</td>
                                            <td>{order.customerName}</td>
                                            <td>Rs.{order.grandTotal.toFixed(2)}</td>
                                            <td>
                                                <span className={`payment-method ${order.paymentMethod.toLowerCase()}`}>
                                                    {order.paymentMethod}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${order.paymentDetails.status.toLowerCase()}`}>
                                                    {order.paymentDetails.status}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(order.createdAt).toLocaleDateString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
