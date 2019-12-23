package com.sprint.minfi.products.web.rest;

import com.sprint.minfi.products.ProductsApp;
import com.sprint.minfi.products.config.SecurityBeanOverrideConfiguration;
import com.sprint.minfi.products.domain.Categories;
import com.sprint.minfi.products.repository.CategoriesRepository;
import com.sprint.minfi.products.repository.search.CategoriesSearchRepository;
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
 * Integration tests for the {@link CategoriesResource} REST controller.
 */
@SpringBootTest(classes = {SecurityBeanOverrideConfiguration.class, ProductsApp.class})
public class CategoriesResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    @Autowired
    private CategoriesRepository categoriesRepository;

    /**
     * This repository is mocked in the com.sprint.minfi.products.repository.search test package.
     *
     * @see com.sprint.minfi.products.repository.search.CategoriesSearchRepositoryMockConfiguration
     */
    @Autowired
    private CategoriesSearchRepository mockCategoriesSearchRepository;

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

    private MockMvc restCategoriesMockMvc;

    private Categories categories;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CategoriesResource categoriesResource = new CategoriesResource(categoriesRepository, mockCategoriesSearchRepository);
        this.restCategoriesMockMvc = MockMvcBuilders.standaloneSetup(categoriesResource)
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
    public static Categories createEntity(EntityManager em) {
        Categories categories = new Categories()
            .libelle(DEFAULT_LIBELLE);
        return categories;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Categories createUpdatedEntity(EntityManager em) {
        Categories categories = new Categories()
            .libelle(UPDATED_LIBELLE);
        return categories;
    }

    @BeforeEach
    public void initTest() {
        categories = createEntity(em);
    }

    @Test
    @Transactional
    public void createCategories() throws Exception {
        int databaseSizeBeforeCreate = categoriesRepository.findAll().size();

        // Create the Categories
        restCategoriesMockMvc.perform(post("/api/categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categories)))
            .andExpect(status().isCreated());

        // Validate the Categories in the database
        List<Categories> categoriesList = categoriesRepository.findAll();
        assertThat(categoriesList).hasSize(databaseSizeBeforeCreate + 1);
        Categories testCategories = categoriesList.get(categoriesList.size() - 1);
        assertThat(testCategories.getLibelle()).isEqualTo(DEFAULT_LIBELLE);

        // Validate the Categories in Elasticsearch
        verify(mockCategoriesSearchRepository, times(1)).save(testCategories);
    }

    @Test
    @Transactional
    public void createCategoriesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = categoriesRepository.findAll().size();

        // Create the Categories with an existing ID
        categories.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategoriesMockMvc.perform(post("/api/categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categories)))
            .andExpect(status().isBadRequest());

        // Validate the Categories in the database
        List<Categories> categoriesList = categoriesRepository.findAll();
        assertThat(categoriesList).hasSize(databaseSizeBeforeCreate);

        // Validate the Categories in Elasticsearch
        verify(mockCategoriesSearchRepository, times(0)).save(categories);
    }


    @Test
    @Transactional
    public void getAllCategories() throws Exception {
        // Initialize the database
        categoriesRepository.saveAndFlush(categories);

        // Get all the categoriesList
        restCategoriesMockMvc.perform(get("/api/categories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categories.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)));
    }
    
    @Test
    @Transactional
    public void getCategories() throws Exception {
        // Initialize the database
        categoriesRepository.saveAndFlush(categories);

        // Get the categories
        restCategoriesMockMvc.perform(get("/api/categories/{id}", categories.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(categories.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE));
    }

    @Test
    @Transactional
    public void getNonExistingCategories() throws Exception {
        // Get the categories
        restCategoriesMockMvc.perform(get("/api/categories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCategories() throws Exception {
        // Initialize the database
        categoriesRepository.saveAndFlush(categories);

        int databaseSizeBeforeUpdate = categoriesRepository.findAll().size();

        // Update the categories
        Categories updatedCategories = categoriesRepository.findById(categories.getId()).get();
        // Disconnect from session so that the updates on updatedCategories are not directly saved in db
        em.detach(updatedCategories);
        updatedCategories
            .libelle(UPDATED_LIBELLE);

        restCategoriesMockMvc.perform(put("/api/categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCategories)))
            .andExpect(status().isOk());

        // Validate the Categories in the database
        List<Categories> categoriesList = categoriesRepository.findAll();
        assertThat(categoriesList).hasSize(databaseSizeBeforeUpdate);
        Categories testCategories = categoriesList.get(categoriesList.size() - 1);
        assertThat(testCategories.getLibelle()).isEqualTo(UPDATED_LIBELLE);

        // Validate the Categories in Elasticsearch
        verify(mockCategoriesSearchRepository, times(1)).save(testCategories);
    }

    @Test
    @Transactional
    public void updateNonExistingCategories() throws Exception {
        int databaseSizeBeforeUpdate = categoriesRepository.findAll().size();

        // Create the Categories

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCategoriesMockMvc.perform(put("/api/categories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(categories)))
            .andExpect(status().isBadRequest());

        // Validate the Categories in the database
        List<Categories> categoriesList = categoriesRepository.findAll();
        assertThat(categoriesList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Categories in Elasticsearch
        verify(mockCategoriesSearchRepository, times(0)).save(categories);
    }

    @Test
    @Transactional
    public void deleteCategories() throws Exception {
        // Initialize the database
        categoriesRepository.saveAndFlush(categories);

        int databaseSizeBeforeDelete = categoriesRepository.findAll().size();

        // Delete the categories
        restCategoriesMockMvc.perform(delete("/api/categories/{id}", categories.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Categories> categoriesList = categoriesRepository.findAll();
        assertThat(categoriesList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Categories in Elasticsearch
        verify(mockCategoriesSearchRepository, times(1)).deleteById(categories.getId());
    }

    @Test
    @Transactional
    public void searchCategories() throws Exception {
        // Initialize the database
        categoriesRepository.saveAndFlush(categories);
        when(mockCategoriesSearchRepository.search(queryStringQuery("id:" + categories.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(categories), PageRequest.of(0, 1), 1));
        // Search the categories
        restCategoriesMockMvc.perform(get("/api/_search/categories?query=id:" + categories.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categories.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)));
    }
}
