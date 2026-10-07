module.exports = class AgregarDatosMedicamentoYObservacion1789350000000 {
    name = 'AgregarDatosMedicamentoYObservacion1789350000000'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "MEDICAMENTO" ADD ("Codigo_Medicamento" varchar2(100), "Presentacion" varchar2(150))`);
        await queryRunner.query(`ALTER TABLE "MOVIMIENTO_INVENTARIO" ADD "Observacion_Movimiento_Inventario" varchar2(500)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "MOVIMIENTO_INVENTARIO" DROP COLUMN "Observacion_Movimiento_Inventario"`);
        await queryRunner.query(`ALTER TABLE "MEDICAMENTO" DROP ("Codigo_Medicamento", "Presentacion")`);
    }
};
