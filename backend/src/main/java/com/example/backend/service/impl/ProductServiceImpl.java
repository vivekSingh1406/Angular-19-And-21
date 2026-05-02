package com.example.backend.service.impl;

import com.example.backend.dto.ProductDTO;
import com.example.backend.dto.ProductResponse;
import com.example.backend.dto.ReviewDTO;
import com.example.backend.entity.Product;
import com.example.backend.entity.Review;
import com.example.backend.feign.ProductFeignClient;
import com.example.backend.repository.ProductRepository;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {


    private final ProductFeignClient feignClient;
    private final ProductRepository repository;

    @Override
    public void fetchAndSaveProducts() {
        ProductResponse response = feignClient.getProducts();

        List<Product> productList = new ArrayList<>();

        for (ProductDTO dto : response.getProducts()) {

            Product product = new Product();

            product.setId(dto.getId());
            product.setTitle(dto.getTitle());
            product.setDescription(dto.getDescription());
            product.setPrice(dto.getPrice());
            product.setBrand(dto.getBrand());
            product.setCategory(dto.getCategory());
            product.setRating(dto.getRating());
            product.setStock(dto.getStock());
            product.setThumbnail(dto.getThumbnail());

            List<Review> reviewList = new ArrayList<>();

            if (dto.getReviews() != null) {

                for (ReviewDTO reviewDTO : dto.getReviews()) {

                    Review review = new Review();

                    review.setRating(reviewDTO.getRating());
                    review.setComment(reviewDTO.getComment());
                    review.setDate(reviewDTO.getDate());
                    review.setReviewerName(reviewDTO.getReviewerName());
                    review.setReviewerEmail(reviewDTO.getReviewerEmail());

                    review.setProduct(product);
                    reviewList.add(review);
                }
            }
            product.setReviews(reviewList);
            productList.add(product);
        }
        repository.saveAll(productList);
    }

    @Override
    public List<String> getAllCategory() {
        return repository.getAllCategories();
    }

    @Override
    public List<ProductDTO> getAllProduct() {

        List<Product> allProducts = repository.findAll();

        List<ProductDTO> productDTOList = new ArrayList<>();

        for (Product product : allProducts) {

            ProductDTO dto = new ProductDTO();

            dto.setId(product.getId());
            dto.setTitle(product.getTitle());
            dto.setDescription(product.getDescription());
            dto.setPrice(product.getPrice());
            dto.setBrand(product.getBrand());
            dto.setCategory(product.getCategory());
            dto.setRating(product.getRating());
            dto.setStock(product.getStock());
            dto.setThumbnail(product.getThumbnail());

            List<ReviewDTO> reviewDTOList = new ArrayList<>();

            if (product.getReviews() != null) {

                for (Review review : product.getReviews()) {

                    ReviewDTO reviewDTO = new ReviewDTO();

                    reviewDTO.setRating(review.getRating());
                    reviewDTO.setComment(review.getComment());
                    reviewDTO.setDate(review.getDate());
                    reviewDTO.setReviewerName(review.getReviewerName());
                    reviewDTO.setReviewerEmail(review.getReviewerEmail());
                    reviewDTOList.add(reviewDTO);
                }
            }

            dto.setReviews(reviewDTOList);

            productDTOList.add(dto);
        }

        return productDTOList;
    }
}
