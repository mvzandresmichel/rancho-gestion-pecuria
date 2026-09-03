RANCHO · GESTIÓN PECUARIA V5

Esta versión cambia la estructura a MULTI-RANCHO.

Incluye:
- Alta y edición de varios ranchos.
- Inventario independiente por rancho.
- Aretes únicos dentro de cada rancho.
- Ficha de animales.
- Genealogía básica.
- Eventos reproductivos.
- Eventos sanitarios.
- Producción de leche.
- Actividad consolidada.
- Reportes por rancho.
- Respaldo/restauración de toda la plataforma.
- PWA instalable cuando se sirve desde HTTPS.

ARQUITECTURA DE DATOS
Rancho -> Animales -> Eventos.
Cada animal y evento queda asociado mediante farmId.

IMPORTANTE SOBRE LA NUBE
V5 todavía es una edición privada LOCAL. No se incluyeron claves, contraseñas ni servicios de nube ficticios.
Para sincronizar realmente varios teléfonos/computadoras se necesita:
1) elegir un proveedor de autenticación/base de datos;
2) crear el proyecto/cuenta;
3) configurar credenciales;
4) aplicar reglas de seguridad por usuario y rancho;
5) desplegar la PWA mediante HTTPS.

Esto evita almacenar credenciales inseguras dentro del ZIP.
