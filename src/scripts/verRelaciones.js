const AppDataSource = require('../config/database');

AppDataSource.initialize()
    .then(() => {

        console.log('\n=== RELACIONES DETECTADAS POR TYPEORM ===\n');

        AppDataSource.entityMetadatas.forEach((entity) => {

            console.log(`\nEntidad: ${entity.name}`);

            if (entity.relations.length === 0) {
                console.log('  Sin relaciones');
            }

            entity.relations.forEach((relation) => {
                console.log(
                    `  ${relation.propertyName} -> ${relation.inverseEntityMetadata.name}`
                );
            });
        });

        return AppDataSource.destroy();
    })
    .catch((error) => {
        console.error('Error:', error);
    });