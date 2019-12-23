package com.sprint.minfi.products.proxies;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.grant.password.ResourceOwnerPasswordResourceDetails;

public class Config {
	
//	@Value("${security.client-authorization.access-token-uri}")
//	private String accessTokenUri;
//	
//	@Value("${security.client-authorization.client-id}")
//	private String clientId;
//	
//	@Value("${security.client-authorization.client-secret}")
//	private String clientSecret;
	
	private OAuth2ProtectedResourceDetails ressource() {
		ResourceOwnerPasswordResourceDetails resourceDetails = new ResourceOwnerPasswordResourceDetails();
		resourceDetails.setUsername("admin");
		resourceDetails.setPassword("admin");
		resourceDetails.setAccessTokenUri("http://uaa/oauth/token");
		resourceDetails.setClientId("internal");
		resourceDetails.setClientSecret("internal");
		resourceDetails.setGrantType("password");
		return resourceDetails;
	}

}
