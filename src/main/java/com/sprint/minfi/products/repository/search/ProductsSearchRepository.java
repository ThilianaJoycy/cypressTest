package com.sprint.minfi.products.repository.search;
import com.sprint.minfi.products.domain.Products;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Products} entity.
 */
public interface ProductsSearchRepository extends ElasticsearchRepository<Products, Long> {
}
