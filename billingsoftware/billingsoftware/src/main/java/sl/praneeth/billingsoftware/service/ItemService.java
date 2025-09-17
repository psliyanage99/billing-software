package sl.praneeth.billingsoftware.service;

import org.springframework.web.multipart.MultipartFile;
import sl.praneeth.billingsoftware.io.ItemRequest;
import sl.praneeth.billingsoftware.io.ItemResponse;

import java.io.IOException;
import java.util.List;

public interface ItemService {

    ItemResponse add(ItemRequest request, MultipartFile file) throws IOException;

    List<ItemResponse> fetchItems();

    void deleteItem(String itemId);
}
