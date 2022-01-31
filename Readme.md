# MKFW-CORE2

Proyecto basado en mi antiguo arquetipo **[mkfm-core](https://github.com/jfcaballerop/mkfm-core.git)** actualizado y mejorado para la ocasión ;)

## Arquetipo

La arquitectura sobre la que se ha basado el proyecto, es una compilación de mejores prácticas y experiencia personal:
- Estructura del proyecto:
	- **backups:** sobre todo por si queremos inyectar en el arranque datos a la BD.
	- **bin:** pudieramos querer sacar la ejecución del servicio ppal fuera del *app.js*
	- **config:** ficheros de config donde se inyectarían las *env*
	- **docs:** documentación *OpenApi*
	- **Querys:** path para guardar aquellas consultas complejas que no quisieramos hacer a través de *Mongoose*
	- **src:** Carpeta del proeyecto
		- **controllers** Controladores de la app
		- **helpers** Funciones de ayuda a los servicios
		- **inteface** 'Typado' (en caso de usar TypeScript se deja preparado)
		- **mappers** Mapeadores para transformar DBObjects a DTO
		- **models** Modelos de DB usados
		- **routes** Rutas del proyecto que luego son inyectadas a *Express*
		- **services** Servicios con la lógica de negocio de acceso a DB
		- **utils** Funciones comunes
		- **views** Vistas en caso de necesitar, ejemplo: usar *ejs*
	- **tests:** Carpeta con los tests de *Jest*
		- **integration:** Test de integración hechos con *supertest*

## Deploy

Se usa *docker-compose* para poder tener el deploy y el live coding simultaneo.
> Para el control de los accesos a BD y demás se usa *dotenv* y el archivo raíz **.env**

> En el caso de que el entorno se establezca fuera de *PROD* con la variable ***NODE_ENV*** el cual debe ser seteado en un entorno productivo.
### Arrancar entorno live coding

Arrancar el entorno con *Docker-compose:*

```
$ docker-compose up -d --build

$ docker-compose down
```

> Tener en cuenta que debemos usar *--build* (al tener dentro además nodemon) nos permite ver los cambios de nuestro código, ya que le indica a COMPOSE que reconstruya la imagen para nuestro contenedor de node.

> Por defecto se ha configurado que arranque el entorno de *DEV*, simplemente cambiando el *.dockerfile* o creando varios ficheros para cada entorno se podría usar luego con **Jenkins** para inyectar las variables necesarias.

### Arrancar entorno productivo

Se debe cambiar la ejecución del npm para ejecutar el microservicio de *develop* a *prod* en el *Dockerfile:*

```
CMD npm run dev
.....
CMD npm start

```

Hecho lo anterior, procedemos a arrancar el entorno *Docker-compose:*

```
$ docker-compose up -d --build

$ docker-compose down
```
***
## Configuraciones

El proyecto se deja configurado con el fichero de env. No usar para entorno de proucción e inyectar el suyo propio.

### Environment

Hay que crear (o inyectar en caso de despliegue) el fichero .env

*.env sample*

	MONGODB_USER=root
	MONGODB_PASSWORD=123456
	MONGODB_DATABASE=mrknightdb
	MONGODB_LOCAL_PORT=7017
	MONGODB_DOCKER_PORT=27017

	NODE_LOCAL_PORT=3000
	NODE_DOCKER_PORT=3000

### Node

Probar Docker:
```` 
$ docker build -t jfcaballero/tax-dev .
$ docker run -dp 3000:3000 jfcaballero/tax-dev
````

### MongoDB

***NOTA:*** *La BD al ser creada con Docker_compose está sin poblar. Las alternativas pasan por ejecutar los TEST para poblarla apuntando a la BD real y no de TEST o bien ejecutar los endpoints con los ejemplos tal como están en los tests.*

Se configura a través de docker-compose.
Hay dos cofiguraciones, una para un MongoDB Standalone, y otro para el stack completo.

Para arrancar standalone (para uso con los TESTs por ejemplo):

```

$ docker-compose -f docker-compose-mongo.yml up --build

```

***
## OPEN-API ##

Se deja configurado con swagger la parte de open-api para que sea más fácil su testeo.
Una vez arrancado el entorno se puede probar aquí <http://localhost:3000/api-docs>

***

## TESTs

Se usa el entorno de *jest* para la realizacion de las pruebas unitarias.

Para las pruebas de integración se hace uso de *supertest*.

Ambos entornos están configurados en la aplicación para que a través de la vble de entorno *NODE_ENV* se conecte una BD diferente de test y un puerto *3001* diferente.

Se deja un script en *package.json* para la ejecución de los tests.

	$ npm run test


### Configuracion MongoDB

Para un entorno de testing final, no se debe usar un schema o DB como tal, sino tirar de Mocks o un ecosistema preparado, pero para el ejemplo actual se hace uso de un entorno específico:

	MONGODB_DATABASE_TEST=mrknightdbtest

Se debe arrancar MogoDB standalone como se explica más arriba.


# NOTAS del @utor

- El equipo para el desarrollo usado es sobre una plataforma de **Window$ 11**, aunque para poder hacer un deploy & code sin perder tiempo, se usa docker-compose.
- si sobre este entorno se quisiera hacer uso de las variables de entorno entre diferentes plata formas *Mac, Linux o Windows* se podría hacer uso de la herramienta ***cross-env***

```
$ npm i cross-env
...
$ cross-env NODE_ENV=dev nodemon index.js
```

- Para el Linter se configura de manera inicial ESLint con reglas de Standar

```
	npm init @eslint/config
```

- Para las pruebas no se usa TDD y por eso la cobertura no es mucha.
- Se añaden pruebas de integración (ver config. Tests y Mongodb standalone más arriba).
- No está tipada la aplicación, a falta de incluir en este proyecto el soporte para TypeScript (algo para mí bastante necesario y util).
- Se deja hecha la estructura en parte con DDD y creado un mapper para simular una transformación del Objeto customer hacia el frontal con su DTO. Lo ideal es usar alguna librería ORM como *sequelize*
- No se ha configurado ni creado la parte *Pub/Sub* para a través de EvenEmitter poder efectuar acciones async como el logeo, o registro de actividad (Ej. en Elastic)
- No hay generado ningúna suscripción ni se usa Event Driven, que podría estar bien sobre todo para estar suscritos a una RabbitMQ, Azure queues o similar, e incluso conexión con Kafka que pudiera alimentar diferentes flujos BigData.
- Por último quedaría haber dejado preparado algún WebSocket con socket.io para crear eventos con el frontal (por ejemplo).
