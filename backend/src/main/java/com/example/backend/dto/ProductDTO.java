package com.example.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductDTO {


    private Long id;
    private String title;
    private String description;
    private Double price;
    private String brand;
    private String category;
    private Double rating;
    private Integer stock;
    private String thumbnail;

    private List<ReviewDTO> reviews;
}
