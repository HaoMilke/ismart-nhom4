package com.example.namtronlogin.service;

import com.example.namtronlogin.dto.product.ProductRequestDTO;
import com.example.namtronlogin.dto.product.ProductResponseDTO;
import com.example.namtronlogin.entity.Product;
import com.example.namtronlogin.exception.ResourceNotFoundException;
import com.example.namtronlogin.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public ProductResponseDTO getProductById(Long id) {
        Product product = findProductById(id);
        return toResponseDTO(product);
    }

    public List<ProductResponseDTO> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // Dùng chung cho Admin thêm/sửa/xóa sản phẩm
    public ProductResponseDTO createProduct(ProductRequestDTO request) {
        Product product = new Product();
        mapRequestToEntity(request, product);
        Product saved = productRepository.save(product);
        return toResponseDTO(saved);
    }

    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = findProductById(id);
        mapRequestToEntity(request, product);
        Product saved = productRepository.save(product);
        return toResponseDTO(saved);
    }

    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        productRepository.delete(product);
    }

    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + id));
    }

    private void mapRequestToEntity(ProductRequestDTO request, Product product) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
    }

    private ProductResponseDTO toResponseDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setImageUrl(product.getImageUrl());
        dto.setCategory(product.getCategory());
        return dto;
    }
}