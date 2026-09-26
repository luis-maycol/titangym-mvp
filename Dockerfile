FROM php:8.2-apache

# Instalar extensiones de base de datos y utilidades
RUN apt-get update && apt-get install -y libzip-dev zip unzip \
    && docker-php-ext-install pdo pdo_mysql zip

# Habilitar reescritura de URLs para Laravel
RUN a2enmod rewrite

# Configurar la carpeta public como la ruta principal
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Adaptar el puerto dinámico que Render requiere
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Copiar tu proyecto
COPY . /var/www/html

# Instalar dependencias de Laravel
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader

# Dar permisos a las carpetas de sistema
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache