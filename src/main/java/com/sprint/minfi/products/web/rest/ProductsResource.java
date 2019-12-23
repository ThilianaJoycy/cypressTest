package com.sprint.minfi.products.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.elasticsearch.common.inject.Inject;
import org.hibernate.service.spi.InjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sprint.minfi.products.domain.Products;
import com.sprint.minfi.products.proxies.MicroserviceProductsProxy;
import com.sprint.minfi.products.repository.ProductsRepository;
import com.sprint.minfi.products.repository.search.ProductsSearchRepository;
import com.sprint.minfi.products.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

import com.sprint.minfi.products.beans.ProvidersBeans;;

/**
 * REST controller for managing {@link com.sprint.minfi.products.domain.Products}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProductsResource {

    private final Logger log = LoggerFactory.getLogger(ProductsResource.class);

    private static final String ENTITY_NAME = "productsProducts";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductsRepository productsRepository;
    
    private MicroserviceProductsProxy microserviceproxy;

    private final ProductsSearchRepository productsSearchRepository;

    @Inject
    public ProductsResource(ProductsRepository productsRepository, ProductsSearchRepository productsSearchRepository, MicroserviceProductsProxy proxy) {
        this.productsRepository = productsRepository;
        this.productsSearchRepository = productsSearchRepository;
        this.microserviceproxy = proxy;
    }

    /**
     * {@code POST  /products} : Create a new products.
     *
     * @param products the products to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new products, or with status {@code 400 (Bad Request)} if the products has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/products")
    public ResponseEntity<Products> createProducts(@RequestBody Products products) throws URISyntaxException {
        log.debug("REST request to save Products : {}", products);
        if (products.getId() != null) {
            throw new BadRequestAlertException("A new products cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Products result = productsRepository.save(products);
        productsSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/products/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /products} : Updates an existing products.
     *
     * @param products the products to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated products,
     * or with status {@code 400 (Bad Request)} if the products is not valid,
     * or with status {@code 500 (Internal Server Error)} if the products couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/products")
    public ResponseEntity<Products> updateProducts(@RequestBody Products products) throws URISyntaxException {
        log.debug("REST request to update Products : {}", products);
        if (products.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Products result = productsRepository.save(products);
        productsSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, products.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /products} : get all the products.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of products in body.
     */
    @GetMapping("/products")
    public ResponseEntity<List<Products>> getAllProducts(Pageable pageable) {
    	System.out.println("the all providers off micro service providers is ->" + this.microserviceproxy.getAllProviders());
    	List<ProvidersBeans> providers = this.microserviceproxy.getAllProviders();
    	System.out.println(providers.get(0));
        log.debug("REST request to get a page of Products");
        Page<Products> page = productsRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /products/:id} : get the "id" products.
     *
     * @param id the id of the products to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the products, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<Products> getProducts(@PathVariable Long id) {
        log.debug("REST request to get Products : {}", id);
        Optional<Products> products = productsRepository.findById(id);
        // ici on va changer la valeur d un des champs du produit renvoyé avec l une des données d un des providers recupéré depuis le micro service providers
//        providerProxy.getAllProviders();
        return ResponseUtil.wrapOrNotFound(products);
    }

    /**
     * {@code DELETE  /products/:id} : delete the "id" products.
     *
     * @param id the id of the products to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProducts(@PathVariable Long id) {
        log.debug("REST request to delete Products : {}", id);
        productsRepository.deleteById(id);
        productsSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/products?query=:query} : search for the products corresponding
     * to the query.
     *
     * @param query the query of the products search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/products")
    public ResponseEntity<List<Products>> searchProducts(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Products for query {}", query);
        Page<Products> page = productsSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
