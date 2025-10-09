package sl.praneeth.billingsoftware.controller;


import sl.praneeth.billingsoftware.io.DashboardResponse;
import sl.praneeth.billingsoftware.io.ItemSalesVolumeResponse;
import sl.praneeth.billingsoftware.io.OrderResponse;
import sl.praneeth.billingsoftware.service.DashboardService;
import sl.praneeth.billingsoftware.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final OrderService orderService;
    private final DashboardService dashboardService;
    @GetMapping
    public DashboardResponse getDashboardData() {
        LocalDate today = LocalDate.now();
        Double todaySale = orderService.sumSalesByDate(today);
        Long todayOrderCount = orderService.countByOrderDate(today);
        List<OrderResponse> recentOrders = orderService.findRecentOrders();
        List<ItemSalesVolumeResponse> itemSalesVolume = dashboardService.getDashboardData().getItemSalesVolume();

        Map<String, Double> weeklySales = new LinkedHashMap<>();
        String[] days = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
        LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() % 7);

        for (int i = 0; i < 7; i++) {
            LocalDate dayDate = startOfWeek.plusDays(i);
            double sales = Optional.ofNullable(orderService.sumSalesByDate(dayDate)).orElse(0.0);
            weeklySales.put(days[dayDate.getDayOfWeek().getValue() % 7], sales);
        }


        return new DashboardResponse(
                todaySale != null ? todaySale : 0.0,
                todayOrderCount != null ? todayOrderCount : 0,
                recentOrders,
                weeklySales,
                itemSalesVolume
        );
    }


}
