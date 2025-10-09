package sl.praneeth.billingsoftware.service;

import org.springframework.web.multipart.MultipartFile;
import sl.praneeth.billingsoftware.io.CategoryRequest;
import sl.praneeth.billingsoftware.io.CategoryResponse;

import java.io.IOException;
import java.util.List;

public interface CategoryService {

    CategoryResponse add(CategoryRequest request, MultipartFile file) throws IOException;

    List<CategoryResponse> read();

    void delete(String categoryId);

    CategoryResponse update(String categoryId, CategoryRequest request, MultipartFile file);
}