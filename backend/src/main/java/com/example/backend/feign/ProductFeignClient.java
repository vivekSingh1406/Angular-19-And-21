package com.example.backend.feign;


import com.example.backend.dto.ProductResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "dummyClient",
        url = "https://dummyjson.com"
)
public interface ProductFeignClient {

    @GetMapping("/products")
    ProductResponse getProducts();
}
