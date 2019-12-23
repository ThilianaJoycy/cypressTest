package com.sprint.minfi.products.web.rest;

import com.sprint.minfi.products.domain.Categories;
import com.sprint.minfi.products.repository.CategoriesRepository;
import com.sprint.minfi.products.repository.search.CategoriesSearchRepository;
import com.sprint.minfi.products.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.sprint.minfi.products.domain.Categories}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CategoriesResource {

    private final Logger log = LoggerFactory.getLogger(CategoriesResource.class);

    private static final String ENTITY_NAME = "productsCategories";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategoriesRepository categoriesRepository;

    private final CategoriesSearchRepository categoriesSearchRepository;

    public CategoriesResource(CategoriesRepository categoriesRepository, CategoriesSearchRepository categoriesSearchRepository) {
        this.categoriesRepository = categoriesRepository;
        this.categoriesSearchRepository = categoriesSearchRepository;
    }

    /**
     * {@code POST  /categories} : Create a new categories.
     *
     * @param categories the categories to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new categories, or with status {@code 400 (Bad Request)} if the categories has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/categories")
    public ResponseEntity<Categories> createCategories(@RequestBody Categories categories) throws URISyntaxException {
        log.debug("REST request to save Categories : {}", categories);
        if (categories.getId() != null) {
            throw new BadRequestAlertException("A new categories cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Categories result = categoriesRepository.save(categories);
        categoriesSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /categories} : Updates an existing categories.
     *
     * @param categories the categories to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categories,
     * or with status {@code 400 (Bad Request)} if the categories is not valid,
     * or with status {@code 500 (Internal Server Error)} if the categories couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/categories")
    public ResponseEntity<Categories> updateCategories(@RequestBody Categories categories) throws URISyntaxException {
        log.debug("REST request to update Categories : {}", categories);
        if (categories.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Categories result = categoriesRepository.save(categories);
        categoriesSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, categories.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /categories} : get all the categories.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of categories in body.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<Categories>> getAllCategories(Pageable pageable) {
        log.debug("REST request to get a page of Categories");
        Page<Categories> page = categoriesRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /categories/:id} : get the "id" categories.
     *
     * @param id the id of the categories to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the categories, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/categories/{id}")
    public ResponseEntity<Categories> getCategories(@PathVariable Long id) {
        log.debug("REST request to get Categories : {}", id);
        Optional<Categories> categories = categoriesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(categories);
    }

    /**
     * {@code DELETE  /categories/:id} : delete the "id" categories.
     *
     * @param id the id of the categories to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategories(@PathVariable Long id) {
        log.debug("REST request to delete Categories : {}", id);
        categoriesRepository.deleteById(id);
        categoriesSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/categories?query=:query} : search for the categories corresponding
     * to the query.
     *
     * @param query the query of the categories search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/categories")
    public ResponseEntity<List<Categories>> searchCategories(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Categories for query {}", query);
        Page<Categories> page = categoriesSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
