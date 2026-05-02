package com.example.backend.controller;


import com.example.backend.dto.ProductDTO;
import com.example.backend.entity.Product;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductService service;


    @GetMapping("/categories")
    public List<String> getProductsCategory() {
        return service.getAllCategory();
    }

    @GetMapping("/all")
    public List<ProductDTO> getAllProduct(){
        return service.getAllProduct();
    }

    @GetMapping
    public void getProducts() {
        service.fetchAndSaveProducts();
    }

}
