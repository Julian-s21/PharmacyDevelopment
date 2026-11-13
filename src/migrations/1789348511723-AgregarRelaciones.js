/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AgregarRelaciones1789348511723 {
    name = 'AgregarRelaciones1789348511723'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "MEDICAMENTO" ADD CONSTRAINT "FK_951a64f31b65ef3003fc268f362" FOREIGN KEY ("ID_Categoria") REFERENCES "CATEGORIA_MEDICAMENTO" ("ID_Categoria")`);
        await queryRunner.query(`ALTER TABLE "INVENTARIO" ADD CONSTRAINT "FK_a5d25a0234942d7e2632d88c84b" FOREIGN KEY ("ID_Sucursal") REFERENCES "SUCURSAL" ("ID_Sucursal")`);
        await queryRunner.query(`ALTER TABLE "INVENTARIO" ADD CONSTRAINT "FK_49fe592faaa85422bb4171f5476" FOREIGN KEY ("ID_Medicamento") REFERENCES "MEDICAMENTO" ("ID_Medicamento")`);
        await queryRunner.query(`ALTER TABLE "MOVIMIENTO_INVENTARIO" ADD CONSTRAINT "FK_7453a3fd6707b1419e495b5eac9" FOREIGN KEY ("ID_Inventario") REFERENCES "INVENTARIO" ("ID_Inventario")`);
        await queryRunner.query(`ALTER TABLE "MOVIMIENTO_INVENTARIO" ADD CONSTRAINT "FK_16f9b9e934894a528ee8432515f" FOREIGN KEY ("ID_Usuario") REFERENCES "USUARIO" ("ID_Usuario")`);
        await queryRunner.query(`ALTER TABLE "TRANSFERENCIA" ADD CONSTRAINT "FK_03a3354bb062306b44c63f196bc" FOREIGN KEY ("ID_Sucursal_Origen") REFERENCES "SUCURSAL" ("ID_Sucursal")`);
        await queryRunner.query(`ALTER TABLE "TRANSFERENCIA" ADD CONSTRAINT "FK_8b9688bc7ab70cd8b01f8ddac3d" FOREIGN KEY ("ID_Sucursal_Destino") REFERENCES "SUCURSAL" ("ID_Sucursal")`);
        await queryRunner.query(`ALTER TABLE "TRANSFERENCIA" ADD CONSTRAINT "FK_108ccfc57e39443e65747d44806" FOREIGN KEY ("ID_Usuario") REFERENCES "USUARIO" ("ID_Usuario")`);
        await queryRunner.query(`ALTER TABLE "DETALLE_TRANSFERENCIA" ADD CONSTRAINT "FK_8f7358d0b0e4c62e7af4ea0b6d2" FOREIGN KEY ("ID_Transferencia") REFERENCES "TRANSFERENCIA" ("ID_Transferencia")`);
        await queryRunner.query(`ALTER TABLE "DETALLE_TRANSFERENCIA" ADD CONSTRAINT "FK_cfbd3bade167c5ebaa711daa8b5" FOREIGN KEY ("ID_Medicamento") REFERENCES "MEDICAMENTO" ("ID_Medicamento")`);
        await queryRunner.query(`ALTER TABLE "DISTRIBUCION" ADD CONSTRAINT "FK_bc273411b9b41d1083363a01962" FOREIGN KEY ("ID_Sucursal") REFERENCES "SUCURSAL" ("ID_Sucursal")`);
        await queryRunner.query(`ALTER TABLE "DISTRIBUCION" ADD CONSTRAINT "FK_a4477c8f31b49201bfecfe45d00" FOREIGN KEY ("ID_Usuario") REFERENCES "USUARIO" ("ID_Usuario")`);
        await queryRunner.query(`ALTER TABLE "DETALLE_DISTRIBUCION" ADD CONSTRAINT "FK_682ad06ef2b8e0b656f8868354b" FOREIGN KEY ("ID_Distribucion") REFERENCES "DISTRIBUCION" ("ID_Distribucion")`);
        await queryRunner.query(`ALTER TABLE "DETALLE_DISTRIBUCION" ADD CONSTRAINT "FK_b916633eee6602127a0a7138d6a" FOREIGN KEY ("ID_Medicamento") REFERENCES "MEDICAMENTO" ("ID_Medicamento")`);
        await queryRunner.query(`ALTER TABLE "MOVIMIENTO_FINANCIERO" ADD CONSTRAINT "FK_af99d90884fd358a3da2158e2d0" FOREIGN KEY ("ID_Sucursal") REFERENCES "SUCURSAL" ("ID_Sucursal")`);
        await queryRunner.query(`ALTER TABLE "MOVIMIENTO_FINANCIERO" ADD CONSTRAINT "FK_d3c8fb4d695e1dfa69bb1a5e792" FOREIGN KEY ("ID_Usuario") REFERENCES "USUARIO" ("ID_Usuario")`);
        await queryRunner.query(`ALTER TABLE "GASTO_PLANILLA" ADD CONSTRAINT "FK_705707f3b34f9f3584becd54637" FOREIGN KEY ("ID_Sucursal") REFERENCES "SUCURSAL" ("ID_Sucursal")`);
        await queryRunner.query(`ALTER TABLE "GASTO_PLANILLA" ADD CONSTRAINT "FK_7735f670e85b2cf6345439d785e" FOREIGN KEY ("ID_Usuario") REFERENCES "USUARIO" ("ID_Usuario")`);
        await queryRunner.query(`ALTER TABLE "ACTIVO_FIJO" ADD CONSTRAINT "FK_93ac582cc1e33d59e9e41cdbdc0" FOREIGN KEY ("ID_Sucursal") REFERENCES "SUCURSAL" ("ID_Sucursal")`);
        await queryRunner.query(`ALTER TABLE "FLUJO_EFECTIVO" ADD CONSTRAINT "FK_96315558e089e821e91526891c1" FOREIGN KEY ("ID_Sucursal") REFERENCES "SUCURSAL" ("ID_Sucursal")`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "FLUJO_EFECTIVO" DROP CONSTRAINT "FK_96315558e089e821e91526891c1"`);
        await queryRunner.query(`ALTER TABLE "ACTIVO_FIJO" DROP CONSTRAINT "FK_93ac582cc1e33d59e9e41cdbdc0"`);
        await queryRunner.query(`ALTER TABLE "GASTO_PLANILLA" DROP CONSTRAINT "FK_7735f670e85b2cf6345439d785e"`);
        await queryRunner.query(`ALTER TABLE "GASTO_PLANILLA" DROP CONSTRAINT "FK_705707f3b34f9f3584becd54637"`);
        await queryRunner.query(`ALTER TABLE "MOVIMIENTO_FINANCIERO" DROP CONSTRAINT "FK_d3c8fb4d695e1dfa69bb1a5e792"`);
        await queryRunner.query(`ALTER TABLE "MOVIMIENTO_FINANCIERO" DROP CONSTRAINT "FK_af99d90884fd358a3da2158e2d0"`);
        await queryRunner.query(`ALTER TABLE "DETALLE_DISTRIBUCION" DROP CONSTRAINT "FK_b916633eee6602127a0a7138d6a"`);
        await queryRunner.query(`ALTER TABLE "DETALLE_DISTRIBUCION" DROP CONSTRAINT "FK_682ad06ef2b8e0b656f8868354b"`);
        await queryRunner.query(`ALTER TABLE "DISTRIBUCION" DROP CONSTRAINT "FK_a4477c8f31b49201bfecfe45d00"`);
        await queryRunner.query(`ALTER TABLE "DISTRIBUCION" DROP CONSTRAINT "FK_bc273411b9b41d1083363a01962"`);
        await queryRunner.query(`ALTER TABLE "DETALLE_TRANSFERENCIA" DROP CONSTRAINT "FK_cfbd3bade167c5ebaa711daa8b5"`);
        await queryRunner.query(`ALTER TABLE "DETALLE_TRANSFERENCIA" DROP CONSTRAINT "FK_8f7358d0b0e4c62e7af4ea0b6d2"`);
        await queryRunner.query(`ALTER TABLE "TRANSFERENCIA" DROP CONSTRAINT "FK_108ccfc57e39443e65747d44806"`);
        await queryRunner.query(`ALTER TABLE "TRANSFERENCIA" DROP CONSTRAINT "FK_8b9688bc7ab70cd8b01f8ddac3d"`);
        await queryRunner.query(`ALTER TABLE "TRANSFERENCIA" DROP CONSTRAINT "FK_03a3354bb062306b44c63f196bc"`);
        await queryRunner.query(`ALTER TABLE "MOVIMIENTO_INVENTARIO" DROP CONSTRAINT "FK_16f9b9e934894a528ee8432515f"`);
        await queryRunner.query(`ALTER TABLE "MOVIMIENTO_INVENTARIO" DROP CONSTRAINT "FK_7453a3fd6707b1419e495b5eac9"`);
        await queryRunner.query(`ALTER TABLE "INVENTARIO" DROP CONSTRAINT "FK_49fe592faaa85422bb4171f5476"`);
        await queryRunner.query(`ALTER TABLE "INVENTARIO" DROP CONSTRAINT "FK_a5d25a0234942d7e2632d88c84b"`);
        await queryRunner.query(`ALTER TABLE "MEDICAMENTO" DROP CONSTRAINT "FK_951a64f31b65ef3003fc268f362"`);
    }
}
