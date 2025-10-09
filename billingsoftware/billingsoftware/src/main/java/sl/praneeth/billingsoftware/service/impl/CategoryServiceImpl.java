package sl.praneeth.billingsoftware.service.impl;

import org.springframework.util.StringUtils;
import sl.praneeth.billingsoftware.entity.CategoryEntity;
import sl.praneeth.billingsoftware.io.CategoryRequest;
import sl.praneeth.billingsoftware.io.CategoryResponse;
import sl.praneeth.billingsoftware.repository.CategoryRepository;
import sl.praneeth.billingsoftware.repository.ItemRepository;
import sl.praneeth.billingsoftware.service.CategoryService;
import sl.praneeth.billingsoftware.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final FileUploadService fileUploadService;
    private final ItemRepository itemRepository;

    @Override
    public CategoryResponse add(CategoryRequest request, MultipartFile file) throws IOException {
        String imgUrl = fileUploadService.uploadFile(file);

        // File upload to local directory
//        String fileName = UUID.randomUUID().toString()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
//        Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
//        Files.createDirectories(uploadPath);
//        Path targetLocation = uploadPath.resolve(fileName);
//        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
//        String imgUrl = "http://localhost:8080/api/v1.0/uploads/"+fileName;
        CategoryEntity newCategory = convertToEntity(request);
        newCategory.setImgUrl(imgUrl);
        newCategory = categoryRepository.save(newCategory);
        return convertToResponse(newCategory);
    }

    @Override
    public List<CategoryResponse> read() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryEntity -> convertToResponse(categoryEntity))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse update(String categoryId, CategoryRequest request, MultipartFile file) {
        CategoryEntity existingCategory = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));

        // If a new image file is provided, replace it
        if (file != null && !file.isEmpty()) {
            // Delete old image
            fileUploadService.deleteFile(existingCategory.getImgUrl());
            // Upload new image
            String newImgUrl = fileUploadService.uploadFile(file);
            existingCategory.setImgUrl(newImgUrl);
        }

        // Update other fields
        existingCategory.setName(request.getName());
        existingCategory.setDescription(request.getDescription());
        existingCategory.setBgColor(request.getBgColor());

        // Save updated category
        CategoryEntity updatedCategory = categoryRepository.save(existingCategory);

        return convertToResponse(updatedCategory);
    }

    @Override
    public void delete(String categoryId) {
        CategoryEntity existingCategory = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: "+categoryId));
        fileUploadService.deleteFile(existingCategory.getImgUrl());
        categoryRepository.delete(existingCategory);
    }

    private CategoryResponse convertToResponse(CategoryEntity newCategory) {
        Integer itemsCount = itemRepository.countByCategoryId(newCategory.getId());
        return CategoryResponse.builder()
                .categoryId(newCategory.getCategoryId())
                .name(newCategory.getName())
                .description(newCategory.getDescription())
                .bgColor(newCategory.getBgColor())
                .imgUrl(newCategory.getImgUrl())
                .createdAt(newCategory.getCreatedAt())
                .updatedAt(newCategory.getUpdatedAt())
                .items(itemsCount)
                .build();
    }


    private CategoryEntity convertToEntity(CategoryRequest request) {
        return CategoryEntity.builder()
                .categoryId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .bgColor(request.getBgColor())
                .build();
    }
}
