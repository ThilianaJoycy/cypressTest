package com.sprint.minfi.products.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.sprint.minfi.products.web.rest.TestUtil;

public class CategoriesTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Categories.class);
        Categories categories1 = new Categories();
        categories1.setId(1L);
        Categories categories2 = new Categories();
        categories2.setId(categories1.getId());
        assertThat(categories1).isEqualTo(categories2);
        categories2.setId(2L);
        assertThat(categories1).isNotEqualTo(categories2);
        categories1.setId(null);
        assertThat(categories1).isNotEqualTo(categories2);
    }
}
