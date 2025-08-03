package com.github.pooya1361.makerspace.security;

import com.github.pooya1361.makerspace.model.User;
import com.github.pooya1361.makerspace.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Convert user roles to Spring Security authorities
        Collection<GrantedAuthority> authorities = getUserAuthorities(user);

        // Debug log - remove in production
        System.out.println("Loading user: " + email + " with authorities: " + authorities);

        // Return Spring Security's User object with authorities
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }

    private Collection<GrantedAuthority> getUserAuthorities(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        if (user.getUserType() != null) {
            // Add the user's actual authority
            authorities.add(new SimpleGrantedAuthority(user.getUserType().name()));

            // Create hierarchy: higher roles get all lower-level authorities too
            switch (user.getUserType()) {
                case SUPERADMIN:
                    authorities.add(new SimpleGrantedAuthority("ADMIN"));
                    authorities.add(new SimpleGrantedAuthority("INSTRUCTOR"));
                    authorities.add(new SimpleGrantedAuthority("NORMAL"));
                    break;
                case ADMIN:
                    authorities.add(new SimpleGrantedAuthority("INSTRUCTOR"));
                    authorities.add(new SimpleGrantedAuthority("NORMAL"));
                    break;
                case INSTRUCTOR:
                    authorities.add(new SimpleGrantedAuthority("NORMAL"));
                    break;
                case NORMAL:
                    // NORMAL only gets NORMAL authority (already added above)
                    break;
            }
        } else {
            // Default authority if userType is null
            authorities.add(new SimpleGrantedAuthority("NORMAL"));
        }

        return authorities;
    }
}