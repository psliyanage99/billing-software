package sl.praneeth.billingsoftware.io;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ItemSalesVolumeResponse {
    private String name;    // Item name
    private Long volume;
}
