# Velmar-backend
Explora una experiencia completa de compras en línea con mi ecommerce ficticio. Descubre productos organizados por categorías y marcas, administra tu cuenta de usuario y disfruta de la facilidad de comprar con carritos y pedidos. Los vendedores pueden editar y eliminar productos, marcas y categorías para mantener un catálogo actualizado. La autenticación segura garantiza la protección de los datos personales. Bienvenido a una simulación realista de ecommerce, donde la eficiencia y la seguridad se unen para ofrecer una experiencia de usuario excepcional.

[Documentation in English](README.md)

## Tabla de contenidos
- [Clonar el proyecto](#clone-the-project)
- [Configuración de Docker](#docker-setup)
- [Instalación de dependencias](#dependency-installation)
- [Variables de entorno](#environment-variables)
- [Ejecución de contenedores Docker](#Running-Docker-containers)
- [Iniciar el proyecto](#Starting-the-project)

***

## Clonar el proyecto
Para empezar, necesitarás clonar el repositorio del proyecto en el directorio que desees. Utiliza el siguiente comando:

```git clone https://github.com/diegonacimiento/velmar-backend.git```

***

## Configuración de Docker
Velmar utiliza Docker para la contenerización. Si aún no lo has hecho, por favor  [descarga e instala Docker](https://www.docker.com/products/docker-desktop/). Una vez instalado Docker, asegúrate de que esté en ejecución.

En el archivo "docker.compose-yml", encontrarás configuraciones para establecer un contenedor PostgreSQL con configuraciones de usuario y contraseña. Aquí tienes un ejemplo:

```javascript
´version: '3.8'
services:
  postgres:
    image: postgres:15
    env_file:
      - .env
    ports:
      - 5432:5432
    volumes:
      - ./postgres_data:/var/lib/postgresql/data

  pgadmin:
      image: dpage/pgadmin4
      env_file:
        - .env
      ports:
        - "5050:80"
      depends_on:
        - postgres´
```

***

## Instalación de dependencias
Para instalar las dependencias necesarias para Velmar, ejecuta el siguiente comando:

``` npm install ```

***

## Variables de entorno
Velmar depende de algunas variables de entorno. Debes crear un archivo ".env" en el directorio raíz del proyecto y definir estas variables. Aquí tienes un ejemplo de un archivo ".env" con explicaciones:
```
POSTGRES_USER="diego" 
POSTGRES_PASSWORD="1234admin"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_DB="velmar"
DATABASE_URL="postgres://diego:1234admin@localhost:5432/velmar"
PGADMIN_DEFAULT_EMAIL=''
PGADMIN_DEFAULT_PASSWORD=''
API_KEY=""
API_SECRET=""
GG_EMAIL=""
GG_KEY=""
JWT_SECRET=""
JWT_SECRET_RECOVERY=""
```

- Para DATABASE_URL, sigue este formato:  postgres://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST:POSTGRES_PORT/POSTGRES_NAME.

- Debes configurar tu propia API_KEY y API_SECRET.

- JWT_SECRET y JWT_SECRET_RECOVERY deben tener claves únicas. Puedes generarlas [aquí](https://keygen.io/#fakeLink/).

#### Envío de correos electrónicos
Para configurar el envío de correos electrónicos, asegúrate de tener una cuenta de Google vinculada a tu número de teléfono y tener la verificación en dos pasos habilitada en "Administración de cuenta" ⇒ "Seguridad" ⇒ "Acceso de Google". Luego, ve a "Contraseñas de aplicación" y agrega 'NodeApp'.

- GG_EMAIL: Utiliza el correo electrónico para el cual generaste la contraseña de la aplicación.

- GG_KEY: Utiliza la contraseña generada; no la compartas con nadie.

***

# Ejecución de contenedores Docker
Para iniciar los contenedores Docker de PostgreSQL y PGAdmin, utiliza los siguientes comandos:

```
docker-compose up -d postgres
docker-compose up -d pgadmin
```

***

# Migraciones
Debes generar y correr una migración para crear las tablas. Ejecuta los siguientes comandos:

```npm run migrations:generate ./src/database/migrations/create-tables```

```npm run migrations:run```

***

# Iniciar el proyecto
Para iniciar el proyecto, utiliza el siguiente comando:

```npm run start:dev```

Este comando lanzará la API, y podrás comenzar a usarla según lo previsto.

***

Esta documentación debería proporcionarte la información necesaria para configurar y utilizar velmar-backend. Si tienes más preguntas o encuentras problemas, no dudes en solicitar ayuda.