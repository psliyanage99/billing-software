package sl.praneeth.billingsoftware.service;

import org.springframework.web.multipart.MultipartFile;
import sl.praneeth.billingsoftware.io.CategoryRequest;
import sl.praneeth.billingsoftware.io.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse add(CategoryRequest request, MultipartFile file);

    List<CategoryResponse> read();

    void delete(String categoryId);
}