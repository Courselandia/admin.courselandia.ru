FROM php:8.1-fpm

COPY . .

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    nano \
    libcurl4-openssl-dev \
    pkg-config  \
    libssl-dev \
    openssl

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Expose needed ports
EXPOSE 80 443 25

# Set working directory
WORKDIR /var/www
