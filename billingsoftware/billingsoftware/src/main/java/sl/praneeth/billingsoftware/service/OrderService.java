package sl.praneeth.billingsoftware.service;

import sl.praneeth.billingsoftware.io.OrderRequest;
import sl.praneeth.billingsoftware.io.OrderResponse;
import sl.praneeth.billingsoftware.io.PaymentVerificationRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    void deleteOrder(String orderId);

    List<OrderResponse> getLatestOrders();

    OrderResponse verifyPayment(PaymentVerificationRequest request);

    Double sumSalesByDate(LocalDate date);

    Long countByOrderDate(LocalDate date);

    List<OrderResponse> findRecentOrders();

    Map<LocalDate, Double> getWeeklySales(LocalDate startOfWeek, LocalDate endOfWeek);
}
