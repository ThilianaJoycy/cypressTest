package com.sprint.minfi.products.web.rest;

import com.sprint.minfi.products.ProductsApp;
import com.sprint.minfi.products.config.SecurityBeanOverrideConfiguration;
import com.sprint.minfi.products.domain.Products;
import com.sprint.minfi.products.repository.ProductsRepository;
import com.sprint.minfi.products.repository.search.ProductsSearchRepository;
import com.sprint.minfi.products.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static com.sprint.minfi.products.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ProductsResource} REST controller.
 */
@SpringBootTest(classes = {SecurityBeanOverrideConfiguration.class, ProductsApp.class})
public class ProductsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CATEGORY = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY = "BBBBBBBBBB";

    private static final Integer DEFAULT_QTTY = 1;
    private static final Integer UPDATED_QTTY = 2;

    private static final String DEFAULT_PROVIDER = "AAAAAAAAAA";
    private static final String UPDATED_PROVIDER = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRICE = 1;
    private static final Integer UPDATED_PRICE = 2;

    @Autowired
    private ProductsRepository productsRepository;

    /**
     * This repository is mocked in the com.sprint.minfi.products.repository.search test package.
     *
     * @see com.sprint.minfi.products.repository.search.ProductsSearchRepositoryMockConfiguration
     */
    @Autowired
    private ProductsSearchRepository mockProductsSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restProductsMockMvc;

    private Products products;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductsResource productsResource = new ProductsResource(productsRepository, mockProductsSearchRepository, null);
        this.restProductsMockMvc = MockMvcBuilders.standaloneSetup(productsResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Products createEntity(EntityManager em) {
        Products products = new Products()
            .name(DEFAULT_NAME)
            .category(DEFAULT_CATEGORY)
            .qtty(DEFAULT_QTTY)
            .provider(DEFAULT_PROVIDER)
            .price(DEFAULT_PRICE);
        return products;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Products createUpdatedEntity(EntityManager em) {
        Products products = new Products()
            .name(UPDATED_NAME)
            .category(UPDATED_CATEGORY)
            .qtty(UPDATED_QTTY)
            .provider(UPDATED_PROVIDER)
            .price(UPDATED_PRICE);
        return products;
    }

    @BeforeEach
    public void initTest() {
        products = createEntity(em);
    }

    @Test
    @Transactional
    public void createProducts() throws Exception {
        int databaseSizeBeforeCreate = productsRepository.findAll().size();

        // Create the Products
        restProductsMockMvc.perform(post("/api/products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(products)))
            .andExpect(status().isCreated());

        // Validate the Products in the database
        List<Products> productsList = productsRepository.findAll();
        assertThat(productsList).hasSize(databaseSizeBeforeCreate + 1);
        Products testProducts = productsList.get(productsList.size() - 1);
        assertThat(testProducts.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProducts.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testProducts.getQtty()).isEqualTo(DEFAULT_QTTY);
        assertThat(testProducts.getProvider()).isEqualTo(DEFAULT_PROVIDER);
        assertThat(testProducts.getPrice()).isEqualTo(DEFAULT_PRICE);

        // Validate the Products in Elasticsearch
        verify(mockProductsSearchRepository, times(1)).save(testProducts);
    }

    @Test
    @Transactional
    public void createProductsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productsRepository.findAll().size();

        // Create the Products with an existing ID
        products.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductsMockMvc.perform(post("/api/products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(products)))
            .andExpect(status().isBadRequest());

        // Validate the Products in the database
        List<Products> productsList = productsRepository.findAll();
        assertThat(productsList).hasSize(databaseSizeBeforeCreate);

        // Validate the Products in Elasticsearch
        verify(mockProductsSearchRepository, times(0)).save(products);
    }


    @Test
    @Transactional
    public void getAllProducts() throws Exception {
        // Initialize the database
        productsRepository.saveAndFlush(products);

        // Get all the productsList
        restProductsMockMvc.perform(get("/api/products?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(products.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY)))
            .andExpect(jsonPath("$.[*].qtty").value(hasItem(DEFAULT_QTTY)))
            .andExpect(jsonPath("$.[*].provider").value(hasItem(DEFAULT_PROVIDER)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)));
    }
    
    @Test
    @Transactional
    public void getProducts() throws Exception {
        // Initialize the database
        productsRepository.saveAndFlush(products);

        // Get the products
        restProductsMockMvc.perform(get("/api/products/{id}", products.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(products.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY))
            .andExpect(jsonPath("$.qtty").value(DEFAULT_QTTY))
            .andExpect(jsonPath("$.provider").value(DEFAULT_PROVIDER))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE));
    }

    @Test
    @Transactional
    public void getNonExistingProducts() throws Exception {
        // Get the products
        restProductsMockMvc.perform(get("/api/products/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProducts() throws Exception {
        // Initialize the database
        productsRepository.saveAndFlush(products);

        int databaseSizeBeforeUpdate = productsRepository.findAll().size();

        // Update the products
        Products updatedProducts = productsRepository.findById(products.getId()).get();
        // Disconnect from session so that the updates on updatedProducts are not directly saved in db
        em.detach(updatedProducts);
        updatedProducts
            .name(UPDATED_NAME)
            .category(UPDATED_CATEGORY)
            .qtty(UPDATED_QTTY)
            .provider(UPDATED_PROVIDER)
            .price(UPDATED_PRICE);

        restProductsMockMvc.perform(put("/api/products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProducts)))
            .andExpect(status().isOk());

        // Validate the Products in the database
        List<Products> productsList = productsRepository.findAll();
        assertThat(productsList).hasSize(databaseSizeBeforeUpdate);
        Products testProducts = productsList.get(productsList.size() - 1);
        assertThat(testProducts.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProducts.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testProducts.getQtty()).isEqualTo(UPDATED_QTTY);
        assertThat(testProducts.getProvider()).isEqualTo(UPDATED_PROVIDER);
        assertThat(testProducts.getPrice()).isEqualTo(UPDATED_PRICE);

        // Validate the Products in Elasticsearch
        verify(mockProductsSearchRepository, times(1)).save(testProducts);
    }

    @Test
    @Transactional
    public void updateNonExistingProducts() throws Exception {
        int databaseSizeBeforeUpdate = productsRepository.findAll().size();

        // Create the Products

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductsMockMvc.perform(put("/api/products")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(products)))
            .andExpect(status().isBadRequest());

        // Validate the Products in the database
        List<Products> productsList = productsRepository.findAll();
        assertThat(productsList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Products in Elasticsearch
        verify(mockProductsSearchRepository, times(0)).save(products);
    }

    @Test
    @Transactional
    public void deleteProducts() throws Exception {
        // Initialize the database
        productsRepository.saveAndFlush(products);

        int databaseSizeBeforeDelete = productsRepository.findAll().size();

        // Delete the products
        restProductsMockMvc.perform(delete("/api/products/{id}", products.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Products> productsList = productsRepository.findAll();
        assertThat(productsList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Products in Elasticsearch
        verify(mockProductsSearchRepository, times(1)).deleteById(products.getId());
    }

    @Test
    @Transactional
    public void searchProducts() throws Exception {
        // Initialize the database
        productsRepository.saveAndFlush(products);
        when(mockProductsSearchRepository.search(queryStringQuery("id:" + products.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(products), PageRequest.of(0, 1), 1));
        // Search the products
        restProductsMockMvc.perform(get("/api/_search/products?query=id:" + products.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(products.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY)))
            .andExpect(jsonPath("$.[*].qtty").value(hasItem(DEFAULT_QTTY)))
            .andExpect(jsonPath("$.[*].provider").value(hasItem(DEFAULT_PROVIDER)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)));
    }
}
