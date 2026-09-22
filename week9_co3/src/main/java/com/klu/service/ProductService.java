package com.klu.service;
import com.klu.model.Product;
import java.util.List;
public interface ProductService {
List<Product> getAllProducts();
Product getProductById(Long id);
Product saveProduct(Product product);
Product updateProduct(Long id, Product product); // This should return an updated Product
void deleteProduct(Long id); // Follow consistent parameter naming
}
