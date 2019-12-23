package com.sprint.minfi.products.repository.search;
import com.sprint.minfi.products.domain.Categories;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Categories} entity.
 */
public interface CategoriesSearchRepository extends ElasticsearchRepository<Categories, Long> {
}
