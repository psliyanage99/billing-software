package sl.praneeth.billingsoftware.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private Double todaySales;
    private Long todayOrderCount;
    private List<OrderResponse> recentOrders;
    private Map<String, Double> weeklySales;
    private List<ItemSalesVolumeResponse> itemSalesVolume;
}
