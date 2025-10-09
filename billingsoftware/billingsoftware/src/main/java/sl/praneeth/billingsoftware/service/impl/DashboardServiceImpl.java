package sl.praneeth.billingsoftware.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sl.praneeth.billingsoftware.entity.OrderEntity;
import sl.praneeth.billingsoftware.entity.OrderItemEntity;
import sl.praneeth.billingsoftware.io.DashboardResponse;
import sl.praneeth.billingsoftware.io.ItemSalesVolumeResponse;
import sl.praneeth.billingsoftware.repository.OrderEntityRepository;
import sl.praneeth.billingsoftware.service.DashboardService;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final OrderEntityRepository orderEntityRepository;

    @Override
    public DashboardResponse getDashboardData() {
        DashboardResponse response = new DashboardResponse();

        // === Basic Stats ===
        LocalDate today = LocalDate.now();
        List<OrderEntity> todayOrders = orderEntityRepository.findAll().stream()
                .filter(o -> o.getCreatedAt().toLocalDate().isEqual(today))
                .collect(Collectors.toList());

        double todaySales = todayOrders.stream()
                .mapToDouble(OrderEntity::getGrandTotal)
                .sum();

        response.setTodaySales(todaySales);
        response.setTodayOrderCount((long) todayOrders.size());

        // === Weekly Sales (already implemented) ===
        // response.setWeeklySales(...);

        // === Item Sales Volume for Pie Chart ===
        Map<String, Long> volumeMap = new HashMap<>();

        for (OrderEntity order : todayOrders) {
            for (OrderItemEntity item : order.getItems()) {
                volumeMap.merge(item.getName(), (long) item.getQuantity(), Long::sum);
            }
        }

        List<ItemSalesVolumeResponse> itemVolumeList = volumeMap.entrySet()
                .stream()
                .map(e -> new ItemSalesVolumeResponse(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        response.setItemSalesVolume(itemVolumeList);

        // === Recent Orders if needed ===
        response.setRecentOrders(Collections.emptyList()); // or populate as before

        return response;
    }
}
