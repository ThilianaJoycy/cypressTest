package com.sprint.minfi.products.proxies;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.sprint.minfi.products.beans.ProvidersBeans;
import com.sprint.minfi.products.client.AuthorizedFeignClient;

import feign.Headers;

import java.util.List;

@AuthorizedFeignClient(name = "providers")
public interface MicroserviceProductsProxy {

	@GetMapping("/api/providers")
    public List<ProvidersBeans> getAllProviders();
	
//	@GetMapping("/providers/{id}")
//    public ResponseEntity<ProvidersBeans> getProviders(@PathVariable("id") Long id);
}
