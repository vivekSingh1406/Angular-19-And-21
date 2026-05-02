package com.example.backend.dto;

import lombok.Data;

@Data
public class ReviewDTO {

    private Integer rating;
    private String comment;
    private String date;
    private String reviewerName;
    private String reviewerEmail;
}
